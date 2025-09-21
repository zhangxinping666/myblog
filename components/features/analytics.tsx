'use client'

import * as React from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { BarChart3, Eye, Users, TrendingUp, Activity } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

// 分析事件类型
interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
}

interface PageViewEvent {
  page: string
  title?: string
  referrer?: string
  userAgent?: string
}

interface CustomEvent {
  action: string
  category?: string
  label?: string
  value?: number
}

// 分析配置类型
interface AnalyticsConfig {
  googleAnalytics?: {
    measurementId: string
    debug?: boolean
  }
  plausible?: {
    domain: string
    apiHost?: string
  }
  umami?: {
    websiteId: string
    apiHost?: string
  }
  custom?: {
    endpoint: string
    apiKey?: string
  }
}

// 分析Hook
export function useAnalytics() {
  const pathname = usePathname()

  // 页面浏览跟踪
  const trackPageView = React.useCallback((data?: Partial<PageViewEvent>) => {
    const pageData: PageViewEvent = {
      page: pathname,
      title: document.title,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      ...data
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: pageData.title,
        page_location: window.location.href,
        page_path: pageData.page,
      })
    }

    // Plausible
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('pageview')
    }

    // Umami
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track('pageview')
    }

    // 自定义分析
    sendCustomEvent('page_view', pageData)
  }, [pathname])

  // 自定义事件跟踪
  const trackEvent = React.useCallback((event: CustomEvent) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      })
    }

    // Plausible
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(event.action, {
        props: {
          category: event.category,
          label: event.label,
          value: event.value,
        }
      })
    }

    // Umami
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track(event.action, {
        category: event.category,
        label: event.label,
        value: event.value,
      })
    }

    // 自定义分析
    sendCustomEvent('custom_event', event)
  }, [])

  // 性能跟踪
  const trackPerformance = React.useCallback((metrics: Record<string, number>) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      Object.entries(metrics).forEach(([key, value]) => {
        (window as any).gtag('event', 'timing_complete', {
          name: key,
          value: Math.round(value),
        })
      })
    }

    // 自定义分析
    sendCustomEvent('performance', metrics)
  }, [])

  // 错误跟踪
  const trackError = React.useCallback((error: Error, errorInfo?: any) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      info: errorInfo,
      url: window.location.href,
      userAgent: navigator.userAgent,
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      })
    }

    // 自定义分析
    sendCustomEvent('error', errorData)
  }, [])

  return {
    trackPageView,
    trackEvent,
    trackPerformance,
    trackError,
  }
}

// 发送自定义事件
async function sendCustomEvent(type: string, data: any) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        data,
        timestamp: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.warn('分析事件发送失败:', error)
  }
}

// Google Analytics 组件
export function GoogleAnalytics({ 
  measurementId, 
  debug = false 
}: { 
  measurementId: string
  debug?: boolean 
}) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            debug_mode: ${debug},
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  )
}

// Plausible 组件
export function PlausibleAnalytics({ 
  domain, 
  apiHost = 'https://plausible.io' 
}: { 
  domain: string
  apiHost?: string 
}) {
  return (
    <Script
      defer
      data-domain={domain}
      src={`${apiHost}/js/script.js`}
      strategy="afterInteractive"
    />
  )
}

// Umami 组件
export function UmamiAnalytics({ 
  websiteId, 
  apiHost 
}: { 
  websiteId: string
  apiHost: string 
}) {
  return (
    <Script
      defer
      data-website-id={websiteId}
      src={`${apiHost}/script.js`}
      strategy="afterInteractive"
    />
  )
}

// 页面浏览跟踪组件
export function PageViewTracker() {
  const { trackPageView } = useAnalytics()
  const pathname = usePathname()

  React.useEffect(() => {
    trackPageView()
  }, [pathname, trackPageView])

  return null
}

// 性能监控组件
export function PerformanceTracker() {
  const { trackPerformance } = useAnalytics()

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    // 监听性能指标
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const metrics: Record<string, number> = {}

      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          metrics[entry.name] = entry.duration
        } else if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          metrics['domContentLoaded'] = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart
          metrics['loadComplete'] = navEntry.loadEventEnd - navEntry.loadEventStart
          metrics['firstPaint'] = navEntry.domContentLoadedEventEnd - navEntry.fetchStart
        }
      })

      if (Object.keys(metrics).length > 0) {
        trackPerformance(metrics)
      }
    })

    observer.observe({ entryTypes: ['measure', 'navigation'] })

    // Web Vitals (需要单独安装 web-vitals 库)
    // import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    //   getCLS((metric: any) => trackPerformance({ CLS: metric.value }))
    //   getFID((metric: any) => trackPerformance({ FID: metric.value }))
    //   getFCP((metric: any) => trackPerformance({ FCP: metric.value }))
    //   getLCP((metric: any) => trackPerformance({ LCP: metric.value }))
    //   getTTFB((metric: any) => trackPerformance({ TTFB: metric.value }))
    // })

    return () => observer.disconnect()
  }, [trackPerformance])

  return null
}

