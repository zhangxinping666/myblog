import { Metadata } from 'next'
import Link from 'next/link'
import { Monitor, Code, Palette, Box, Cpu, HardDrive, Wifi, Battery, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: '装备清单',
  description: '我的日常开发工具和设备清单',
}

interface EquipmentItem {
  name: string
  description: string
  link?: string
  price?: string
  tags?: string[]
  recommended?: boolean
}

interface EquipmentCategory {
  title: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  items: EquipmentItem[]
}

const equipment: EquipmentCategory[] = [
  {
    title: '硬件设备',
    icon: Monitor,
    description: '日常工作和生活中使用的硬件设备',
    items: [
      {
        name: 'MacBook Pro 16" (2023)',
        description: 'M3 Max 芯片，64GB 内存，2TB SSD。主力开发机器，性能强劲，续航优秀。',
        link: 'https://www.apple.com/macbook-pro-14-and-16/',
        price: '¥29,999',
        tags: ['主力设备', 'Apple'],
        recommended: true,
      },
      {
        name: 'LG 27UP850 4K 显示器',
        description: '27英寸 4K IPS 显示器，USB-C 一线连接，色彩准确，适合前端开发和设计工作。',
        link: 'https://www.lg.com/',
        price: '¥3,999',
        tags: ['4K', 'USB-C'],
        recommended: true,
      },
      {
        name: 'HHKB Professional Hybrid Type-S',
        description: '静电容键盘，手感极佳，支持蓝牙和有线双模式，程序员神器。',
        link: 'https://happyhackingkb.com/',
        price: '¥2,499',
        tags: ['键盘', '静电容'],
      },
      {
        name: 'MX Master 3S',
        description: '罗技旗舰鼠标，多设备切换，横向滚轮，长续航，办公利器。',
        link: 'https://www.logitech.com/',
        price: '¥899',
        tags: ['鼠标', '多设备'],
      },
      {
        name: 'AirPods Pro 2',
        description: '主动降噪，通透模式，空间音频，日常通勤和专注工作必备。',
        link: 'https://www.apple.com/airpods-pro/',
        price: '¥1,899',
        tags: ['耳机', '降噪'],
      },
    ],
  },
  {
    title: '开发工具',
    icon: Code,
    description: '编程开发使用的软件和工具',
    items: [
      {
        name: 'VS Code',
        description: '主力代码编辑器，插件丰富，性能优秀，支持所有主流语言。',
        link: 'https://code.visualstudio.com/',
        tags: ['免费', '开源'],
        recommended: true,
      },
      {
        name: 'WebStorm',
        description: 'JetBrains 出品的 IDE，智能提示强大，重构功能优秀，适合大型项目。',
        link: 'https://www.jetbrains.com/webstorm/',
        price: '$129/年',
        tags: ['IDE', 'JetBrains'],
      },
      {
        name: 'iTerm2 + Oh My Zsh',
        description: 'Mac 上最好用的终端组合，支持分屏、搜索、自动补全等强大功能。',
        link: 'https://iterm2.com/',
        tags: ['终端', '免费'],
        recommended: true,
      },
      {
        name: 'TablePlus',
        description: '现代化的数据库管理工具，界面美观，支持多种数据库。',
        link: 'https://tableplus.com/',
        price: '$89',
        tags: ['数据库', 'GUI'],
      },
      {
        name: 'Postman',
        description: 'API 开发和测试工具，支持团队协作，自动化测试。',
        link: 'https://www.postman.com/',
        tags: ['API', '测试'],
      },
    ],
  },
  {
    title: '设计工具',
    icon: Palette,
    description: 'UI/UX 设计和图形处理工具',
    items: [
      {
        name: 'Figma',
        description: '协作设计工具，支持实时协作，组件系统强大，开发者友好。',
        link: 'https://www.figma.com/',
        tags: ['免费版', '协作'],
        recommended: true,
      },
      {
        name: 'Sketch',
        description: 'Mac 平台专业 UI 设计工具，插件生态丰富。',
        link: 'https://www.sketch.com/',
        price: '$99/年',
        tags: ['Mac', 'UI'],
      },
      {
        name: 'Pixelmator Pro',
        description: 'Mac 上的图像编辑工具，功能强大，价格亲民，可替代 Photoshop。',
        link: 'https://www.pixelmator.com/pro/',
        price: '¥258',
        tags: ['图像编辑', 'Mac'],
      },
      {
        name: 'CleanShot X',
        description: '强大的截图和录屏工具，支持标注、滚动截图、GIF 录制。',
        link: 'https://cleanshot.com/',
        price: '$29',
        tags: ['截图', '录屏'],
      },
    ],
  },
  {
    title: '生产力工具',
    icon: Zap,
    description: '提高工作效率的软件和服务',
    items: [
      {
        name: 'Notion',
        description: '全能的笔记和项目管理工具，数据库功能强大，支持团队协作。',
        link: 'https://www.notion.so/',
        tags: ['笔记', '项目管理'],
        recommended: true,
      },
      {
        name: 'Obsidian',
        description: '本地化的知识管理工具，支持双向链接，插件丰富，数据安全。',
        link: 'https://obsidian.md/',
        tags: ['笔记', '本地'],
      },
      {
        name: 'Raycast',
        description: 'Mac 效率神器，快速启动器 + 自动化工具，可扩展性强。',
        link: 'https://www.raycast.com/',
        tags: ['Mac', '免费'],
        recommended: true,
      },
      {
        name: '1Password',
        description: '密码管理工具，支持团队共享，安全可靠，多平台同步。',
        link: 'https://1password.com/',
        price: '$2.99/月',
        tags: ['安全', '密码'],
      },
      {
        name: 'CleanMyMac X',
        description: 'Mac 系统清理和优化工具，界面美观，功能全面。',
        link: 'https://macpaw.com/cleanmymac',
        price: '¥199/年',
        tags: ['Mac', '清理'],
      },
    ],
  },
  {
    title: '云服务',
    icon: Wifi,
    description: '常用的云服务和平台',
    items: [
      {
        name: 'Vercel',
        description: 'Next.js 应用的最佳部署平台，自动 CI/CD，全球 CDN。',
        link: 'https://vercel.com/',
        tags: ['部署', '免费额度'],
        recommended: true,
      },
      {
        name: 'GitHub',
        description: '代码托管平台，开源社区，Actions CI/CD，Copilot AI 编程助手。',
        link: 'https://github.com/',
        tags: ['代码托管', '开源'],
        recommended: true,
      },
      {
        name: 'Cloudflare',
        description: 'CDN、DNS、DDoS 防护、Workers 边缘计算，免费额度慷慨。',
        link: 'https://www.cloudflare.com/',
        tags: ['CDN', '安全'],
      },
      {
        name: 'Supabase',
        description: '开源的 Firebase 替代品，PostgreSQL 数据库，实时订阅，认证服务。',
        link: 'https://supabase.com/',
        tags: ['数据库', 'BaaS'],
      },
      {
        name: 'AWS',
        description: '全球最大的云服务提供商，服务全面，适合各种规模的应用。',
        link: 'https://aws.amazon.com/',
        tags: ['云计算', '企业级'],
      },
    ],
  },
]

