import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import {
  Compass,
  Filter,
  SortAsc,
  Tag,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BlogList } from '@/components/blog/blog-list'
import { InlineSearch } from '@/components/features/search'
import { Skeleton } from '@/components/ui/skeleton'
export const metadata: Metadata = {
  title: '所有文章',
  description: '浏览我的所有技术文章和博客内容',
}
const quickTopics = [
  { label: '前端开发', href: '/categories/前端开发' },
  { label: 'React', href: '/tags/React' },
  { label: '性能优化', href: '/tags/性能优化' },
  { label: 'TypeScript', href: '/tags/TypeScript' },
  { label: 'Next.js', href: '/tags/Next.js' },
]
const trendingTags = ['hooks', 'nextjs14', 'tailwindcss', 'ai-tools', 'testing', 'storybook']
export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const search = typeof params['search'] === 'string' ? params['search'] : undefined
  const category = typeof params['category'] === 'string' ? params['category'] : undefined
  const tag = typeof params['tag'] === 'string' ? params['tag'] : undefined
  return (
    <div className="container space-y-12 py-12 lg:space-y-16 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="space-y-6">
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="pb-5">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Compass className="h-5 w-5 text-primary" />
                智能筛选
              </CardTitle>
              <CardDescription>
                根据关键词、标签或主题快速定位你感兴趣的内容。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <InlineSearch placeholder="搜索文章、标签或主题..." className="w-full" data={[]} />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5" />
                  筛选
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <SortAsc className="h-3.5 w-3.5" />
                  最新发布
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <SortAsc className="h-3.5 w-3.5" />
                  最多点赞
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">热门主题</p>
                <div className="flex flex-wrap gap-2">
                  {quickTopics.map((topic) => (
                    <Button key={topic.label} variant="secondary" size="sm" asChild>
                      <Link href={topic.href}>{topic.label}</Link>
                    </Button>
                  ))}
                </div>
              </div>
              {(search || category || tag) && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">已选择</p>
                  <div className="flex flex-wrap gap-2">
                    {search && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        关键词: {search}
                      </Badge>
                    )}
                    {category && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        分类: {category}
                      </Badge>
                    )}
                    {tag && (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                        标签: {tag}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Suspense fallback={<PostsGridSkeleton />}>
            <BlogList category={category || undefined} tag={tag || undefined} showPagination />
          </Suspense>
        </section>

        <aside className="space-y-6">
          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Tag className="h-5 w-5 text-primary" />
                热门标签
              </CardTitle>
              <CardDescription>
                正在被频繁阅读和讨论的主题。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {trendingTags.map((item) => (
                <Badge key={item} variant="outline" className="capitalize">
                  #{item}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function PostsGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="border-border/70">
            <CardHeader className="space-y-3 pb-0">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/5" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  )
}
