'use client'

import { useEffect, useState } from 'react'

/**
 * 媒体查询钩子
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    
    // 设置初始值
    setMatches(mediaQuery.matches)

    // 创建监听器
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // 添加监听器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener)
    } else {
      // 兼容老版本浏览器
      mediaQuery.addListener(listener)
    }

    // 清理函数
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener)
      } else {
        // 兼容老版本浏览器
        mediaQuery.removeListener(listener)
      }
    }
  }, [query])

  return matches
}

/**
 * 响应式断点钩子
 */
export function useBreakpoint() {
  const isSm = useMediaQuery('(min-width: 640px)')
  const isMd = useMediaQuery('(min-width: 768px)')
  const isLg = useMediaQuery('(min-width: 1024px)')
  const isXl = useMediaQuery('(min-width: 1280px)')
  const is2Xl = useMediaQuery('(min-width: 1536px)')

  const currentBreakpoint = is2Xl
    ? '2xl'
    : isXl
    ? 'xl'
    : isLg
    ? 'lg'
    : isMd
    ? 'md'
    : isSm
    ? 'sm'
    : 'xs'

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    currentBreakpoint,
    isSmUp: isSm,
    isMdUp: isMd,
    isLgUp: isLg,
    isXlUp: isXl,
    is2XlUp: is2Xl,
    isSmDown: !isSm,
    isMdDown: !isMd,
    isLgDown: !isLg,
    isXlDown: !isXl,
    is2XlDown: !is2Xl,
  }
}

/**
 * 设备类型检测钩子
 */
export function useDeviceType() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
  }
}

/**
 * 屏幕方向检测钩子
 */
export function useOrientation() {
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const isLandscape = useMediaQuery('(orientation: landscape)')

  return {
    isPortrait,
    isLandscape,
    orientation: isPortrait ? 'portrait' : 'landscape',
  }
}

/**
 * 暗色模式检测钩子
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

/**
 * 减少动画检测钩子
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * 高对比度检测钩子
 */
export function usePrefersHighContrast(): boolean {
  return useMediaQuery('(prefers-contrast: high)')
}

/**
 * 悬停支持检测钩子
 */
export function useHoverSupport(): boolean {
  return useMediaQuery('(hover: hover)')
}

/**
 * 触屏支持检测钩子
 */
export function useTouchSupport(): boolean {
  const [hasTouch, setHasTouch] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkTouch = () => {
      setHasTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      )
    }

    checkTouch()
  }, [])

  return hasTouch
}

/**
 * 视口尺寸钩子
 */
export function useViewportSize() {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // 设置初始值
    updateSize()

    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return size
}

/**
 * 自定义媒体查询集合钩子
 */
export function useMediaQueries(queries: Record<string, string>) {
  const [matches, setMatches] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQueries: Record<string, MediaQueryList> = {}
    const listeners: Record<string, (event: MediaQueryListEvent) => void> = {}
    const initialMatches: Record<string, boolean> = {}

    // 初始化所有媒体查询
    Object.entries(queries).forEach(([key, query]) => {
      mediaQueries[key] = window.matchMedia(query)
      
      // 收集初始值
      initialMatches[key] = mediaQueries[key].matches

      // 创建监听器
      listeners[key] = (event: MediaQueryListEvent) => {
        setMatches(prev => ({
          ...prev,
          [key]: event.matches,
        }))
      }

      // 添加监听器
      if ('addEventListener' in mediaQueries[key]) {
        mediaQueries[key].addEventListener('change', listeners[key])
      } else {
        // 兼容老版本浏览器
        // @ts-ignore - addListener is deprecated but needed for legacy browsers
        mediaQueries[key].addListener(listeners[key])
      }
    })

    // 一次性设置所有初始值
    setMatches(initialMatches)

    // 清理函数
    return () => {
      Object.entries(mediaQueries).forEach(([key, mediaQuery]) => {
        const listener = listeners[key]
        if (!listener) return
        
        if ('removeEventListener' in mediaQuery) {
          mediaQuery.removeEventListener('change', listener)
        } else {
          // 兼容老版本浏览器
          // @ts-ignore - removeListener is deprecated but needed for legacy browsers
          mediaQuery.removeListener(listener)
        }
      })
    }
  }, [queries])

  return matches
}

/**
 * 窗口焦点状态钩子
 */
export function useWindowFocus() {
  const [focused, setFocused] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleFocus = () => setFocused(true)
    const handleBlur = () => setFocused(false)

    // 设置初始状态
    setFocused(document.hasFocus())

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  return focused
}

/**
 * 在线状态检测钩子
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // 设置初始状态
    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}