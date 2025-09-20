'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

import { siteConfig } from '@/lib/config/site'
import { mainNav } from '@/lib/config/navigation'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { MobileNav } from './mobile-nav'
import { ThemeToggle } from '@/components/features/theme-toggle'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        {/* Logo */}
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl">
              {siteConfig.name}
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          {mainNav?.length ? (
            <nav className="hidden gap-6 md:flex">
              {mainNav.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? '#' : item.href}
                  className={cn(
                    'flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground/80',
                    item.href === pathname && 'text-foreground',
                    item.disabled && 'cursor-not-allowed opacity-80'
                  )}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        {/* Right side actions */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search can be added here */}
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="md:hidden"
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">切换菜单</span>
            </Button>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <MobileNav 
          items={mainNav} 
          onClose={() => setShowMobileMenu(false)} 
        />
      )}
    </header>
  )
}