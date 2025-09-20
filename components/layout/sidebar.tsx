'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight } from 'lucide-react'

import { type SidebarNavItem } from '@/lib/config/navigation'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface SidebarProps {
  items: SidebarNavItem[]
  className?: string
}

interface SidebarNavProps {
  items: SidebarNavItem[]
  pathname?: string | null | undefined
  level?: number
}

export function Sidebar({ items, className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn('pb-12 w-full', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <SidebarNav items={items} pathname={pathname} />
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarNav({ items, pathname, level = 0 }: SidebarNavProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) => (
        <SidebarNavItem
          key={index}
          item={item}
          pathname={pathname}
          level={level}
        />
      ))}
    </div>
  ) : null
}

interface SidebarNavItemProps {
  item: SidebarNavItem
  pathname?: string | null | undefined
  level: number
}

function SidebarNavItem({ item, pathname, level }: SidebarNavItemProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const hasChildren = item.items && item.items.length > 0
  const isActive = pathname === item.href
  const isInPath = pathname?.startsWith(item.href) || false

  // Auto-expand if current path is within this section
  React.useEffect(() => {
    if (isInPath && hasChildren) {
      setIsOpen(true)
    }
  }, [isInPath, hasChildren])

  const paddingLeft = level * 16 + 12

  if (hasChildren) {
    return (
      <div>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start h-auto p-0 font-normal',
            isActive && 'bg-muted font-medium text-foreground'
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className="flex items-center w-full py-2 px-3 rounded-md hover:bg-muted transition-colors"
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            {hasChildren && (
              <span className="mr-2">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            )}
            <span className={cn(
              'flex-1 text-left',
              isActive ? 'font-medium' : 'text-muted-foreground'
            )}>
              {item.title}
            </span>
          </div>
        </Button>
        
        {isOpen && hasChildren && (
          <div className="pb-2">
            <SidebarNav 
              items={item.items} 
              pathname={pathname} 
              level={level + 1} 
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.disabled ? '#' : item.href}
      className={cn(
        'flex items-center py-2 px-3 rounded-md text-sm font-normal transition-colors hover:bg-muted',
        isActive ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground',
        item.disabled && 'cursor-not-allowed opacity-60'
      )}
      style={{ paddingLeft: `${paddingLeft}px` }}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noreferrer' : undefined}
    >
      {item.title}
      {item.description && (
        <span className="ml-auto text-xs text-muted-foreground">
          {item.description}
        </span>
      )}
    </Link>
  )
}

// Alternative compact sidebar for mobile or narrow layouts
export function CompactSidebar({ items, className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <div key={index} className="space-y-1">
          <h4 className="text-sm font-semibold tracking-tight px-2 py-1">
            {item.title}
          </h4>
          {item.items?.map((subItem, subIndex) => (
            <Link
              key={subIndex}
              href={subItem.disabled ? '#' : subItem.href}
              className={cn(
                'block px-2 py-1 text-sm rounded-md transition-colors hover:bg-muted',
                pathname === subItem.href 
                  ? 'bg-muted font-medium text-foreground' 
                  : 'text-muted-foreground',
                subItem.disabled && 'cursor-not-allowed opacity-60'
              )}
              target={subItem.external ? '_blank' : undefined}
              rel={subItem.external ? 'noreferrer' : undefined}
            >
              {subItem.title}
            </Link>
          ))}
          {index < items.length - 1 && <Separator className="my-2" />}
        </div>
      ))}
    </div>
  )
}