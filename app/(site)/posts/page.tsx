import { Suspense } from 'react'
import { Metadata } from 'next'
import { Filter, SortAsc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BlogList } from '@/components/blog/blog-list'
import { InlineSearch } from '@/components/features/search'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: '所有文章',
  description: '浏览我的所有技术文章和博客内容',
}

export default function PostsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const search = typeof searchParams['search'] === 'string' ? searchParams['search'] : undefined
  const category = typeof searchParams['category'] === 'string' ? searchParams['category'] : undefined  
  const tag = typeof searchParams['tag'] === 'string' ? searchParams['tag'] : undefined

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">文章</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          分享前端技术、开发经验和技术思考
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <InlineSearch placeholder="搜索文章..." className="w-full" data={[]} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              筛选
            </Button>
            <Button variant="outline" size="sm">
              <SortAsc className="mr-2 h-4 w-4" />
              排序
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(search || category || tag) && (
          <div className="flex flex-wrap gap-2">
            {search && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                搜索: {search}
              </div>
            )}
            {category && (
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                分类: {category}
              </div>
            )}
            {tag && (
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                标签: {tag}
              </div>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Posts Grid */}
      <Suspense fallback={<PostsGridSkeleton />}>
        <BlogList
          category={category || undefined}
          tag={tag || undefined}
          showPagination={true}
        />
      </Suspense>
    </div>
  )
}

function PostsGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/5" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Skeleton */}
      <div className="flex justify-center gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  )
}