'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import type { HeadingItem } from '@/lib/utils/extract-headings'

// 简化的目录项类型
interface SimpleTocItem {
  id: string
  title: string
  level: number
}

interface SimpleTocProps {
  items: HeadingItem[]
  activeId?: string
  className?: string
}

// 简化的目录组件
export function SimpleToc({ items, activeId, className }: SimpleTocProps) {
  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  if (!items || items.length === 0) {
    return null
  }

  return (
    <nav className={cn('space-y-1', className)}>
      <h4 className="font-semibold text-sm mb-3 px-2">目录</h4>
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'cursor-pointer py-1 px-2 rounded-md text-sm transition-colors',
              'hover:bg-muted/50',
              activeId === item.id && 'bg-muted text-foreground font-medium',
              activeId !== item.id && 'text-muted-foreground'
            )}
            style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
            onClick={() => handleClick(item.id)}
          >
            <span className="leading-snug">{item.title}</span>
          </div>
        ))}
      </div>
    </nav>
  )
}

// 简化的粘性目录组件
export function SimpleStickyToc({ items, className }: { 
  items: HeadingItem[]
  className?: string 
}) {
  const [activeId, setActiveId] = React.useState<string>('')

  // 监听滚动，更新活跃项
  React.useEffect(() => {
    if (items.length === 0) return

    const handleScroll = () => {
      // 找到当前视口中的标题
      let currentActiveId = ''
      for (const item of items) {
        const element = document.getElementById(item.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            currentActiveId = item.id
          } else {
            break
          }
        }
      }

      setActiveId(currentActiveId)
    }

    // 监听滚动事件
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 初始执行

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [items])

  if (items.length === 0) {
    return null
  }

  return (
    <div className={cn(
      'sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto',
      'transition-all duration-200 ease-in-out',
      'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',
      className
    )}>
      <div className="p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg">
        <SimpleToc items={items} activeId={activeId} />
      </div>
    </div>
  )
}

