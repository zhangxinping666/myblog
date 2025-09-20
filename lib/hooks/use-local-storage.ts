'use client'

import { useEffect, useState, useCallback } from 'react'

/**
 * 本地存储钩子
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // 获取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // 设置值到localStorage和state
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // 允许传入函数来更新state
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // 移除值
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * 会话存储钩子
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // 获取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  })

  // 设置值到sessionStorage和state
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // 允许传入函数来更新state
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // 移除值
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * 存储变化监听钩子
 */
export function useStorageListener(
  key: string,
  callback: (newValue: string | null, oldValue: string | null) => void,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage'
) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === window[storageType]) {
        callback(event.newValue, event.oldValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key, callback, storageType])
}

/**
 * 存储容量检测钩子
 */
export function useStorageQuota() {
  const [quota, setQuota] = useState<{
    used: number
    total: number
    available: number
    percentage: number
  } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('storage' in navigator)) {
      return
    }

    navigator.storage.estimate().then(estimate => {
      const used = estimate.usage || 0
      const total = estimate.quota || 0
      const available = total - used
      const percentage = total > 0 ? (used / total) * 100 : 0

      setQuota({
        used,
        total,
        available,
        percentage,
      })
    }).catch(error => {
      console.warn('Error getting storage quota:', error)
    })
  }, [])

  return quota
}

/**
 * 批量本地存储钩子
 */
export function useBatchLocalStorage<T extends Record<string, any>>(
  keys: (keyof T)[],
  initialValues: T
) {
  const [values, setValues] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValues
    }

    const result = { ...initialValues }
    
    keys.forEach(key => {
      try {
        const item = window.localStorage.getItem(String(key))
        if (item) {
          result[key] = JSON.parse(item)
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${String(key)}":`, error)
      }
    })

    return result
  })

  const setValues_ = useCallback((newValues: Partial<T>) => {
    setValues(prev => {
      const updated = { ...prev, ...newValues }
      
      // 更新localStorage
      if (typeof window !== 'undefined') {
        Object.entries(newValues).forEach(([key, value]) => {
          try {
            window.localStorage.setItem(key, JSON.stringify(value))
          } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error)
          }
        })
      }
      
      return updated
    })
  }, [])

  const removeValues = useCallback((keysToRemove: (keyof T)[]) => {
    setValues(prev => {
      const updated = { ...prev }
      
      keysToRemove.forEach(key => {
        updated[key] = initialValues[key]
        
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.removeItem(String(key))
          } catch (error) {
            console.warn(`Error removing localStorage key "${String(key)}":`, error)
          }
        }
      })
      
      return updated
    })
  }, [initialValues])

  const clearAll = useCallback(() => {
    setValues(initialValues)
    
    if (typeof window !== 'undefined') {
      keys.forEach(key => {
        try {
          window.localStorage.removeItem(String(key))
        } catch (error) {
          console.warn(`Error removing localStorage key "${String(key)}":`, error)
        }
      })
    }
  }, [keys, initialValues])

  return {
    values,
    setValues: setValues_,
    removeValues,
    clearAll,
  }
}

/**
 * 存储同步钩子（在多个标签页间同步数据）
 */
export function useStorageSync<T>(
  key: string,
  initialValue: T,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage'
) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window[storageType].getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading ${storageType} key "${key}":`, error)
      return initialValue
    }
  })

  // 设置值并触发跨标签页同步
  const setSyncedValue = useCallback((newValue: T | ((prev: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue
      
      setValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window[storageType].setItem(key, JSON.stringify(valueToStore))
        
        // 手动触发storage事件以便在同一页面的其他组件中同步
        window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: JSON.stringify(valueToStore),
          oldValue: window[storageType].getItem(key),
          storageArea: window[storageType],
        }))
      }
    } catch (error) {
      console.warn(`Error setting ${storageType} key "${key}":`, error)
    }
  }, [key, value, storageType])

  // 监听跨标签页的存储变化
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === window[storageType]) {
        try {
          const newValue = event.newValue ? JSON.parse(event.newValue) : initialValue
          setValue(newValue)
        } catch (error) {
          console.warn(`Error parsing ${storageType} value for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key, initialValue, storageType])

  return [value, setSyncedValue] as const
}

/**
 * 存储可用性检测钩子
 */
export function useStorageAvailable() {
  const [isLocalStorageAvailable, setIsLocalStorageAvailable] = useState(false)
  const [isSessionStorageAvailable, setIsSessionStorageAvailable] = useState(false)

  useEffect(() => {
    // 检测localStorage
    try {
      const testKey = '__storage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      setIsLocalStorageAvailable(true)
    } catch {
      setIsLocalStorageAvailable(false)
    }

    // 检测sessionStorage
    try {
      const testKey = '__storage_test__'
      sessionStorage.setItem(testKey, 'test')
      sessionStorage.removeItem(testKey)
      setIsSessionStorageAvailable(true)
    } catch {
      setIsSessionStorageAvailable(false)
    }
  }, [])

  return {
    isLocalStorageAvailable,
    isSessionStorageAvailable,
  }
}