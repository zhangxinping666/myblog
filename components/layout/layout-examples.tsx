'use client'

import * as React from 'react'
import { Header } from './header'
import { Footer } from './footer'
import { Sidebar } from './sidebar'
import { Breadcrumb, BreadcrumbItem } from './breadcrumb'
import { sidebarNav } from '@/lib/config/navigation'
import { cn } from '@/lib/utils/cn'

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

// 基础布局 - 只有头部和尾部
export function BaseLayout({ children, className }: LayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

// 带侧边栏的布局 - 适用于文档页面
export function SidebarLayout({ children, className }: LayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <Sidebar items={sidebarNav} />
          </div>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:gap-20">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}

// 带面包屑的布局
export function BreadcrumbLayout({ 
  children, 
  className,
  breadcrumbItems 
}: LayoutProps & { breadcrumbItems?: BreadcrumbItem[] }) {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      <Header />
      <div className="container">
        <div className="py-4 border-b">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <main className="flex-1 container py-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}

// 全宽布局 - 适用于着陆页
export function FullWidthLayout({ children, className }: LayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

// 居中内容布局 - 适用于文章页面
export function CenteredLayout({ children, className }: LayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      <Header />
      <main className="flex-1 container max-w-4xl py-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}

// 三栏布局 - 主内容 + 两个侧边栏
export function ThreeColumnLayout({ 
  children, 
  className,
  leftSidebar,
  rightSidebar 
}: LayoutProps & { 
  leftSidebar?: React.ReactNode
  rightSidebar?: React.ReactNode 
}) {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      <Header />
      <div className="container flex-1 grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)_240px] lg:gap-10">
        {/* 左侧边栏 */}
        {leftSidebar && (
          <aside className="hidden lg:block">
            <div className="sticky top-20 py-6">
              {leftSidebar}
            </div>
          </aside>
        )}
        
        {/* 主内容 */}
        <main className="py-6 lg:py-8">
          {children}
        </main>
        
        {/* 右侧边栏 */}
        {rightSidebar && (
          <aside className="hidden lg:block">
            <div className="sticky top-20 py-6">
              {rightSidebar}
            </div>
          </aside>
        )}
      </div>
      <Footer />
    </div>
  )
}

// 响应式布局示例组件
export function LayoutExample() {
  return (
    <BaseLayout>
      <div className="container py-8 space-y-8">
        <h1 className="text-3xl font-bold">布局组件展示</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Header 组件</h2>
            <p className="text-muted-foreground">
              包含导航菜单、Logo、主题切换和移动端菜单
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Footer 组件</h2>
            <p className="text-muted-foreground">
              包含链接、社交媒体和版权信息
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Sidebar 组件</h2>
            <p className="text-muted-foreground">
              可折叠的侧边栏导航，支持嵌套菜单
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Breadcrumb 组件</h2>
            <p className="text-muted-foreground">
              面包屑导航，支持自动生成和自定义
            </p>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}