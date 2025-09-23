import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Hash, TrendingUp, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BlogList } from '@/components/blog/blog-list'
import { Skeleton } from '@/components/ui/skeleton'

interface TagData {
  name: string
  slug: string
  count: number
  description?: string
  trending?: boolean
  relatedTags?: string[]
}

interface TagPageProps {
  params: {
    tag: string
  }
}

// 模拟获取标签数据
async function getTag(slug: string): Promise<TagData | null> {
  // URL解码处理中文
  const decodedSlug = decodeURIComponent(slug)
  
  const tags: Record<string, TagData> = {
    'React': {
      name: 'React',
      slug: 'React',
      count: 2,
      description: 'React 是一个用于构建用户界面的 JavaScript 库。学习 React 组件、状态管理、Hooks 等核心概念。',
      trending: true,
      relatedTags: ['Next.js', 'TypeScript', 'Hooks']
    },
    'Next.js': {
      name: 'Next.js',
      slug: 'Next.js',
      count: 2,
      description: 'Next.js 是一个基于 React 的全栈框架，提供服务端渲染、静态生成等功能。',
      trending: true,
      relatedTags: ['React', 'TypeScript', '性能优化']
    },
    'TypeScript': {
      name: 'TypeScript',
      slug: 'TypeScript',
      count: 2,
      description: 'TypeScript 是 JavaScript 的超集，提供静态类型检查和更好的开发体验。',
      trending: true,
      relatedTags: ['React', 'Next.js', '类型系统']
    },
    '性能优化': {
      name: '性能优化',
      slug: '性能优化',
      count: 2,
      description: '网站性能优化技巧，包括代码优化、构建优化、运行时优化等。',
      trending: true,
      relatedTags: ['Next.js', 'Web Vitals']
    },
    // 保留英文slug兼容性
    'react': {
      name: 'React',
      slug: 'react',
      count: 2,
      description: 'React 是一个用于构建用户界面的 JavaScript 库。学习 React 组件、状态管理、Hooks 等核心概念。',
      trending: true,
      relatedTags: ['javascript', 'nextjs', 'typescript', 'hooks']
    },
    'nextjs': {
      name: 'Next.js',
      slug: 'nextjs',
      count: 28,
      description: 'Next.js 是一个基于 React 的全栈框架，提供服务端渲染、静态生成等强大功能。',
      trending: true,
      relatedTags: ['react', 'typescript', 'vercel', 'ssr']
    },
    'typescript': {
      name: 'TypeScript',
      slug: 'typescript',
      count: 25,
      description: 'TypeScript 是 JavaScript 的超集，添加了静态类型检查，提高代码质量和开发效率。',
      trending: true,
      relatedTags: ['javascript', 'react', 'nextjs', 'types']
    },
    'javascript': {
      name: 'JavaScript',
      slug: 'javascript',
      count: 45,
      description: 'JavaScript 是现代 Web 开发的核心语言。掌握 ES6+、异步编程、函数式编程等概念。',
      relatedTags: ['typescript', 'react', 'nodejs', 'es6']
    }
  }
  
  return tags[decodedSlug] || tags[slug] || null
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await getTag(params.tag)
  
  if (!tag) {
    return {
      title: '标签未找到',
    }
  }

  return {
    title: `#${tag.name}`,
    description: `${tag.description || `查看所有关于 ${tag.name} 的文章`} - 共 ${tag.count} 篇文章`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = await getTag(params.tag)
  
  if (!tag) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">首页</Link>
          <span>/</span>
          <Link href="/tags" className="hover:text-foreground">标签</Link>
          <span>/</span>
          <span className="text-foreground">#{tag.name}</span>
        </nav>

        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tags">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回标签列表
          </Link>
        </Button>

        {/* Tag Info */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Hash className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl font-bold">#{tag.name}</h1>
              <Badge variant="secondary">
                {tag.count} 篇文章
              </Badge>
              {tag.trending && (
                <Badge variant="default" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  热门
                </Badge>
              )}
            </div>
            {tag.description && (
              <p className="text-xl text-muted-foreground max-w-3xl">
                {tag.description}
              </p>
            )}
          </div>
        </div>

        {/* Related Tags */}
        {tag.relatedTags && tag.relatedTags.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">相关标签</h3>
            <div className="flex flex-wrap gap-2">
              {tag.relatedTags.map((relatedTag) => (
                <Link key={relatedTag} href={`/tags/${relatedTag}`}>
                  <Badge variant="outline" className="hover:bg-muted">
                    <Hash className="mr-1 h-3 w-3" />
                    {relatedTag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Posts List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            #{tag.name} 相关文章
          </h2>
          <div className="text-sm text-muted-foreground">
            共 {tag.count} 篇文章
          </div>
        </div>

        <Suspense fallback={<TagPostsSkeleton />}>
          <BlogList tag={params.tag} showPagination={true} />
        </Suspense>
      </section>
    </div>
  )
}

function TagPostsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4 p-6 border rounded-lg animate-pulse">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}