function EquipmentCard({ item }: { item: EquipmentItem }) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          {item.recommended && (
            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              推荐
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.description}
        </p>
        
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          {item.price && (
            <span className="text-sm font-medium text-primary">{item.price}</span>
          )}
          {item.link && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={item.link} target="_blank" rel="noopener noreferrer">
                查看详情
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function UsesPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">装备清单</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            分享我的日常开发工具和设备，这些装备帮助我保持高效的工作状态
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="gap-1">
            <Box className="h-3 w-3" />
            {equipment.reduce((acc, cat) => acc + cat.items.length, 0)} 个工具
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Zap className="h-3 w-3" />
            {equipment.reduce((acc, cat) => acc + cat.items.filter(i => i.recommended).length, 0)} 个推荐
          </Badge>
        </div>
      </section>

      {/* Equipment Categories */}
      {equipment.map((category, index) => {
        const Icon = category.icon
        return (
          <section key={category.title} className="space-y-6">
            {index > 0 && <Separator className="mb-12" />}
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">{category.title}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item) => (
                <EquipmentCard key={item.name} item={item} />
              ))}
            </div>
          </section>
        )
      })}

      {/* Tips Section */}
      <section className="bg-muted/30 rounded-lg p-8 space-y-6">
        <h3 className="text-2xl font-bold text-center">选择工具的原则</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                性能优先
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                工具的性能直接影响工作效率，选择响应快速、稳定的工具。
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="h-5 w-5" />
                生态完善
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                优先选择有活跃社区、插件丰富、文档完善的工具。
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                数据安全
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                重要数据使用可靠的备份方案，选择支持数据导出的服务。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">有更好的工具推荐？</h3>
          <p className="text-muted-foreground">
            如果你有更好的工具推荐，欢迎与我交流分享
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub 讨论
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}