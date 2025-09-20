'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

/**
 * 防抖钩子
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * 防抖回调钩子
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps?: React.DependencyList
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    deps ? [callback, delay, ...deps] : [callback, delay]
  ) as T

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  return debouncedCallback
}

/**
 * 节流钩子
 */
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastExecTime = useRef<number>(0)

  useEffect(() => {
    const now = Date.now()
    
    if (now - lastExecTime.current >= delay) {
      setThrottledValue(value)
      lastExecTime.current = now
      return
    }
    
    const timeoutId = setTimeout(() => {
      setThrottledValue(value)
      lastExecTime.current = Date.now()
    }, delay - (now - lastExecTime.current))

    return () => {
      clearTimeout(timeoutId)
    }
  }, [value, delay])

  return throttledValue
}

/**
 * 节流回调钩子
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps?: React.DependencyList
): T {
  const lastExecTime = useRef<number>(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      
      if (now - lastExecTime.current >= delay) {
        callback(...args)
        lastExecTime.current = now
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        timeoutRef.current = setTimeout(() => {
          callback(...args)
          lastExecTime.current = Date.now()
        }, delay - (now - lastExecTime.current))
      }
    },
    deps ? [callback, delay, ...deps] : [callback, delay]
  ) as T

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return throttledCallback
}

/**
 * 防抖状态钩子
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number
): [T, T, React.Dispatch<React.SetStateAction<T>>] {
  const [immediateValue, setImmediateValue] = useState<T>(initialValue)
  const debouncedValue = useDebounce(immediateValue, delay)

  return [immediateValue, debouncedValue, setImmediateValue]
}

/**
 * 节流状态钩子
 */
export function useThrottledState<T>(
  initialValue: T,
  delay: number
): [T, T, React.Dispatch<React.SetStateAction<T>>] {
  const [immediateValue, setImmediateValue] = useState<T>(initialValue)
  const throttledValue = useThrottle(immediateValue, delay)

  return [immediateValue, throttledValue, setImmediateValue]
}

/**
 * 防抖搜索钩子
 */
export function useDebouncedSearch(
  searchFunction: (query: string) => Promise<any>,
  delay: number = 300
) {
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const debouncedQuery = useDebounce(query, delay)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null)
      setError(null)
      return
    }

    let isCancelled = false
    setIsLoading(true)
    setError(null)

    searchFunction(debouncedQuery)
      .then(data => {
        if (!isCancelled) {
          setResults(data)
          setIsLoading(false)
        }
      })
      .catch(err => {
        if (!isCancelled) {
          setError(err)
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [debouncedQuery, searchFunction])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults(null)
    setError(null)
  }, [])

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    clearSearch,
  }
}

/**
 * 防抖效果钩子
 */
export function useDebouncedEffect(
  effect: React.EffectCallback,
  delay: number,
  deps?: React.DependencyList
) {
  const callback = useCallback(effect, deps || [])

  const debouncedCallback = useDebouncedCallback(callback, delay)

  useEffect(() => {
    debouncedCallback()
  }, [debouncedCallback])
}

/**
 * 节流效果钩子
 */
export function useThrottledEffect(
  effect: React.EffectCallback,
  delay: number,
  deps?: React.DependencyList
) {
  const callback = useCallback(effect, deps || [])

  const throttledCallback = useThrottledCallback(callback, delay)

  useEffect(() => {
    throttledCallback()
  }, [throttledCallback])
}

/**
 * 防抖异步钩子
 */
export function useDebouncedAsync<T extends (...args: any[]) => Promise<any>>(
  asyncFunction: T,
  delay: number
): [T, boolean, Error | null] {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelRef = useRef<(() => void) | null>(null)

  const debouncedFunction = useCallback(
    ((...args: Parameters<T>) => {
      return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
        // 取消之前的请求
        if (cancelRef.current) {
          cancelRef.current()
        }

        // 清除之前的定时器
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        let isCancelled = false
        cancelRef.current = () => {
          isCancelled = true
          setIsLoading(false)
        }

        timeoutRef.current = setTimeout(async () => {
          if (isCancelled) return

          setIsLoading(true)
          setError(null)

          try {
            const result = await asyncFunction(...args)
            if (!isCancelled) {
              setIsLoading(false)
              resolve(result)
            }
          } catch (err) {
            if (!isCancelled) {
              const error = err instanceof Error ? err : new Error(String(err))
              setError(error)
              setIsLoading(false)
              reject(error)
            }
          }
        }, delay)
      })
    }) as T,
    [asyncFunction, delay]
  )

  // 清理定时器和取消请求
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (cancelRef.current) {
        cancelRef.current()
      }
    }
  }, [])

  return [debouncedFunction, isLoading, error]
}

/**
 * 防抖输入钩子
 */
export function useDebouncedInput(
  initialValue: string = '',
  delay: number = 300
) {
  const [inputValue, setInputValue] = useState(initialValue)
  const [debouncedValue, setDebouncedValue] = useState(initialValue)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
  }, [delay])

  // 立即更新防抖值（例如，清空输入时）
  const setImmediateValue = useCallback((value: string) => {
    setInputValue(value)
    setDebouncedValue(value)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    inputValue,
    debouncedValue,
    handleInputChange,
    setImmediateValue,
  }
}