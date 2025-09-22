import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Calendar, Tag, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BlogList } from '@/components/blog/blog-list'
import { Newsletter } from '@/components/features/newsletter'
import { siteConfig } from '@/lib/config/site'

export const metadata: Metadata = {
  title: '首页',
  description: siteConfig.description,
}

export default function HomePage() {
  return (
    <div className="container py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            {siteConfig.name}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {siteConfig.description}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/posts">
              <BookOpen className="mr-2 h-5 w-5" />
              阅读文章
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">
              <User className="mr-2 h-5 w-5" />
              了解我
            </Link>
          </Button>
        </div>
      </section>

      <Separator />

      {/* Latest Posts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">最新文章</h2>
          <Button variant="ghost" asChild>
            <Link href="/posts">
              查看全部
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList showPagination={false} />
        </Suspense>
      </section>

      <Separator />

      {/* Features Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">探索更多</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>分类浏览</CardTitle>
              <CardDescription>
                按技术栈和主题分类查看文章
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/categories">
                  浏览分类
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>项目展示</CardTitle>
              <CardDescription>
                查看我的开源项目和作品集
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/projects">
                  查看项目
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <User className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>关于我</CardTitle>
              <CardDescription>
                了解我的技术背景和联系方式
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/about">
                  了解更多
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />
      <section className="max-w-2xl mx-auto">
        <Newsletter variant="card" />
      </section>
    </div>
  )
}

// 骨架屏组件
function BlogListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-5/6"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}