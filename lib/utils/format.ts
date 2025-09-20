/**
 * 数据格式化工具函数
 */

/**
 * 格式化日期
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  return new Intl.DateTimeFormat('zh-CN', { ...defaultOptions, ...options }).format(dateObj)
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return '刚刚'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}小时前`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays}天前`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`
  }
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears}年前`
}

/**
 * 格式化数字
 */
export function formatNumber(
  num: number,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat('zh-CN', options).format(num)
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

/**
 * 格式化阅读时间
 */
export function formatReadingTime(wordCount: number): string {
  const wordsPerMinute = 200 // 中文阅读速度约200字/分钟
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes}分钟阅读`
}

/**
 * 格式化URL
 */
export function formatUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.toString()
  } catch {
    return url.startsWith('http') ? url : `https://${url}`
  }
}

/**
 * 格式化货币
 */
export function formatCurrency(
  amount: number,
  currency: string = 'CNY'
): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * 格式化百分比
 */
export function formatPercentage(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }
  
  return new Intl.NumberFormat('zh-CN', { ...defaultOptions, ...options }).format(value)
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * 高亮搜索关键词
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) {
    return text
  }
  
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}