import { Metadata } from 'next'
import Link from 'next/link'
import { Github, ExternalLink, Calendar, Star, GitFork } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: '项目',
  description: '我的开源项目和作品集',
}

interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  status: 'active' | 'completed' | 'archived'
  featured: boolean
  stars?: number
  forks?: number
  createdAt: string
}

// 模拟项目数据
const projects: Project[] = [
  {
    id: 'blog-system',
    title: 'Next.js 博客系统',
    description: '基于 Next.js 14 的现代化博客系统，支持 MDX、搜索、评论等功能',
    longDescription: '这是一个功能完整的博客系统，采用最新的 Next.js 14 App Router 架构。包含文章管理、分类标签、搜索功能、评论系统、邮件订阅等特性。使用 TypeScript 确保类型安全，Tailwind CSS 实现响应式设计。',
    image: '/images/projects/blog-system.jpg',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX', 'Prisma'],
    githubUrl: 'https://github.com/example/blog-system',
    liveUrl: 'https://blog-demo.vercel.app',
    status: 'active',
    featured: true,
    stars: 128,
    forks: 32,
    createdAt: '2024-01-15',
  },
  {
    id: 'ui-components',
    title: 'React UI 组件库',
    description: '基于 Radix UI 和 Tailwind CSS 的现代 React 组件库',
    longDescription: '一套完整的 React UI 组件库，基于 Radix UI 无障碍访问基础组件，使用 Tailwind CSS 实现样式系统。支持暗色模式、自定义主题、完整的 TypeScript 类型定义。',
    image: '/images/projects/ui-components.jpg',
    technologies: ['React', 'TypeScript', 'Radix UI', 'Tailwind CSS', 'Storybook'],
    githubUrl: 'https://github.com/example/ui-components',
    liveUrl: 'https://ui-components-demo.vercel.app',
    status: 'active',
    featured: true,
    stars: 256,
    forks: 64,
    createdAt: '2023-11-20',
  },
  {
    id: 'task-manager',
    title: '项目管理工具',
    description: '团队协作的项目管理和任务跟踪工具',
    longDescription: '为小团队设计的项目管理工具，支持任务分配、进度跟踪、团队协作、文件共享等功能。采用实时同步技术，确保团队成员始终看到最新状态。',
    image: '/images/projects/task-manager.jpg',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'Redis'],
    githubUrl: 'https://github.com/example/task-manager',
    status: 'completed',
    featured: false,
    stars: 89,
    forks: 23,
    createdAt: '2023-08-10',
  },
  {
    id: 'api-client',
    title: 'API 客户端生成器',
    description: '自动从 OpenAPI 规范生成 TypeScript 客户端代码',
    longDescription: '开发工具，可以从 OpenAPI/Swagger 规范自动生成 TypeScript 客户端代码。支持多种 HTTP 客户端、自定义模板、类型安全的 API 调用。',
    image: '/images/projects/api-client.jpg',
    technologies: ['TypeScript', 'Node.js', 'OpenAPI', 'CLI'],
    githubUrl: 'https://github.com/example/api-client-generator',
    status: 'active',
    featured: false,
    stars: 67,
    forks: 15,
    createdAt: '2023-06-05',
  },
  {
    id: 'chrome-extension',
    title: 'DevTools 浏览器扩展',
    description: '提升开发效率的 Chrome 扩展工具集',
    longDescription: '开发者工具集合的 Chrome 扩展，包含 JSON 格式化、颜色选择器、Lorem Ipsum 生成器、网页性能分析等实用工具。',
    image: '/images/projects/chrome-extension.jpg',
    technologies: ['JavaScript', 'Chrome Extension API', 'HTML', 'CSS'],
    githubUrl: 'https://github.com/example/devtools-extension',
    status: 'completed',
    featured: false,
    stars: 145,
    forks: 28,
    createdAt: '2023-03-12',
  },
  {
    id: 'data-visualization',
    title: '数据可视化平台',
    description: '交互式数据可视化和分析平台',
    longDescription: '为数据分析师和业务用户设计的可视化平台，支持多种图表类型、实时数据更新、交互式仪表板、数据导出等功能。',
    image: '/images/projects/data-viz.jpg',
    technologies: ['React', 'D3.js', 'Python', 'FastAPI', 'MongoDB'],
    githubUrl: 'https://github.com/example/data-viz-platform',
    status: 'archived',
    featured: false,
    stars: 78,
    forks: 19,
    createdAt: '2022-12-01',
  },
]

const featuredProjects = projects.filter(project => project.featured)
const otherProjects = projects.filter(project => !project.featured)

function getStatusBadge(status: Project['status']) {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">开发中</Badge>
    case 'completed':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">已完成</Badge>
    case 'archived':
      return <Badge variant="secondary">已归档</Badge>
  }
}

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 ${featured ? 'border-primary/20 bg-primary/5' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className={`group-hover:text-primary transition-colors ${featured ? 'text-lg' : ''}`}>
              {project.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(project.status)}
              {featured && (
                <Badge variant="outline" className="text-xs">
                  精选项目
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {project.stars && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {project.stars}
              </div>
            )}
            {project.forks && (
              <div className="flex items-center gap-1">
                <GitFork className="h-3 w-3" />
                {project.forks}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="leading-relaxed">
          {project.description}
        </CardDescription>
        
        <div className="flex flex-wrap gap-1">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                源码
              </Link>
            </Button>
          )}
          {project.liveUrl && (
            <Button variant="outline" size="sm" asChild>
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                预览
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/projects/${project.id}`}>
              查看详情
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
          <Calendar className="h-3 w-3" />
          <span>创建于 {new Date(project.createdAt).toLocaleDateString('zh-CN')}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProjectsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">项目作品</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            展示我的开源项目和技术作品，涵盖前端、后端、工具开发等领域
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>开发中项目</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>已完成项目</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>已归档项目</span>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">精选项目</h2>
            <p className="text-muted-foreground">重点推荐的优质项目</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>
        </section>
      )}

      {featuredProjects.length > 0 && <Separator />}

      {/* Other Projects */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">其他项目</h2>
          <p className="text-muted-foreground">更多开源项目和实验性作品</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="text-center pt-8 border-t">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-primary">{projects.length}</div>
            <div className="text-sm text-muted-foreground">个项目</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">
              {projects.reduce((sum, p) => sum + (p.stars || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">GitHub Stars</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">
              {projects.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">活跃项目</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">
              {new Set(projects.flatMap(p => p.technologies)).size}
            </div>
            <div className="text-sm text-muted-foreground">技术栈</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 py-12 bg-muted/30 rounded-lg">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">有想法或建议？</h3>
          <p className="text-muted-foreground">
            欢迎通过 GitHub 或邮件与我交流技术，分享你的想法
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              关注我的 GitHub
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">
              联系我
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}