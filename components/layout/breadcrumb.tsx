'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

export interface BreadcrumbItem {
  title: string
  href: string
  disabled?: boolean
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[] | undefined
  separator?: React.ReactNode
  className?: string
}

// 根据路径自动生成面包屑
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [
    { title: '首页', href: '/' }
  ]

  let href = ''
  for (const path of paths) {
    href += `/${path}`
    
    // 根据路径生成标题
    let title = path
    switch (path) {
      case 'posts':
        title = '文章'
        break
      case 'categories':
        title = '分类'
        break
      case 'tags':
        title = '标签'
        break
      case 'projects':
        title = '项目'
        break
      case 'about':
        title = '关于'
        break
      case 'uses':
        title = '工具'
        break
      default:
        // 对于动态路径，首字母大写
        title = path.charAt(0).toUpperCase() + path.slice(1)
    }

    breadcrumbs.push({ title, href })
  }

  return breadcrumbs
}

export function Breadcrumb({ 
  items, 
  separator = <ChevronRight className="h-4 w-4" />, 
  className 
}: BreadcrumbProps) {
  const pathname = usePathname()
  
  // 如果没有提供 items，则自动从路径生成
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname)

  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1
        const isFirst = index === 0

        return (
          <React.Fragment key={item.href}>
            {isFirst ? (
              <Link
                href={item.href}
                className="flex items-center hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="sr-only">{item.title}</span>
              </Link>
            ) : isLast ? (
              <span className="font-medium text-foreground">
                {item.title}
              </span>
            ) : (
              <Link
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'hover:text-foreground transition-colors',
                  item.disabled && 'cursor-not-allowed opacity-60'
                )}
              >
                {item.title}
              </Link>
            )}
            
            {!isLast && (
              <span className="text-muted-foreground">
                {separator}
              </span>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

// 简化版面包屑，只显示文本
export function SimpleBreadcrumb({ 
  items, 
  separator = '/', 
  className 
}: BreadcrumbProps) {
  const pathname = usePathname()
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname)

  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <div className={cn('text-sm text-muted-foreground', className)}>
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1

        return (
          <React.Fragment key={item.href}>
            {isLast ? (
              <span className="font-medium text-foreground">
                {item.title}
              </span>
            ) : (
              <Link
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'hover:text-foreground transition-colors',
                  item.disabled && 'cursor-not-allowed opacity-60'
                )}
              >
                {item.title}
              </Link>
            )}
            
            {!isLast && (
              <span className="mx-2 text-muted-foreground">
                {separator}
              </span>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// 可折叠的面包屑，适用于很长的路径
export function CollapsibleBreadcrumb({ 
  items, 
  maxItems = 3,
  separator = <ChevronRight className="h-4 w-4" />, 
  className 
}: BreadcrumbProps & { maxItems?: number }) {
  const pathname = usePathname()
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname)

  if (breadcrumbItems.length <= 1) {
    return null
  }

  const shouldCollapse = breadcrumbItems.length > maxItems
  let displayItems = breadcrumbItems

  if (shouldCollapse) {
    const first = breadcrumbItems[0]
    const last = breadcrumbItems.slice(-2) // 最后两个
    if (first) {
      displayItems = [first, { title: '...', href: '#', disabled: true }, ...last]
    }
  }

  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1
        const isFirst = index === 0
        const isEllipsis = item.title === '...'

        return (
          <React.Fragment key={`${item.href}-${index}`}>
            {isEllipsis ? (
              <span className="text-muted-foreground">...</span>
            ) : isFirst ? (
              <Link
                href={item.href}
                className="flex items-center hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="sr-only">{item.title}</span>
              </Link>
            ) : isLast ? (
              <span className="font-medium text-foreground">
                {item.title}
              </span>
            ) : (
              <Link
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'hover:text-foreground transition-colors',
                  item.disabled && 'cursor-not-allowed opacity-60'
                )}
              >
                {item.title}
              </Link>
            )}
            
            {!isLast && (
              <span className="text-muted-foreground">
                {separator}
              </span>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}