'use client'

import * as React from 'react'
import { Search as SearchIcon, X, Loader2 } from 'lucide-react'
import Fuse from 'fuse.js'

import { cn } from '@/lib/utils/cn'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

// 搜索结果项类型
interface SearchResultItem {
  id: string
  title: string
  description?: string
  content?: string
  url: string
  category?: string
  tags?: string[]
  date?: string
}

interface SearchProps {
  className?: string
  placeholder?: string
  data?: SearchResultItem[]
  onSelect?: (item: SearchResultItem) => void
}

interface SearchResultsProps {
  results: any[]
  query: string
  onSelect: (item: SearchResultItem) => void
  isLoading?: boolean
}

// 搜索配置
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'description', weight: 0.4 },
    { name: 'content', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'category', weight: 0.1 },
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
}

// 搜索结果组件
function SearchResults({ results, query, onSelect, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">搜索中...</span>
      </div>
    )
  }

  if (!query) {
    return (
      <div className="py-8 text-center">
        <SearchIcon className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          输入关键词开始搜索
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="py-8 text-center">
        <X className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          没有找到与 "{query}" 相关的内容
        </p>
        <p className="text-xs text-muted-foreground">
          尝试使用不同的关键词或检查拼写
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {results.map((result, index) => {
        const item = result.item
        const matches = result.matches || []
        
        return (
          <div
            key={`${item.id}-${index}`}
            className="cursor-pointer px-4 py-3 hover:bg-muted/50 transition-colors"
            onClick={() => onSelect(item)}
          >
            <div className="space-y-1">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-sm leading-snug">
                  {highlightMatch(item.title, matches, 'title')}
                </h3>
                {item.category && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded ml-2 shrink-0">
                    {item.category}
                  </span>
                )}
              </div>
              
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {highlightMatch(item.description, matches, 'description')}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {item.date && (
                  <span>{new Date(item.date).toLocaleDateString('zh-CN')}</span>
                )}
                {item.tags && item.tags.length > 0 && (
                  <>
                    {item.date && <span>•</span>}
                    <span>{item.tags.slice(0, 3).join(', ')}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// 高亮匹配文本
function highlightMatch(
  text: string, 
  matches: any[], 
  key: string
): React.ReactNode {
  const match = matches.find(m => m.key === key)
  if (!match || !match.indices) {
    return text
  }

  const indices = match.indices
  const result: React.ReactNode[] = []
  let lastIndex = 0

  indices.forEach(([start, end]: [number, number], i: number) => {
    // 添加匹配前的文本
    if (start > lastIndex) {
      result.push(text.slice(lastIndex, start))
    }
    
    // 添加高亮的匹配文本
    result.push(
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded">
        {text.slice(start, end + 1)}
      </mark>
    )
    
    lastIndex = end + 1
  })

  // 添加剩余文本
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex))
  }

  return result
}

// 主搜索组件
export function Search({ className, placeholder = "搜索文章...", data = [], onSelect }: SearchProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState<any[]>([])
  
  const debouncedQuery = useDebounce(query, 300)
  const fuse = React.useMemo(() => new Fuse(data, fuseOptions), [data])

  // 执行搜索
  React.useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    
    // 模拟异步搜索延迟
    const timer = setTimeout(() => {
      const searchResults = fuse.search(debouncedQuery)
      setResults(searchResults.slice(0, 10)) // 限制结果数量
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [debouncedQuery, fuse])

  // 处理选择结果
  const handleSelect = React.useCallback((item: SearchResultItem) => {
    setOpen(false)
    setQuery('')
    onSelect?.(item)
    
    // 跳转到结果页面
    if (item.url) {
      window.location.href = item.url
    }
  }, [onSelect])

  // 键盘快捷键
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
      
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64',
            className
          )}
        >
          <SearchIcon className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline-flex">{placeholder}</span>
          <span className="inline-flex lg:hidden">搜索...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="sr-only">搜索</DialogTitle>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="pl-10 border-0 shadow-none focus-visible:ring-0"
              autoFocus
            />
          </div>
        </DialogHeader>
        
        <Separator />
        
        <div className="max-h-[400px] overflow-y-auto">
          <SearchResults
            results={results}
            query={debouncedQuery}
            onSelect={handleSelect}
            isLoading={isLoading}
          />
        </div>
        
        {debouncedQuery && results.length > 0 && (
          <>
            <Separator />
            <div className="px-4 py-2 text-xs text-muted-foreground">
              找到 {results.length} 个结果，按 Enter 键访问第一个结果
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// 简化版内联搜索组件
export function InlineSearch({ className, placeholder = "搜索...", data = [], onSelect }: SearchProps) {
  const [query, setQuery] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)
  const [results, setResults] = React.useState<any[]>([])
  
  const debouncedQuery = useDebounce(query, 300)
  const fuse = React.useMemo(() => new Fuse(data, fuseOptions), [data])

  React.useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    const searchResults = fuse.search(debouncedQuery)
    setResults(searchResults.slice(0, 5))
  }, [debouncedQuery, fuse])

  const handleSelect = (item: SearchResultItem) => {
    setQuery('')
    setIsFocused(false)
    onSelect?.(item)
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>
      
      {isFocused && query && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg">
          {results.length > 0 ? (
            <div className="divide-y max-h-60 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={`${result.item.id}-${index}`}
                  className="cursor-pointer px-3 py-2 hover:bg-muted/50 transition-colors"
                  onClick={() => handleSelect(result.item)}
                >
                  <div className="font-medium text-sm">{result.item.title}</div>
                  {result.item.description && (
                    <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      {result.item.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              没有找到相关结果
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export type { SearchResultItem }