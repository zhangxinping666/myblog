import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import {
  ArrowRight,
  BookOpen,
  Compass,
  Filter,
  Layers,
  SortAsc,
  Sparkles,
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
import { Newsletter } from '@/components/features/newsletter'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: '所有文章',
  description: '浏览我的所有技术文章和博客内容',
}

const quickTopics = [
  { label: '前端工程化', href: '/categories/frontend' },
  { label: 'React 技巧', href: '/tags/react' },
  { label: '性能优化', href: '/tags/performance' },
  { label: 'TypeScript', href: '/tags/typescript' },
  { label: '工具链', href: '/categories/tooling' },
]

const spotlightCollections = [
  {
    title: '架构与设计思考',
    description: '系统架构、可维护性与工程实践相关的长文精选。',
    href: '/categories/architecture',
  },
  {
    title: '开源项目日志',
    description: '记录开源项目迭代过程中的经验、复盘与踩坑。',
    href: '/projects',
  },
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
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary via-primary/80 to-primary/60 px-6 py-10 text-primary-foreground shadow-xl sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" />
        <div className="relative z-10 flex flex-col gap-10">
          <div className="max-w-2xl space-y-5">
            <Badge className="w-fit bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90 backdrop-blur">
              精选技术文章
            </Badge>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                探索前沿实践，积累可复用的知识资产
              </h1>
              <p className="text-base leading-relaxed text-white/80 sm:text-lg">
                从架构思考到工程落地，涵盖 React、Next.js、TypeScript 与团队协作，
                帮你在实际项目中快速复用最佳实践。
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                <BookOpen className="h-4 w-4" />
                128+ 深度文章
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                <Sparkles className="h-4 w-4" />
                每周持续更新
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                <Layers className="h-4 w-4" />
                场景化最佳实践
              </span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spotlightCollections.map((item) => (
              <Card
                key={item.title}
                className="group border-white/20 bg-white/10 text-white backdrop-blur transition-all hover:border-white/40 hover:bg-white/15"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold leading-snug text-white">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-white/70">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    variant="ghost"
                    asChild
                    className="group/link w-full justify-start gap-2 px-0 text-white hover:bg-transparent hover:text-white/90"
                  >
                    <Link href={item.href}>
                      进入专题
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

          <Card className="border-border/70">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">订阅周刊</CardTitle>
              <CardDescription>
                每周一次把最新文章、资源与实践分享发送到你的邮箱。
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Newsletter variant="card" />
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
