import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { CalendarDays, Clock, Tag, User } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'

// import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StickyToc, MobileToc } from '@/components/features/toc'
import { ArticleShare } from '@/components/features/share'
import { Comments } from '@/components/features/comments'
import { AuthorCard } from '@/components/blog/author-card'
import { RelatedPosts } from '@/components/blog/related-posts'
import { PostMeta } from '@/components/blog/post-meta'
import { formatDate } from '@/lib/utils/format'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/mdx/mdx'
import { siteConfig } from '@/lib/config/site'

interface PostPageProps {
  params: {
    slug: string
  }
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
  const post = await getPostBySlug(params.slug)

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
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(params.slug, 3)

  // MDX 组件映射
  const components = {
    h1: (props: any) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
    h2: (props: any) => <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />,
    h3: (props: any) => <h3 className="text-2xl font-semibold mt-4 mb-2" {...props} />,
    p: (props: any) => <p className="mb-4 leading-7" {...props} />,
    ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
    ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
    li: (props: any) => <li className="ml-4" {...props} />,
    code: (props: any) => {
      // 内联代码
      if (!props.className) {
        return <code className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono" {...props} />
      }
      // 代码块
      return <code {...props} />
    },
    pre: (props: any) => (
      <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto mb-4" {...props} />
    ),
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
    ),
    a: (props: any) => (
      <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
    ),
    hr: () => <Separator className="my-8" />,
    strong: (props: any) => <strong className="font-semibold" {...props} />,
    em: (props: any) => <em className="italic" {...props} />,
  }

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
                <MobileToc />
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
            <MDXRemote source={post.content} components={components} />
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
          {/* Table of Contents */}
          <Card className="hidden lg:block">
            <CardContent className="p-0">
              <StickyToc />
            </CardContent>
          </Card>

          {/* Post Meta */}
          <PostMeta
            date={post.frontMatter.date}
            readingTime={post.readingTime.text}
          />
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