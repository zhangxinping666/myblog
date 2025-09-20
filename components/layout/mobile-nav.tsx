'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { type MainNavItem } from '@/lib/config/navigation'
import { siteConfig } from '@/lib/config/site'
import { cn } from '@/lib/utils/cn'
import { Separator } from '@/components/ui/separator'

interface MobileNavProps {
  items: MainNavItem[]
  onClose: () => void
  className?: string
}

export function MobileNav({ items, onClose, className }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <div className={cn(
      'fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] w-full grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden',
      className
    )}>
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        
        <Separator />
        
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline',
                item.href === pathname && 'text-foreground',
                item.disabled && 'cursor-not-allowed opacity-60'
              )}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
              onClick={onClose}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        
        <Separator />
        
        <div className="flex items-center space-x-2">
          {/* Additional mobile actions can be added here */}
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
        </div>
      </div>
    </div>
  )
}