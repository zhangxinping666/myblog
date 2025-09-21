import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { CalendarDays, Clock, Eye, Tag, User, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
// import { MDXComponents } from '@/components/mdx/mdx-components'
import { formatDate } from '@/lib/utils/format'
// import { useReadingProgress } from '@/components/features/analytics'

interface Post {
  slug: string
  title: string
  description: string
  content: string
  publishedAt: string
  updatedAt?: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  readingTime: number
  views?: number
  likes?: number
  coverImage?: string
}

interface PostPageProps {
  params: {
    slug: string
  }
}

// 模拟获取文章数据
async function getPost(slug: string): Promise<Post | null> {
  // 这里应该从 CMS 或数据库获取数据
  // 现在返回模拟数据
  if (slug === 'example-post') {
    return {
      slug: 'example-post',
      title: 'Next.js 14 博客系统搭建指南',
      description: '从零开始构建一个现代化的 Next.js 博客系统，包含完整的功能和最佳实践。',
      content: `
# Next.js 14 博客系统搭建指南

在这篇文章中，我将带你从零开始构建一个现代化的 Next.js 博客系统。

## 技术栈选择

我们选择以下技术栈：

- **Next.js 14** - React 全栈框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **MDX** - Markdown + JSX

## 项目初始化

首先创建一个新的 Next.js 项目：

\`\`\`bash
npx create-next-app@latest my-blog --typescript --tailwind --app
\`\`\`

## 配置文件结构

推荐的文件结构如下：

\`\`\`
my-blog/
├── app/
├── components/
├── lib/
├── content/
└── public/
\`\`\`

这样我们就完成了基本的博客系统搭建！
      `,
      publishedAt: '2024-01-15',
      updatedAt: '2024-01-20',
      category: '前端开发',
      tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
      author: {
        name: '张三',
        avatar: '/images/avatar.jpg',
        bio: '全栈开发工程师，专注于 React 生态系统',
      },
      readingTime: 8,
      views: 1234,
      likes: 56,
      coverImage: '/images/posts/nextjs-blog.jpg',
    }
  }

  return null
}

// 获取相关文章
async function getRelatedPosts(/* currentSlug: string */): Promise<Post[]> {
  // 模拟相关文章数据
  return [
    {
      slug: 'react-hooks-guide',
      title: 'React Hooks 完全指南',
      description: '深入理解 React Hooks 的使用方法和最佳实践',
      content: '',
      publishedAt: '2024-01-10',
      category: '前端开发',
      tags: ['React', 'Hooks'],
      author: { name: '张三' },
      readingTime: 6,
    },
  ]
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author.name }],
    // publishedTime 和 modifiedTime 不是 Metadata 的有效属性
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts()

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
              <span>/</span>
              <Link href={`/categories/${post.category}`} className="hover:text-foreground">
                {post.category}
              </Link>
              <span>/</span>
              <span className="text-foreground">{post.title}</span>
            </nav>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {post.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {post.description}
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} 分钟阅读</span>
              </div>
              {post.views && (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} 次浏览</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link href={`/tags/${tag}`}>
                  <Badge key={tag} variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MobileToc />
                <ArticleShare
                  title={post.title}
                  description={post.description}
                />
              </div>
              {post.likes && (
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-1" />
                  {post.likes}
                </Button>
              )}
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          <Separator />

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div>{post.content}</div>
          </div>

          <Separator />

          {/* Post Footer */}
          <div className="space-y-8">
            {/* Update Info */}
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <div className="text-sm text-muted-foreground">
                最后更新于 {formatDate(post.updatedAt)}
              </div>
            )}

            {/* Author Card */}
            <AuthorCard
              name={post.author.name}
              bio={post.author.bio || undefined}
              avatar={post.author.avatar || undefined}
            />

            {/* Share */}
            <ArticleShare
              title={post.title}
              description={post.description}
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
                    title: p.title,
                    slug: p.slug,
                    excerpt: p.description,
                    date: p.publishedAt,
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
            date={post.publishedAt}
            readingTime={`${post.readingTime} 分钟`}
            views={post.views || undefined}
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