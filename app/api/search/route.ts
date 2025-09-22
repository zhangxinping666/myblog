import { NextRequest, NextResponse } from 'next/server'
import Fuse from 'fuse.js'
import { getAllPosts } from '@/lib/mdx/mdx'
import { withApiHandler, createOptionsHandler, createSuccessResponse, API_ERRORS } from '@/lib/services/api'

// 搜索结果类型
interface SearchResult {
  id: string
  title: string
  slug: string
  description: string
  content: string
  date: string
  category?: string
  tags?: string[]
  author?: string
  score: number
  highlights: {
    title?: string[]
    description?: string[]
    content?: string[]
    tags?: string[]
  }
}

// 搜索响应类型
interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  page: number
  pageSize: number
  totalPages: number
  searchTime: number
}

// Fuse.js 配置
const fuseOptions = {
  keys: [
    {
      name: 'frontMatter.title',
      weight: 0.4
    },
    {
      name: 'frontMatter.description', 
      weight: 0.3
    },
    {
      name: 'content',
      weight: 0.2
    },
    {
      name: 'frontMatter.tags',
      weight: 0.1
    }
  ],
  threshold: 0.4, // 0.0 完全匹配，1.0 匹配任何内容
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
  findAllMatches: true
}

// 缓存相关
let searchIndex: Fuse<any> | null = null
let lastIndexUpdate = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

// 构建搜索索引
async function buildSearchIndex() {
  const now = Date.now()
  
  // 如果缓存仍然有效，直接返回
  if (searchIndex && (now - lastIndexUpdate) < CACHE_DURATION) {
    return searchIndex
  }

  try {
    const posts = await getAllPosts()
    
    // 准备搜索数据
    const searchData = posts.map(post => ({
      id: post.slug,
      slug: post.slug,
      frontMatter: post.frontMatter,
      content: post.content.slice(0, 1000), // 限制内容长度以提高性能
      readingTime: post.readingTime
    }))

    searchIndex = new Fuse(searchData, fuseOptions)
    lastIndexUpdate = now

    return searchIndex
  } catch (error) {
    console.error('Failed to build search index:', error)
    throw new Error('搜索索引构建失败')
  }
}

// 处理搜索高亮
function processHighlights(matches: any[]): SearchResult['highlights'] {
  const highlights: SearchResult['highlights'] = {}

  matches.forEach((match) => {
    const key = match.key.split('.').pop() // 获取最后的键名
    if (!highlights[key as keyof SearchResult['highlights']]) {
      highlights[key as keyof SearchResult['highlights']] = []
    }
    
    // 提取匹配的文本片段
    match.indices.forEach((index: [number, number]) => {
      const [start, end] = index
      const text = match.value.slice(Math.max(0, start - 20), Math.min(match.value.length, end + 20))
      highlights[key as keyof SearchResult['highlights']]?.push(`...${text}...`)
    })
  })

  return highlights
}

// 清理搜索结果中的markdown语法
function cleanContent(content: string): string {
  return content
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体
    .replace(/`(.*?)`/g, '$1') // 移除内联代码
    .replace(/```[\s\S]*?```/g, '[代码块]') // 替换代码块
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接格式
    .trim()
}

// 搜索处理器
async function searchHandler(request: NextRequest) {
  const startTime = Date.now()
  
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
  const category = searchParams.get('category')
  const tag = searchParams.get('tag')

  // 验证查询参数
  if (!query.trim()) {
    throw API_ERRORS.BAD_REQUEST('搜索查询不能为空')
  }

  if (query.length < 2) {
    throw API_ERRORS.BAD_REQUEST('搜索查询至少需要2个字符')
  }

  // 构建搜索索引
  const fuse = await buildSearchIndex()
  
  // 执行搜索
  const searchResults = fuse.search(query)
  
  // 过滤结果（如果指定了分类或标签）
  let filteredResults = searchResults
  
  if (category) {
    filteredResults = filteredResults.filter(result => 
      result.item.frontMatter.category?.toLowerCase() === category.toLowerCase()
    )
  }
  
  if (tag) {
    filteredResults = filteredResults.filter(result =>
      result.item.frontMatter.tags?.some((t: string) => 
        t.toLowerCase() === tag.toLowerCase()
      )
    )
  }

  // 分页处理
  const total = filteredResults.length
  const totalPages = Math.ceil(total / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedResults = filteredResults.slice(startIndex, endIndex)

  // 格式化搜索结果
  const results: SearchResult[] = paginatedResults.map(result => ({
    id: result.item.id,
    title: result.item.frontMatter.title,
    slug: result.item.slug,
    description: result.item.frontMatter.description,
    content: cleanContent(result.item.content).slice(0, 200) + '...',
    date: result.item.frontMatter.date,
    category: result.item.frontMatter.category,
    tags: result.item.frontMatter.tags,
    author: result.item.frontMatter.author,
    score: Math.round((1 - (result.score || 0)) * 100), // 转换为相关性分数 (0-100)
    highlights: processHighlights(Array.from(result.matches || []))
  }))

  const searchTime = Date.now() - startTime

  const response: SearchResponse = {
    results,
    total,
    query,
    page,
    pageSize,
    totalPages,
    searchTime
  }

  return NextResponse.json(
    createSuccessResponse(response, '搜索完成'),
    { 
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', // 5分钟缓存
      }
    }
  )
}

export const GET = withApiHandler(searchHandler, { 
  rateLimitKey: 'search',
  skipSuspiciousContentCheck: true // 搜索查询可能包含特殊字符
})

// 支持OPTIONS请求（CORS预检）
export const OPTIONS = createOptionsHandler()