import { Metadata } from 'next'
import Link from 'next/link'
import { Tag, Hash, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: '标签',
  description: '通过标签快速找到相关技术文章',
}

interface TagData {
  name: string
  slug: string
  count: number
  trending?: boolean
}

// 模拟标签数据
const tags: TagData[] = [
  { name: 'React', slug: 'react', count: 32, trending: true },
  { name: 'Next.js', slug: 'nextjs', count: 28, trending: true },
  { name: 'TypeScript', slug: 'typescript', count: 25, trending: true },
  { name: 'JavaScript', slug: 'javascript', count: 45 },
  { name: 'Node.js', slug: 'nodejs', count: 22 },
  { name: 'Tailwind CSS', slug: 'tailwindcss', count: 18 },
  { name: 'Vue.js', slug: 'vuejs', count: 15 },
  { name: 'CSS', slug: 'css', count: 20 },
  { name: 'HTML', slug: 'html', count: 12 },
  { name: 'Docker', slug: 'docker', count: 14 },
  { name: 'Git', slug: 'git', count: 16 },
  { name: 'API', slug: 'api', count: 19 },
  { name: 'Database', slug: 'database', count: 13 },
  { name: 'Performance', slug: 'performance', count: 11, trending: true },
  { name: 'Testing', slug: 'testing', count: 9 },
  { name: 'DevOps', slug: 'devops', count: 8 },
  { name: 'GraphQL', slug: 'graphql', count: 7 },
  { name: 'MongoDB', slug: 'mongodb', count: 10 },
  { name: 'PostgreSQL', slug: 'postgresql', count: 8 },
  { name: 'Redis', slug: 'redis', count: 6 },
  { name: 'AWS', slug: 'aws', count: 12 },
  { name: 'Vercel', slug: 'vercel', count: 9 },
  { name: 'Webpack', slug: 'webpack', count: 7 },
  { name: 'Vite', slug: 'vite', count: 11, trending: true },
  { name: 'ESLint', slug: 'eslint', count: 5 },
  { name: 'Prettier', slug: 'prettier', count: 4 },
]

// 按文章数量排序
const sortedTags = [...tags].sort((a, b) => b.count - a.count)
const trendingTags = tags.filter(tag => tag.trending).sort((a, b) => b.count - a.count)

// 获取标签的字体大小（基于文章数量）
function getTagSize(count: number, maxCount: number) {
  const ratio = count / maxCount
  if (ratio > 0.8) return 'text-2xl'
  if (ratio > 0.6) return 'text-xl'
  if (ratio > 0.4) return 'text-lg'
  if (ratio > 0.2) return 'text-base'
  return 'text-sm'
}

// 获取标签的颜色变体
function getTagVariant(count: number, maxCount: number) {
  const ratio = count / maxCount
  if (ratio > 0.8) return 'default'
  if (ratio > 0.6) return 'secondary'
  return 'outline'
}

export default function TagsPage() {
  const maxCount = Math.max(...tags.map(tag => tag.count))
  const totalPosts = tags.reduce((sum, tag) => sum + tag.count, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">标签</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          通过 {tags.length} 个标签快速找到相关技术文章
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索标签..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Trending Tags */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h2 className="text-2xl font-semibold">热门标签</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <Link key={tag.slug} href={`/tags/${tag.slug}`}>
              <Badge
                variant="default"
                className="text-sm px-3 py-1 bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200"
              >
                <TrendingUp className="mr-1 h-3 w-3" />
                {tag.name} ({tag.count})
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* Tag Cloud */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">标签云</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {tags.map((tag) => (
            <Link key={tag.slug} href={`/tags/${tag.slug}`}>
              <Badge
                variant={getTagVariant(tag.count, maxCount)}
                className={`${getTagSize(tag.count, maxCount)} px-3 py-1 hover:scale-105 transition-transform cursor-pointer`}
              >
                {tag.name} ({tag.count})
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Tags */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">热门标签排行</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTags.slice(0, 12).map((tag, index) => (
            <Card key={tag.slug} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground">#{index + 1}</span>
                    <Tag className="h-4 w-4" />
                    {tag.name}
                    {tag.trending && (
                      <TrendingUp className="h-3 w-3 text-orange-500" />
                    )}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {tag.count} 篇
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" size="sm" className="w-full justify-start p-0" asChild>
                  <Link href={`/tags/${tag.slug}`}>
                    查看相关文章
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <div className="text-center pt-8 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-primary">{tags.length}</div>
            <div className="text-sm text-muted-foreground">个标签</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{totalPosts}</div>
            <div className="text-sm text-muted-foreground">篇文章</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{trendingTags.length}</div>
            <div className="text-sm text-muted-foreground">热门标签</div>
          </div>
        </div>
      </div>
    </div>
  )
}