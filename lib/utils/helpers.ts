/**
 * 通用辅助函数
 */

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 深拷贝
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
  
  return obj
}

/**
 * 生成随机ID
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 检查是否为空值
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true
  }
  
  if (typeof value === 'string') {
    return value.trim().length === 0
  }
  
  if (Array.isArray(value)) {
    return value.length === 0
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }
  
  return false
}

/**
 * 获取嵌套对象属性
 */
export function getNestedValue<T>(
  obj: Record<string, any>,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split('.')
  let current = obj
  
  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return defaultValue
    }
    current = current[key]
  }
  
  return current as T
}

/**
 * 设置嵌套对象属性
 */
export function setNestedValue(
  obj: Record<string, any>,
  path: string,
  value: any
): void {
  const keys = path.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!key) continue
    
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }
  
  const lastKey = keys[keys.length - 1]
  if (lastKey) {
    current[lastKey] = value
  }
}

/**
 * 数组去重
 */
export function unique<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return Array.from(new Set(array))
  }
  
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

/**
 * 数组分组
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key])
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * 数组排序
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]
    
    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  })
}

/**
 * 数组分页
 */
export function paginate<T>(
  array: T[],
  page: number,
  pageSize: number
): {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
} {
  const total = array.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = array.slice(start, end)
  
  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  }
}

/**
 * 合并对象
 */
export function mergeObjects<T extends Record<string, any>>(
  target: T,
  ...sources: Array<Partial<T>>
): T {
  const result = { ...target }
  
  for (const source of sources) {
    if (!source) continue
    
    for (const key in source) {
      const sourceValue = source[key]
      if (sourceValue !== undefined) {
        if (
          typeof sourceValue === 'object' &&
          sourceValue !== null &&
          !Array.isArray(sourceValue) &&
          typeof result[key] === 'object' &&
          result[key] !== null &&
          !Array.isArray(result[key])
        ) {
          result[key] = mergeObjects(
            result[key] as Record<string, any>, 
            sourceValue as Record<string, any>
          ) as T[Extract<keyof T, string>]
        } else {
          result[key] = sourceValue as T[Extract<keyof T, string>]
        }
      }
    }
  }
  
  return result
}

/**
 * 转换为URL友好的slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fa5]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * 检查是否为移动设备
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false
  }
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        return successful
      } catch {
        document.body.removeChild(textArea)
        return false
      }
    }
  } catch {
    return false
  }
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }) as T
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let lastExecTime = 0
  
  return ((...args: Parameters<T>) => {
    const currentTime = Date.now()
    
    if (currentTime - lastExecTime >= delay) {
      lastExecTime = currentTime
      return func(...args)
    }
  }) as T
}