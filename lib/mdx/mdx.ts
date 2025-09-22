import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

export interface PostMatter {
  title: string
  description: string
  date: string
  published?: boolean
  category?: string
  tags?: string[]
  author?: string
  image?: string
}

export interface Post {
  slug: string
  frontMatter: PostMatter
  content: string
  readingTime: {
    text: string
    minutes: number
  }
}

export interface SerializedPost extends Omit<Post, 'content'> {
  content: MDXRemoteSerializeResult
}

// 获取所有文章文件名
export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }
  
  return fs.readdirSync(postsDirectory)
    .filter((file) => /\.(md|mdx)$/.test(file))
    .map((file) => file.replace(/\.(md|mdx)$/, ''))
}

// 根据 slug 获取文章
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  const fallbackPath = path.join(postsDirectory, `${slug}.md`)
  
  let filePath = fullPath
  if (!fs.existsSync(fullPath)) {
    if (!fs.existsSync(fallbackPath)) {
      return null
    }
    filePath = fallbackPath
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  
  const readingTimeResult = readingTime(content)
  
  return {
    slug,
    frontMatter: data as PostMatter,
    content,
    readingTime: {
      text: readingTimeResult.text.replace('min read', '分钟阅读'),
      minutes: Math.ceil(readingTimeResult.minutes)
    }
  }
}

// 获取所有文章
export async function getAllPosts(): Promise<Post[]> {
  const slugs = getPostSlugs()
  const posts = await Promise.all(
    slugs.map((slug) => getPostBySlug(slug))
  )
  
  return posts
    .filter((post): post is Post => post !== null)
    .filter((post) => post.frontMatter.published !== false)
    .sort((a, b) => {
      const dateA = new Date(a.frontMatter.date || 0)
      const dateB = new Date(b.frontMatter.date || 0)
      return dateB.getTime() - dateA.getTime()
    })
}

// 序列化 MDX 内容
export async function serializePost(post: Post): Promise<SerializedPost> {
  const content = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  })
  
  return {
    ...post,
    content,
  }
}

// 根据分类获取文章
export async function getPostsByCategory(category: string): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => 
    post.frontMatter.category?.toLowerCase() === category.toLowerCase()
  )
}

// 根据标签获取文章
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => 
    post.frontMatter.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  )
}

// 获取所有分类
export async function getAllCategories(): Promise<string[]> {
  const allPosts = await getAllPosts()
  const categories = new Set<string>()
  
  allPosts.forEach((post) => {
    if (post.frontMatter.category) {
      categories.add(post.frontMatter.category)
    }
  })
  
  return Array.from(categories).sort()
}

// 获取所有标签
export async function getAllTags(): Promise<string[]> {
  const allPosts = await getAllPosts()
  const tags = new Set<string>()
  
  allPosts.forEach((post) => {
    post.frontMatter.tags?.forEach((tag) => {
      tags.add(tag)
    })
  })
  
  return Array.from(tags).sort()
}

// 获取相关文章
export async function getRelatedPosts(slug: string, limit: number = 3): Promise<Post[]> {
  const post = await getPostBySlug(slug)
  if (!post) return []
  
  const allPosts = await getAllPosts()
  const relatedPosts: { post: Post; score: number }[] = []
  
  for (const p of allPosts) {
    if (p.slug === slug) continue
    
    let score = 0
    
    // 相同分类加分
    if (p.frontMatter.category === post.frontMatter.category) {
      score += 3
    }
    
    // 相同标签加分
    const commonTags = post.frontMatter.tags?.filter((tag) =>
      p.frontMatter.tags?.includes(tag)
    )
    score += (commonTags?.length || 0) * 2
    
    if (score > 0) {
      relatedPosts.push({ post: p, score })
    }
  }
  
  // 按分数排序并返回前几个
  return relatedPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post)
}