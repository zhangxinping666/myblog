import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { getPostBySlug } from '../../../lib/mdx/mdx'
import { siteConfig } from '../../../lib/config/site'

// 移除 edge runtime 以支持 MDX 文件系统操作
// export const runtime = 'edge'

// 字体数据（这里使用系统字体，实际项目中可以加载自定义字体）
const FONT_SIZE = {
  title: 64,
  subtitle: 32,
  meta: 24,
  site: 28
}

const COLORS = {
  background: '#ffffff',
  primary: '#2563eb',
  secondary: '#64748b',
  text: '#1e293b',
  muted: '#94a3b8',
  accent: '#f59e0b'
}

// 生成渐变背景
function generateGradientBackground(category?: string) {
  const gradients = {
    '前端开发': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '性能优化': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    '技术': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'React': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'Next.js': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
  
  return gradients[category as keyof typeof gradients] || gradients.default
}

// 截断文本
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

// 格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// OG图片生成处理器
async function generateOGImageHandler(request: NextRequest,context?:any) {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title')
    const description = searchParams.get('description')
    const slug = searchParams.get('slug')
    const category = searchParams.get('category') as string | undefined
    const author = searchParams.get('author')
    const date = searchParams.get('date')
    const type = searchParams.get('type') || 'post'
    let ogTitle = title
    let ogDescription = description
    let ogCategory = category 
    let ogAuthor = author || siteConfig.author
    let ogDate = date
    console.log(context)

    // 如果提供了 slug，尝试从 MDX 文件获取数据
    if (slug && !title) {
      try {
        const post = await getPostBySlug(slug)
        if (post) {
          ogTitle = post.frontMatter.title
          ogDescription = post.frontMatter.description
          ogCategory = post.frontMatter.category 
          ogAuthor = post.frontMatter.author || siteConfig.author
          ogDate = post.frontMatter.date
        }
      } catch (error) {
        console.error('Failed to get post data:', error)
      }
    }

    // 默认值
    if (!ogTitle) {
      ogTitle = type === 'site' ? siteConfig.name : '无标题'
    }
    if (!ogDescription) {
      ogDescription = type === 'site' ? siteConfig.description : '暂无描述'
    }

    // 截断文本以适应图片
    const finalTitle = truncateText(ogTitle, 60)
    const finalDescription = truncateText(ogDescription, 120)
    const background = generateGradientBackground(ogCategory)

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background,
            position: 'relative',
          }}
        >
          {/* 背景装饰 */}
          <div
            style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 60px',
              maxWidth: '900px',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              margin: '0 40px',
            }}
          >
            {/* 分类标签 */}
            {ogCategory && (
              <div
                style={{
                  background: COLORS.accent,
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: FONT_SIZE.meta,
                  fontWeight: 600,
                  marginBottom: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {ogCategory}
              </div>
            )}

            {/* 标题 */}
            <h1
              style={{
                fontSize: FONT_SIZE.title,
                fontWeight: 800,
                color: COLORS.text,
                margin: '0 0 24px 0',
                lineHeight: 1.1,
                letterSpacing: '-1px',
              }}
            >
              {finalTitle}
            </h1>

            {/* 描述 */}
            <p
              style={{
                fontSize: FONT_SIZE.subtitle,
                color: COLORS.secondary,
                margin: '0 0 40px 0',
                lineHeight: 1.4,
                fontWeight: 400,
              }}
            >
              {finalDescription}
            </p>

            {/* 元信息 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '30px',
                fontSize: FONT_SIZE.meta,
                color: COLORS.muted,
                marginBottom: '30px',
              }}
            >
              {ogAuthor && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>👨‍💻</span>
                  <span>{ogAuthor}</span>
                </div>
              )}
              {ogDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📅</span>
                  <span>{formatDate(ogDate)}</span>
                </div>
              )}
            </div>

            {/* 站点信息 */}
            <div
              style={{
                borderTop: `2px solid ${COLORS.primary}`,
                paddingTop: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: FONT_SIZE.site,
                color: COLORS.primary,
                fontWeight: 700,
              }}
            >
              <span>🚀</span>
              <span>{siteConfig.name}</span>
            </div>
          </div>

          {/* 底部装饰线 */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=172800', // 24小时缓存
        },
      }
    )
}

export const GET = generateOGImageHandler

