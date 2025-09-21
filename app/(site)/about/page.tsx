import { Metadata } from 'next'
import Link from 'next/link'
import { Github, Twitter, Mail, MapPin, Calendar, Award, Code, Heart, Coffee, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Newsletter } from '@/components/features/newsletter'

export const metadata: Metadata = {
  title: '关于我',
  description: '了解我的技术背景、工作经历和联系方式',
}

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">ZS</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold">张三</h1>
            <p className="text-xl text-muted-foreground">全栈开发工程师</p>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            专注于现代 Web 技术，喜欢探索新技术、分享经验和构建有价值的产品。
            热爱开源，相信技术能让世界更美好。
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="mailto:hello@example.com">
              <Mail className="mr-2 h-4 w-4" />
              邮箱联系
            </Link>
          </Button>
        </div>
      </section>

      <Separator />

      {/* About Me */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">关于我</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                基本信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>北京, 中国</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>5+ 年开发经验</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>计算机科学学士学位</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                兴趣爱好
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">编程</Badge>
                <Badge variant="secondary">开源</Badge>
                <Badge variant="secondary">摄影</Badge>
                <Badge variant="secondary">旅行</Badge>
                <Badge variant="secondary">阅读</Badge>
                <Badge variant="secondary">音乐</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            你好！我是张三，一名充满热情的全栈开发工程师。从 2019 年开始我的编程之旅，
            至今已有 5 年的专业开发经验。我专注于现代 Web 技术，特别是 React 生态系统。
          </p>
          <p>
            我相信技术应该为人类服务，让生活更美好。在开发过程中，我注重代码质量、
            用户体验和团队协作。我热爱学习新技术，分享知识，并积极参与开源社区。
          </p>
          <p>
            除了编程，我还喜欢摄影、旅行和阅读。这些爱好不仅丰富了我的生活，
            也为我的工作带来了新的视角和创意。
          </p>
        </div>
      </section>

      <Separator />

      {/* Tech Stack */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">技术栈</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-600" />
                前端开发
              </CardTitle>
              <CardDescription>构建现代化的用户界面</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>React</Badge>
                <Badge>Next.js</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Tailwind CSS</Badge>
                <Badge>Vue.js</Badge>
                <Badge>Sass</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                后端开发
              </CardTitle>
              <CardDescription>服务端架构与 API 设计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Node.js</Badge>
                <Badge>Express</Badge>
                <Badge>NestJS</Badge>
                <Badge>GraphQL</Badge>
                <Badge>PostgreSQL</Badge>
                <Badge>MongoDB</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-orange-600" />
                工具与部署
              </CardTitle>
              <CardDescription>开发工具和部署平台</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Git</Badge>
                <Badge>Docker</Badge>
                <Badge>Vercel</Badge>
                <Badge>AWS</Badge>
                <Badge>VS Code</Badge>
                <Badge>Figma</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Work Experience */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">工作经历</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>高级前端工程师</CardTitle>
                  <CardDescription>科技有限公司</CardDescription>
                </div>
                <Badge variant="secondary">2022 - 至今</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>负责公司核心产品的前端架构设计和开发</li>
                <li>带领团队完成多个大型项目的前端部分</li>
                <li>优化应用性能，提升用户体验</li>
                <li>建立前端开发规范和工作流程</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>全栈开发工程师</CardTitle>
                  <CardDescription>创业公司</CardDescription>
                </div>
                <Badge variant="secondary">2020 - 2022</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>独立负责产品的前后端开发</li>
                <li>设计和实现 RESTful API</li>
                <li>参与产品设计和技术选型</li>
                <li>维护和优化服务器基础设施</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Contact */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">联系我</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              如果你对我的项目感兴趣，或者想要合作、交流技术，欢迎通过以下方式联系我：
            </p>
            
            <div className="space-y-4">
              <a
                href="mailto:hello@example.com"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>hello@example.com</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span>Twitter</span>
              </a>
            </div>
          </div>

          <Newsletter variant="card" />
        </div>
      </section>
    </div>
  )
}