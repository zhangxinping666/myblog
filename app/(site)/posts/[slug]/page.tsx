import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { CalendarDays, Clock, Tag, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'


// import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SimpleStickyToc } from '@/components/features/simple-toc'
import { extractHeadingsFromContent } from '@/lib/utils/extract-headings'
import { ArticleShare } from '@/components/features/share'
import { Comments } from '@/components/features/comments'
import { AuthorCard } from '@/components/blog/author-card'
import { RelatedPosts } from '@/components/blog/related-posts'
import { PostMeta } from '@/components/blog/post-meta'
import { formatDate } from '@/lib/utils/format'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/mdx/mdx'
import { siteConfig } from '@/lib/config/site'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

// 生成静态参数
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// 生成元数据
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: post.frontMatter.title,
    description: post.frontMatter.description,
    authors: [{ name: post.frontMatter.author || siteConfig.author }],
    openGraph: {
      title: post.frontMatter.title,
      description: post.frontMatter.description,
      type: 'article',
      publishedTime: post.frontMatter.date,
      authors: [post.frontMatter.author || siteConfig.author],
      images: post.frontMatter.image ? [post.frontMatter.image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.frontMatter.title,
      description: post.frontMatter.description,
      images: post.frontMatter.image ? [post.frontMatter.image] : undefined,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(slug, 3)
  
  // 从文章内容中提取标题，生成目录
  const tocItems = extractHeadingsFromContent(post.content)
  
  // 创建标题ID映射，用于ReactMarkdown渲染
  const titleToIdMap = new Map<string, string>()
  tocItems.forEach(item => {
    titleToIdMap.set(item.title, item.id)
  })

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-3 space-y-8">
          {/* Header */}
          <header className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">首页</Link>
              <span>/</span>
              <Link href="/posts" className="hover:text-foreground">文章</Link>
              {post.frontMatter.category && (
                <>
                  <span>/</span>
                  <Link href={`/categories/${post.frontMatter.category}`} className="hover:text-foreground">
                    {post.frontMatter.category}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-foreground truncate">{post.frontMatter.title}</span>
            </nav>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {post.frontMatter.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {post.frontMatter.description}
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.frontMatter.author || siteConfig.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(post.frontMatter.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime.minutes} 分钟阅读</span>
              </div>
            </div>

            {/* Tags */}
            {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.frontMatter.tags.map((tag) => (
                  <Link key={tag} href={`/tags/${tag}`}>
                    <Badge variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArticleShare
                  title={post.frontMatter.title}
                  description={post.frontMatter.description}
                />
              </div>
            </div>

            {/* Cover Image */}
            {post.frontMatter.image && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={post.frontMatter.image}
                  alt={post.frontMatter.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          <Separator />

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children, ...props }) => {
                  const text = typeof children === 'string' ? children : children?.toString() || ''
                  const id = titleToIdMap.get(text) || text.toLowerCase().replace(/[^\w\u4e00-\u9fa5\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '')
                  return <h1 id={id} className="text-4xl font-bold mt-8 mb-4 scroll-mt-20" {...props}>{children}</h1>
                },
                h2: ({ children, ...props }) => {
                  const text = typeof children === 'string' ? children : children?.toString() || ''
                  const id = titleToIdMap.get(text) || text.toLowerCase().replace(/[^\w\u4e00-\u9fa5\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '')
                  return <h2 id={id} className="text-3xl font-bold mt-6 mb-3 scroll-mt-20" {...props}>{children}</h2>
                },
                h3: ({ children, ...props }) => {
                  const text = typeof children === 'string' ? children : children?.toString() || ''
                  const id = titleToIdMap.get(text) || text.toLowerCase().replace(/[^\w\u4e00-\u9fa5\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '')
                  return <h3 id={id} className="text-2xl font-semibold mt-4 mb-2 scroll-mt-20" {...props}>{children}</h3>
                },
                h4: ({ children, ...props }) => {
                  const text = typeof children === 'string' ? children : children?.toString() || ''
                  const id = titleToIdMap.get(text) || text.toLowerCase().replace(/[^\w\u4e00-\u9fa5\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '')
                  return <h4 id={id} className="text-xl font-semibold mt-3 mb-2 scroll-mt-20" {...props}>{children}</h4>
                },
                h5: ({ children, ...props }) => {
                  const text = typeof children === 'string' ? children : children?.toString() || ''
                  const id = titleToIdMap.get(text) || text.toLowerCase().replace(/[^\w\u4e00-\u9fa5\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '')
                  return <h5 id={id} className="text-lg font-semibold mt-3 mb-2 scroll-mt-20" {...props}>{children}</h5>
                },
                h6: ({ children, ...props }) => {
                  const text = typeof children === 'string' ? children : children?.toString() || ''
                  const id = titleToIdMap.get(text) || text.toLowerCase().replace(/[^\w\u4e00-\u9fa5\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '')
                  return <h6 id={id} className="text-base font-semibold mt-3 mb-2 scroll-mt-20" {...props}>{children}</h6>
                },
                p: ({ children, ...props }) => <p className="mb-4 leading-7" {...props}>{children}</p>,
                ul: ({ children, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props}>{children}</ul>,
                ol: ({ children, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props}>{children}</ol>,
                li: ({ children, ...props }) => <li className="ml-4" {...props}>{children}</li>,
                code: ({ children, className, ...props }) => {
                  // 检查是否为内联代码（没有className或不是语言标识符）
                  const isInline = !className || !className.startsWith('language-')
                  
                  if (isInline) {
                    return <code className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono" {...props}>{children}</code>
                  }
                  
                  // 提取语言
                  const language = className?.replace('language-', '') || 'text'
                  const codeString = String(children).replace(/\n$/, '')
                  
                  return (
                    <div className="relative code-block-wrapper">
                      <SyntaxHighlighter
                        style={{
                          ...oneDark,
                          // 自定义优化的颜色方案，确保所有元素都有鲜明颜色
                          'code[class*="language-"]': {
                            ...oneDark['code[class*="language-"]'],
                            color: '#abb2bf', // 默认文本颜色
                            background: 'transparent',
                            textDecoration: 'none',
                            border: 'none'
                          },
                          'pre[class*="language-"]': {
                            ...oneDark['pre[class*="language-"]'],
                            background: '#1e1e1e', // 恢复深黑色背景
                            textDecoration: 'none',
                            border: 'none'
                          },
                          // 强化各种token的颜色
                          '.token.comment': { color: '#5c6370', fontStyle: 'italic' },
                          '.token.prolog': { color: '#5c6370' },
                          '.token.doctype': { color: '#5c6370' },
                          '.token.cdata': { color: '#5c6370' },
                          '.token.punctuation': { color: '#abb2bf' },
                          '.token.property': { color: '#e06c75' },
                          '.token.tag': { color: '#e06c75' },
                          '.token.boolean': { color: '#d19a66' },
                          '.token.number': { color: '#d19a66' },
                          '.token.constant': { color: '#d19a66' },
                          '.token.symbol': { color: '#61afef' },
                          '.token.deleted': { color: '#e06c75' },
                          '.token.selector': { color: '#98c379' },
                          '.token.attr-name': { color: '#d19a66' },
                          '.token.string': { color: '#98c379' },
                          '.token.char': { color: '#98c379' },
                          '.token.builtin': { color: '#e6c07b' },
                          '.token.inserted': { color: '#98c379' },
                          '.token.operator': { color: '#56b6c2' },
                          '.token.entity': { color: '#61afef' },
                          '.token.url': { color: '#61afef' },
                          '.token.variable': { color: '#752128ff' }, 
                          '.token.atrule': { color: '#c678dd' },
                          '.token.attr-value': { color: '#98c379' },
                          '.token.keyword': { color: '#c678dd', fontWeight: 'bold' },
                          '.token.function': { color: '#61afef' },
                          '.token.class-name': { color: '#e6c07b' },
                          '.token.regex': { color: '#98c379' },
                          '.token.important': { color: '#e06c75', fontWeight: 'bold' }
                        }}
                        language={language}
                        PreTag="div"
                        className="!rounded-lg !mb-4 !overflow-hidden !text-sm !border-none"
                        showLineNumbers={false}
                        wrapLines={false}
                        wrapLongLines={true}
                        useInlineStyles={true}
                        customStyle={{
                          background: '#1e1e1e', // 恢复深黑色背景
                          border: 'none',
                          borderRadius: '0.5rem',
                          padding: '1.5rem',
                          margin: 0,
                          fontSize: '14px',
                          lineHeight: '1.7',
                          fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                          boxShadow: 'none',
                          textDecoration: 'none',
                          overflow: 'auto',
                          color: '#abb2bf', // 设置默认文本颜色
                        }}
                        codeTagProps={{
                          style: {
                            background: 'transparent',
                            fontFamily: 'inherit',
                            textDecoration: 'none !important',
                            borderBottom: 'none !important',
                            textDecorationLine: 'none !important',
                            border: 'none !important',
                            outline: 'none !important',
                            boxShadow: 'none !important',
                            color: 'inherit',
                          }
                        }}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  )
                },
                pre: ({ children }) => {
                  // 当使用语法高亮时，pre 标签只是一个容器
                  return <div>{children}</div>
                },
                blockquote: ({ children, ...props }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props}>{children}</blockquote>
                ),
                a: ({ children, ...props }) => (
                  <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
                ),
                hr: () => <Separator className="my-8" />,
                strong: ({ children, ...props }) => <strong className="font-semibold" {...props}>{children}</strong>,
                em: ({ children, ...props }) => <em className="italic" {...props}>{children}</em>,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <Separator />

          {/* Post Footer */}
          <div className="space-y-8">
            {/* Author Card */}
            <AuthorCard
              name={post.frontMatter.author || siteConfig.author}
              bio="全栈开发工程师，专注于前端技术和用户体验"
            />

            {/* Share */}
            <ArticleShare
              title={post.frontMatter.title}
              description={post.frontMatter.description}
            />
          </div>

          <Separator />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">相关文章</h2>
              <Suspense fallback={<RelatedPostsSkeleton />}>
                <RelatedPosts
                  posts={relatedPosts.map(p => ({
                    id: p.slug,
                    title: p.frontMatter.title,
                    slug: p.slug,
                    excerpt: p.frontMatter.description,
                    date: p.frontMatter.date,
                  }))}
                />
              </Suspense>
            </section>
          )}

          <Separator />

          {/* Comments */}
          <section className="space-y-6">
            <Suspense fallback={<CommentsSkeleton />}>
              <Comments
                comments={[]}
                allowReplies={true}
                allowReporting={true}
              />
            </Suspense>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Table of Contents - 使用新的简化目录组件 */}
          <div className="hidden lg:block">
            <SimpleStickyToc items={tocItems} />
          </div>

          {/* Post Meta - 也实现粘性定位，但位置在目录下方 */}
          <div className="sticky top-[calc(100vh-12rem)] hidden lg:block">
            <PostMeta
              date={post.frontMatter.date}
              readingTime={post.readingTime.text}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}

// 骨架屏组件
function RelatedPostsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CommentsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-32" />
      <Card className="animate-pulse">
        <CardContent className="p-4 space-y-4">
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}