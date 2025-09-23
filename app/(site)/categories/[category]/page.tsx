import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Folder, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BlogList } from '@/components/blog/blog-list'
import { Skeleton } from '@/components/ui/skeleton'

interface Category {
  name: string
  slug: string
  description: string
  count: number
  color: string
}

interface CategoryPageProps {
  params: {
    category: string
  }
}

// 模拟获取分类数据
async function getCategory(slug: string): Promise<Category | null> {
  // URL解码处理中文
  const decodedSlug = decodeURIComponent(slug)
  
  const categories = {
    '前端开发': {
      name: '前端开发',
      slug: '前端开发',
      description: 'React, Vue, Next.js 等前端技术文章。包含组件开发、状态管理、性能优化、构建工具等相关内容。',
      count: 2,
      color: 'bg-blue-500',
    },
    '性能优化': {
      name: '性能优化',
      slug: '性能优化',
      description: '网站性能优化、代码优化、构建优化等相关文章。',
      count: 1,
      color: 'bg-orange-500',
    },
    '技术': {
      name: '技术',
      slug: '技术',
      description: '通用技术文章和技术思考。',
      count: 1,
      color: 'bg-purple-500',
    },
    // 保留英文slug兼容性
    'frontend': {
      name: '前端开发',
      slug: 'frontend',
      description: 'React, Vue, Next.js 等前端技术文章。包含组件开发、状态管理、性能优化、构建工具等相关内容。',
      count: 2,
      color: 'bg-blue-500',
    },
    'backend': {
      name: '后端开发',
      slug: 'backend',
      description: 'Node.js, Python, Go 等后端技术。涵盖 API 设计、数据库优化、服务器架构等。',
      count: 18,
      color: 'bg-green-500',
    },
    'fullstack': {
      name: '全栈开发',
      slug: 'fullstack',
      description: '全栈项目和架构设计相关文章。从前端到后端的完整解决方案。',
      count: 12,
      color: 'bg-purple-500',
    },
  }
  
  return categories[decodedSlug as keyof typeof categories] || categories[slug as keyof typeof categories] || null
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.category)
  
  if (!category) {
    return {
      title: '分类未找到',
    }
  }

  return {
    title: category.name,
    description: `${category.description} - 共 ${category.count} 篇文章`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategory(params.category)
  
  if (!category) {
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
          <Link href="/categories" className="hover:text-foreground">分类</Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回分类列表
          </Link>
        </Button>

        {/* Category Info */}
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Folder className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold">{category.name}</h1>
              <Badge variant="secondary">
                {category.count} 篇文章
              </Badge>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Posts List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {category.name} 文章
          </h2>
          <div className="text-sm text-muted-foreground">
            共 {category.count} 篇文章
          </div>
        </div>

        <Suspense fallback={<CategoryPostsSkeleton />}>
          <BlogList category={params.category} showPagination={true} />
        </Suspense>
      </section>
    </div>
  )
}

function CategoryPostsSkeleton() {
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