// 错误边界分析组件
export class AnalyticsErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  private analytics = {
    trackError: (error: Error, errorInfo?: any) => {
      sendCustomEvent('error', {
        message: error.message,
        stack: error.stack,
        info: errorInfo,
        url: window.location.href,
      })
    }
  }

  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.analytics.trackError(error, errorInfo)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[200px] text-center">
          <div className="space-y-2">
            <div className="text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2" />
              <p>页面出现了一些问题</p>
            </div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="text-sm text-primary hover:underline"
            >
              重试
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// 分析仪表板组件
export function AnalyticsDashboard({ 
  data, 
  className 
}: {
  data: {
    pageViews: number
    uniqueVisitors: number
    averageTime: number
    topPages: Array<{ path: string; views: number }>
  }
  className?: string
}) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium">页面浏览量</span>
        </div>
        <div className="text-2xl font-bold">{data.pageViews.toLocaleString()}</div>
      </div>
      
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium">独立访客</span>
        </div>
        <div className="text-2xl font-bold">{data.uniqueVisitors.toLocaleString()}</div>
      </div>
      
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium">平均停留</span>
        </div>
        <div className="text-2xl font-bold">{Math.round(data.averageTime)}s</div>
      </div>
      
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="h-5 w-5 text-orange-600" />
          <span className="text-sm font-medium">热门页面</span>
        </div>
        <div className="space-y-1">
          {data.topPages.slice(0, 3).map((page) => (
            <div key={page.path} className="flex justify-between text-xs">
              <span className="truncate">{page.path}</span>
              <span className="font-medium">{page.views}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 实时访客组件
export function LiveVisitors({ count }: { count: number }) {
  const [isLive, setIsLive] = React.useState(true)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={cn(
        'w-2 h-2 rounded-full',
        isLive ? 'bg-green-500' : 'bg-green-400'
      )} />
      <span className="text-muted-foreground">
        {count} 人正在浏览
      </span>
    </div>
  )
}

// 分析配置提供者
const AnalyticsContext = React.createContext<AnalyticsConfig | null>(null)

export function AnalyticsProvider({ 
  config, 
  children 
}: { 
  config: AnalyticsConfig
  children: React.ReactNode 
}) {
  return (
    <AnalyticsContext.Provider value={config}>
      {children}
      
      {/* 加载分析脚本 */}
      {config.googleAnalytics && (
        <GoogleAnalytics 
          measurementId={config.googleAnalytics.measurementId}
          debug={config.googleAnalytics.debug ?? false}
        />
      )}
      
      {config.plausible && (
        <PlausibleAnalytics 
          domain={config.plausible.domain}
          apiHost={config.plausible.apiHost ?? 'https://plausible.io'}
        />
      )}
      
      {config.umami && (
        <UmamiAnalytics 
          websiteId={config.umami.websiteId}
          apiHost={config.umami.apiHost ?? ''}
        />
      )}
      
      {/* 自动跟踪组件 */}
      <PageViewTracker />
      <PerformanceTracker />
    </AnalyticsContext.Provider>
  )
}

// 分析配置Hook
export function useAnalyticsConfig() {
  const config = React.useContext(AnalyticsContext)
  if (!config) {
    throw new Error('useAnalyticsConfig 必须在 AnalyticsProvider 内使用')
  }
  return config
}

// 通用分析事件Hook
export function useTrackEvent() {
  const { trackEvent } = useAnalytics()
  
  return React.useCallback((action: string, properties?: Record<string, any>) => {
    trackEvent({
      action,
      category: properties?.['category'],
      label: properties?.['label'],
      value: properties?.['value'],
    })
  }, [trackEvent])
}

// 文章阅读跟踪Hook
export function useReadingProgress(threshold = 0.8) {
  const trackEvent = useTrackEvent()
  const [hasTracked, setHasTracked] = React.useState(false)

  React.useEffect(() => {
    if (hasTracked) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = scrollTop / docHeight

      if (scrollPercent >= threshold) {
        trackEvent('article_read', {
          category: 'engagement',
          label: 'article_completion',
          value: Math.round(scrollPercent * 100),
        })
        setHasTracked(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold, trackEvent, hasTracked])
}

// 离开意图跟踪Hook  
export function useExitIntent() {
  const trackEvent = useTrackEvent()

  React.useEffect(() => {
    let hasTracked = false

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTracked) {
        trackEvent('exit_intent', {
          category: 'engagement',
          label: 'mouse_leave',
        })
        hasTracked = true
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [trackEvent])
}

export type { 
  AnalyticsEvent, 
  PageViewEvent, 
  CustomEvent, 
  AnalyticsConfig 
}