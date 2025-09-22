import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, getPostsByCategory, getPostsByTag } from '@/lib/mdx/mdx'
import { siteConfig } from '@/lib/config/site'
import { withApiHandler, createOptionsHandler } from '@/lib/services/api'

// RSS配置
const RSS_CONFIG = {
  title: siteConfig.name,
  description: siteConfig.description,
  link: siteConfig.url,
  language: 'zh-CN',
  managingEditor: `noreply@example.com (${siteConfig.author})`,
  webMaster: `noreply@example.com (${siteConfig.author})`,
  copyright: `© ${new Date().getFullYear()} ${siteConfig.name}`,
  generator: 'Next.js Blog RSS Generator',
  maxItems: 50 // 最大文章数量
}

// 转义XML特殊字符
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// 生成CDATA节点
function cdata(text: string): string {
  return `<![CDATA[${text}]]>`
}

// 格式化日期为RFC822格式
function formatRFC822Date(dateString: string): string {
  const date = new Date(dateString)
  return date.toUTCString()
}

// 清理内容（移除Markdown语法，生成纯文本摘要）
function cleanContent(content: string, maxLength: number = 300): string {
  return content
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体
    .replace(/`(.*?)`/g, '$1') // 移除内联代码
    .replace(/```[\s\S]*?```/g, '[代码块]') // 替换代码块
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接格式
    .replace(/\n\s*\n/g, ' ') // 替换多行换行为空格
    .replace(/\n/g, ' ') // 替换单行换行为空格
    .trim()
    .slice(0, maxLength) + (content.length > maxLength ? '...' : '')
}

// 生成RSS XML
async function generateRSS(posts: any[], category?: string, tag?: string): Promise<string> {
  const buildDate = new Date().toUTCString()
  const lastBuildDate = posts.length > 0 ? formatRFC822Date(posts[0].frontMatter.date) : buildDate
  
  // RSS头部
  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title>${escapeXml(RSS_CONFIG.title)}</title>
    <link>${RSS_CONFIG.link}</link>
    <description>${escapeXml(RSS_CONFIG.description)}</description>
    <language>${RSS_CONFIG.language}</language>
    <managingEditor>${RSS_CONFIG.managingEditor}</managingEditor>
    <webMaster>${RSS_CONFIG.webMaster}</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <copyright>${escapeXml(RSS_CONFIG.copyright)}</copyright>
    <generator>${RSS_CONFIG.generator}</generator>
    <atom:link href="${RSS_CONFIG.link}/api/rss" rel="self" type="application/rss+xml" />
`

  // 添加分类或标签信息
  if (category) {
    rss += `    <category>${escapeXml(category)}</category>\n`
  }
  if (tag) {
    rss += `    <category>${escapeXml(tag)}</category>\n`
  }

  // 添加文章项目
  const limitedPosts = posts.slice(0, RSS_CONFIG.maxItems)
  
  for (const post of limitedPosts) {
    const postUrl = `${RSS_CONFIG.link}/posts/${post.slug}`
    const pubDate = formatRFC822Date(post.frontMatter.date)
    const content = cleanContent(post.content, 500)
    const fullContent = post.content.replace(/```[\s\S]*?```/g, '[代码块]') // 简化代码块
    
    rss += `
    <item>
      <title>${cdata(post.frontMatter.title)}</title>
      <link>${postUrl}</link>
      <description>${cdata(content)}</description>
      <content:encoded>${cdata(fullContent)}</content:encoded>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${postUrl}</guid>
      <author>noreply@example.com (${escapeXml(post.frontMatter.author || siteConfig.author)})</author>`
    
    // 添加分类
    if (post.frontMatter.category) {
      rss += `\n      <category>${escapeXml(post.frontMatter.category)}</category>`
    }
    
    // 添加标签
    if (post.frontMatter.tags && post.frontMatter.tags.length > 0) {
      for (const postTag of post.frontMatter.tags) {
        rss += `\n      <category>${escapeXml(postTag)}</category>`
      }
    }
    
    rss += `
    </item>`
  }

  rss += `
  </channel>
</rss>`

  return rss
}

// RSS生成处理器
async function generateRSSHandler(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const format = searchParams.get('format') || 'rss' // rss, atom, json
    
    let posts
    
    // 根据参数获取相应的文章
    if (category) {
      posts = await getPostsByCategory(category)
    } else if (tag) {
      posts = await getPostsByTag(tag)
    } else {
      posts = await getAllPosts()
    }

    // 根据格式生成不同的输出
    if (format === 'json') {
      // JSON Feed格式
      const jsonFeed = {
        version: "https://jsonfeed.org/version/1.1",
        title: RSS_CONFIG.title,
        description: RSS_CONFIG.description,
        home_page_url: RSS_CONFIG.link,
        feed_url: `${RSS_CONFIG.link}/api/rss?format=json`,
        language: RSS_CONFIG.language,
        items: posts.slice(0, RSS_CONFIG.maxItems).map(post => ({
          id: `${RSS_CONFIG.link}/posts/${post.slug}`,
          url: `${RSS_CONFIG.link}/posts/${post.slug}`,
          title: post.frontMatter.title,
          content_html: post.content.replace(/```[\s\S]*?```/g, '[代码块]'),
          content_text: cleanContent(post.content, 1000),
          summary: post.frontMatter.description,
          date_published: new Date(post.frontMatter.date).toISOString(),
          author: {
            name: post.frontMatter.author || siteConfig.author
          },
          tags: [
            ...(post.frontMatter.category ? [post.frontMatter.category] : []),
            ...(post.frontMatter.tags || [])
          ]
        }))
      }

      return NextResponse.json(jsonFeed, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400', // 1小时缓存
        }
      })
    }

    // 生成RSS XML
    const rssXml = await generateRSS(posts, category || undefined, tag || undefined)

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400', // 1小时缓存
        'X-Content-Type-Options': 'nosniff',
      }
    })
}

export const GET = withApiHandler(generateRSSHandler, { 
  rateLimitKey: 'rss',
  skipSuspiciousContentCheck: true // RSS生成不需要内容检查
})

// 支持HEAD请求（用于检查RSS可用性）
async function rssHeadHandler(_request: NextRequest) {
  const posts = await getAllPosts()
  const lastModified = posts.length > 0 && posts[0]?.frontMatter?.date
    ? new Date(posts[0].frontMatter.date).toUTCString() 
    : new Date().toUTCString()

  return new NextResponse(null, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Last-Modified': lastModified,
      'Cache-Control': 'public, max-age=3600',
    }
  })
}

export const HEAD = withApiHandler(rssHeadHandler, { 
  rateLimitKey: 'rss',
  skipSuspiciousContentCheck: true
})

// OPTIONS - CORS支持
export const OPTIONS = createOptionsHandler()