'use client'

import { useEffect, useState, useCallback } from 'react'

/**
 * 滚动位置信息
 */
interface ScrollPosition {
  x: number
  y: number
}

/**
 * 滚动状态
 */
interface ScrollState {
  x: number
  y: number
  direction: 'up' | 'down' | 'left' | 'right' | null
  isScrolling: boolean
}

/**
 * 滚动钩子选项
 */
interface UseScrollOptions {
  throttle?: number
  element?: HTMLElement | null
}

/**
 * 获取滚动位置
 */
export function useScrollPosition(options: UseScrollOptions = {}) {
  const { throttle = 100, element } = options
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 })

  useEffect(() => {
    const target = element || (typeof window !== 'undefined' ? window : null)
    if (!target) return

    let timeoutId: ReturnType<typeof setTimeout>

    const handleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (target === window) {
          setPosition({
            x: window.scrollX,
            y: window.scrollY,
          })
        } else {
          const el = target as HTMLElement
          setPosition({
            x: el.scrollLeft,
            y: el.scrollTop,
          })
        }
      }, throttle)
    }

    target.addEventListener('scroll', handleScroll, { passive: true })
    
    // 初始设置
    handleScroll()

    return () => {
      target.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [element, throttle])

  return position
}

/**
 * 滚动状态钩子
 */
export function useScrollState(options: UseScrollOptions = {}) {
  const { throttle = 100, element } = options
  const [state, setState] = useState<ScrollState>({
    x: 0,
    y: 0,
    direction: null,
    isScrolling: false,
  })

  useEffect(() => {
    const target = element || (typeof window !== 'undefined' ? window : null)
    if (!target) return

    let timeoutId: ReturnType<typeof setTimeout>
    let prevX = 0
    let prevY = 0

    const handleScroll = () => {
      const currentX = target === window ? window.scrollX : (target as HTMLElement).scrollLeft
      const currentY = target === window ? window.scrollY : (target as HTMLElement).scrollTop

      let direction: ScrollState['direction'] = null
      
      if (currentY > prevY) {
        direction = 'down'
      } else if (currentY < prevY) {
        direction = 'up'
      } else if (currentX > prevX) {
        direction = 'right'
      } else if (currentX < prevX) {
        direction = 'left'
      }

      setState({
        x: currentX,
        y: currentY,
        direction,
        isScrolling: true,
      })

      prevX = currentX
      prevY = currentY

      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setState(prev => ({ ...prev, isScrolling: false }))
      }, throttle)
    }

    target.addEventListener('scroll', handleScroll, { passive: true })
    
    // 初始设置
    handleScroll()

    return () => {
      target.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [element, throttle])

  return state
}

/**
 * 滚动到元素
 */
export function useScrollTo() {
  const scrollTo = useCallback((options: {
    top?: number
    left?: number
    behavior?: ScrollBehavior
  }) => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: options.top || 0,
        left: options.left || 0,
        behavior: options.behavior || 'smooth',
      })
    }
  }, [])

  const scrollToElement = useCallback((
    element: HTMLElement | string,
    options: {
      behavior?: ScrollBehavior
      block?: ScrollLogicalPosition
      inline?: ScrollLogicalPosition
      offset?: number
    } = {}
  ) => {
    const target = typeof element === 'string' 
      ? document.querySelector(element) as HTMLElement
      : element

    if (target) {
      if (options.offset) {
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - options.offset
        window.scrollTo({
          top: targetPosition,
          behavior: options.behavior || 'smooth',
        })
      } else {
        target.scrollIntoView({
          behavior: options.behavior || 'smooth',
          block: options.block || 'start',
          inline: options.inline || 'nearest',
        })
      }
    }
  }, [])

  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    scrollTo({ top: 0, behavior })
  }, [scrollTo])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (typeof window !== 'undefined') {
      scrollTo({ 
        top: document.documentElement.scrollHeight, 
        behavior 
      })
    }
  }, [scrollTo])

  return {
    scrollTo,
    scrollToElement,
    scrollToTop,
    scrollToBottom,
  }
}

/**
 * 无限滚动钩子
 */
export function useInfiniteScroll(
  callback: () => void,
  options: {
    threshold?: number
    element?: HTMLElement | null
    hasMore?: boolean
  } = {}
) {
  const { threshold = 100, element, hasMore = true } = options

  useEffect(() => {
    if (!hasMore) return

    const target = element || (typeof window !== 'undefined' ? window : null)
    if (!target) return

    const handleScroll = () => {
      if (target === window) {
        const scrollHeight = document.documentElement.scrollHeight
        const scrollTop = window.scrollY
        const clientHeight = window.innerHeight

        if (scrollTop + clientHeight >= scrollHeight - threshold) {
          callback()
        }
      } else {
        const el = target as HTMLElement
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
          callback()
        }
      }
    }

    target.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      target.removeEventListener('scroll', handleScroll)
    }
  }, [callback, threshold, element, hasMore])
}

/**
 * 滚动方向检测
 */
export function useScrollDirection(threshold: number = 10) {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let lastScrollY = window.scrollY
    let ticking = false

    const updateScrollDirection = () => {
      const scrollY = window.scrollY

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false
        return
      }

      setDirection(scrollY > lastScrollY ? 'down' : 'up')
      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  return direction
}

/**
 * 元素是否在视口内
 */
export function useInView(
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) {
          setIsInView(entry.isIntersecting)
        }
      },
      {
        threshold: 0,
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [ref, options])

  return isInView
}