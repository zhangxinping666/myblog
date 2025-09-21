import { Metadata } from 'next'
import Link from 'next/link'
import { Folder, FileText, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: '分类',
  description: '按技术栈和主题分类浏览文章',
}

interface Category {
  name: string
  slug: string
  description: string
  count: number
  color: string
  icon?: string
}

// 模拟分类数据
const categories: Category[] = [
  {
    name: '前端开发',
    slug: 'frontend',
    description: 'React, Vue, Next.js 等前端技术文章',
    count: 24,
    color: 'bg-blue-500',
  },
  {
    name: '后端开发',
    slug: 'backend',
    description: 'Node.js, Python, Go 等后端技术',
    count: 18,
    color: 'bg-green-500',
  },
  {
    name: '全栈开发',
    slug: 'fullstack',
    description: '全栈项目和架构设计相关',
    count: 12,
    color: 'bg-purple-500',
  },
  {
    name: 'DevOps',
    slug: 'devops',
    description: 'Docker, CI/CD, 云服务等运维技术',
    count: 8,
    color: 'bg-orange-500',
  },
  {
    name: '移动开发',
    slug: 'mobile',
    description: 'React Native, Flutter 移动应用开发',
    count: 6,
    color: 'bg-pink-500',
  },
  {
    name: '工具与效率',
    slug: 'tools',
    description: '开发工具、编辑器配置、效率提升',
    count: 15,
    color: 'bg-indigo-500',
  },
  {
    name: '算法与数据结构',
    slug: 'algorithms',
    description: '编程算法、数据结构、面试题',
    count: 9,
    color: 'bg-red-500',
  },
  {
    name: '职业发展',
    slug: 'career',
    description: '技术管理、职业规划、团队协作',
    count: 7,
    color: 'bg-yellow-500',
  },
]

export default function CategoriesPage() {
  const totalPosts = categories.reduce((sum, category) => sum + category.count, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">文章分类</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          按技术栈和主题分类浏览 {totalPosts} 篇文章
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.slug} className="group hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                    <Folder className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category.count} 篇
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed">
                {category.description}
              </CardDescription>
              
              <Button variant="ghost" className="w-full justify-between p-0 h-auto" asChild>
                <Link href={`/categories/${category.slug}`}>
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    浏览文章
                  </span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="text-center pt-8 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-primary">{categories.length}</div>
            <div className="text-sm text-muted-foreground">个分类</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{totalPosts}</div>
            <div className="text-sm text-muted-foreground">篇文章</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">
              {Math.round(totalPosts / categories.length)}
            </div>
            <div className="text-sm text-muted-foreground">平均每分类</div>
          </div>
        </div>
      </div>
    </div>
  )
}