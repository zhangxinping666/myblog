'use client'

import * as React from 'react'
import { List, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils/cn'
import { useScrollState } from '@/lib/hooks/use-scroll'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// 目录项类型
export interface TocItem {
  id: string
  title: string
  level: number
  children?: TocItem[]
}

interface TocProps {
  items: TocItem[]
  className?: string
  activeId?: string
  onItemClick?: ((id: string) => void) | undefined
}

interface TocItemProps {
  item: TocItem
  activeId?: string | undefined
  onItemClick?: ((id: string) => void | undefined) | undefined
  level?: number
}

// 从DOM中提取标题生成目录
export function generateTocFromDOM(containerSelector = 'main'): TocItem[] {
  if (typeof window === 'undefined') return []

  const container = document.querySelector(containerSelector)
  if (!container) return []

  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const items: TocItem[] = []

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1))
    const id = heading.id || generateIdFromText(heading.textContent || '')
    const title = heading.textContent || ''

    // 确保标题有ID，用于锚点导航
    if (!heading.id) {
      heading.id = id
    }

    items.push({
      id,
      title,
      level,
    })
  })

  return buildTocTree(items)
}

// 从文本生成ID
function generateIdFromText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // 保留中文、英文、数字、空格、连字符
    .replace(/\s+/g, '-') // 将空格替换为连字符
    .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
}

// 构建层级目录树
function buildTocTree(items: TocItem[]): TocItem[] {
  const root: TocItem[] = []
  const stack: TocItem[] = []

  items.forEach((item) => {
    // 找到合适的父级
    while (stack.length > 0 && stack[stack.length - 1]!.level >= item.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      // 根级项目
      root.push(item)
    } else {
      // 添加到父级的children中
      const parent = stack[stack.length - 1]!
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(item)
    }

    stack.push(item)
  })

  return root
}

// 单个目录项组件
function TocItemComponent({ item, activeId, onItemClick, level = 0 }: TocItemProps) {
  const isActive = activeId === item.id
  const hasChildren = item.children && item.children.length > 0
  const [isExpanded, setIsExpanded] = React.useState(true)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onItemClick?.(item.id)
    
    // 滚动到对应标题
    const element = document.getElementById(item.id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  return (
    <div>
      <div
        className={cn(
          'group flex items-center py-1 px-2 rounded-md text-sm cursor-pointer transition-colors',
          'hover:bg-muted/50',
          isActive && 'bg-muted text-foreground font-medium',
          !isActive && 'text-muted-foreground'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {hasChildren && (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 mr-1 hover:bg-muted-foreground/20"
            onClick={toggleExpand}
          >
            <ChevronRight
              className={cn(
                'h-3 w-3 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          </Button>
        )}
        <span className="flex-1 leading-snug">{item.title}</span>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-2">
          {item.children?.map((child) => (
            <TocItemComponent
              key={child.id}
              item={child}
              activeId={activeId}
              onItemClick={onItemClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// 主目录组件
export function Toc({ items, className, activeId, onItemClick }: TocProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <nav className={cn('space-y-1', className)}>
      <h4 className="font-semibold text-sm mb-3 px-2">目录</h4>
      <div className="space-y-1">
        {items.map((item) => (
          <TocItemComponent
            key={item.id}
            item={item}
            activeId={activeId}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    </nav>
  )
}

// 粘性侧边栏目录组件
export function StickyToc({ className, containerSelector = 'main' }: { 
  className?: string
  containerSelector?: string 
}) {
  const [items, setItems] = React.useState<TocItem[]>([])
  const [activeId, setActiveId] = React.useState<string>('')

  // 生成目录
  React.useEffect(() => {
    const generateToc = () => {
      const tocItems = generateTocFromDOM(containerSelector)
      setItems(tocItems)
    }

    // 延迟生成，确保DOM已渲染
    const timer = setTimeout(generateToc, 100)
    return () => clearTimeout(timer)
  }, [containerSelector])

  // 监听滚动，更新活跃项
  const { y: scrollY } = useScrollState()

  React.useEffect(() => {
    if (items.length === 0) return

    const headings = items.flatMap(function flattenItems(item: TocItem): TocItem[] {
      return [item, ...(item.children?.flatMap(flattenItems) || [])]
    })

    // 找到当前视口中的标题
    let currentActiveId = ''
    for (const item of headings) {
      const element = document.getElementById(item.id)
      if (element) {
        const rect = element.getBoundingClientRect()
        if (rect.top <= 100) {
          currentActiveId = item.id
        } else {
          break
        }
      }
    }

    setActiveId(currentActiveId)
  }, [scrollY, items])

  if (items.length === 0) {
    return null
  }

  return (
    <div className={cn('sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto', className)}>
      <Toc items={items} activeId={activeId} />
    </div>
  )
}

// 移动端目录对话框
export function MobileToc({ className, containerSelector = 'main' }: { 
  className?: string
  containerSelector?: string 
}) {
  const [items, setItems] = React.useState<TocItem[]>([])
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const generateToc = () => {
      const tocItems = generateTocFromDOM(containerSelector)
      setItems(tocItems)
    }

    const timer = setTimeout(generateToc, 100)
    return () => clearTimeout(timer)
  }, [containerSelector])

  const handleItemClick = (id: string) => {
    setOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn('md:hidden', className)}
        >
          <List className="h-4 w-4 mr-2" />
          目录
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>文章目录</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto">
          <Toc items={items} onItemClick={handleItemClick} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 简化的内联目录
export function InlineToc({ 
  items, 
  className, 
  maxItems = 10 
}: TocProps & { maxItems?: number }) {
  if (!items || items.length === 0) {
    return null
  }

  // 扁平化目录项并限制数量
  const flatItems = items
    .flatMap(function flattenItems(item: TocItem): TocItem[] {
      return [item, ...(item.children?.flatMap(flattenItems) || [])]
    })
    .slice(0, maxItems)

  return (
    <nav className={cn('border rounded-lg p-4 bg-muted/30', className)}>
      <h4 className="font-semibold text-sm mb-3 flex items-center">
        <List className="h-4 w-4 mr-2" />
        本文目录
      </h4>
      <ul className="space-y-2 text-sm">
        {flatItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors block py-1"
              style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// 进度指示器组件
export function ReadingProgress({ className }: { className?: string }) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress() // 初始化

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className={cn('fixed top-0 left-0 right-0 z-50 h-1 bg-muted', className)}>
      <div 
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export type { TocItem as TocItemType }