'use client'

import * as React from 'react'
import { Mail, Send, Check, AlertCircle, Loader2, Gift, Star } from 'lucide-react'

import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface NewsletterData {
  email: string
  name?: string
  interests?: string[]
  frequency?: 'weekly' | 'biweekly' | 'monthly'
}

interface NewsletterProps {
  className?: string | undefined
  variant?: 'inline' | 'card' | 'modal' | 'minimal'
  title?: string | undefined
  description?: string | undefined
  onSubscribe?: (data: NewsletterData) => Promise<void>
}

// 订阅状态枚举
type SubscriptionStatus = 'idle' | 'loading' | 'success' | 'error'

// 邮件验证函数
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 简单的内联订阅组件
export function SimpleNewsletter({ className, onSubscribe }: NewsletterProps) {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<SubscriptionStatus>('idle')
  const [message, setMessage] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setMessage('请输入邮箱地址')
      setStatus('error')
      return
    }

    if (!isValidEmail(email)) {
      setMessage('请输入有效的邮箱地址')
      setStatus('error')
      return
    }

    setStatus('loading')
    
    try {
      await onSubscribe?.({ email })
      setStatus('success')
      setMessage('订阅成功！请查收确认邮件')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage('订阅失败，请稍后重试')
    }
  }

  if (status === 'success') {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-green-600', className)}>
        <Check className="h-4 w-4" />
        <span>{message}</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <div className="flex-1">
        <Input
          type="email"
          placeholder="输入邮箱地址"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          className={status === 'error' ? 'border-red-500' : ''}
        />
        {status === 'error' && message && (
          <p className="text-xs text-red-600 mt-1">{message}</p>
        )}
      </div>
      <Button 
        type="submit" 
        disabled={status === 'loading'}
        size="sm"
      >
        {status === 'loading' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="sr-only md:not-sr-only ml-2">订阅</span>
      </Button>
    </form>
  )
}

// 卡片式订阅组件
export function NewsletterCard({ 
  className, 
  title = "订阅我的博客", 
  description = "获取最新文章和技术分享",
  onSubscribe 
}: NewsletterProps) {
  const [formData, setFormData] = React.useState<NewsletterData>({
    email: '',
    name: '',
    frequency: 'weekly'
  })
  const [status, setStatus] = React.useState<SubscriptionStatus>('idle')
  const [message, setMessage] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email.trim()) {
      setMessage('请输入邮箱地址')
      setStatus('error')
      return
    }

    if (!isValidEmail(formData.email)) {
      setMessage('请输入有效的邮箱地址')
      setStatus('error')
      return
    }

    setStatus('loading')
    
    try {
      await onSubscribe?.(formData)
      setStatus('success')
      setMessage('订阅成功！请查收确认邮件')
      setFormData({ email: '', name: '', frequency: 'weekly' })
    } catch (error) {
      setStatus('error')
      setMessage('订阅失败，请稍后重试')
    }
  }

  const updateFormData = (field: keyof NewsletterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (status === 'error') {
      setStatus('idle')
      setMessage('')
    }
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {status === 'success' ? (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-green-600 font-medium">{message}</p>
            <p className="text-xs text-muted-foreground">
              感谢您的订阅！我们会定期为您推送优质内容
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newsletter-email">邮箱地址 *</Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                disabled={status === 'loading'}
                className={status === 'error' ? 'border-red-500' : ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newsletter-name">姓名（可选）</Label>
              <Input
                id="newsletter-name"
                type="text"
                placeholder="您的姓名"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                disabled={status === 'loading'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newsletter-frequency">订阅频率</Label>
              <select
                title='订阅'
                id="newsletter-frequency"
                value={formData.frequency}
                onChange={(e) => updateFormData('frequency', e.target.value)}
                disabled={status === 'loading'}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="weekly">每周更新</option>
                <option value="biweekly">双周更新</option>
                <option value="monthly">每月更新</option>
              </select>
            </div>
            
            {status === 'error' && message && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{message}</span>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  订阅中...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  立即订阅
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              我们尊重您的隐私，您可以随时取消订阅
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

// 模态框订阅组件
export function NewsletterModal({ 
  className,
  title = "不要错过精彩内容！",
  description = "订阅我们的邮件列表，获取最新文章和独家内容",
  onSubscribe,
  children
}: NewsletterProps & { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<SubscriptionStatus>('idle')
  const [message, setMessage] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !isValidEmail(email)) {
      setMessage('请输入有效的邮箱地址')
      setStatus('error')
      return
    }

    setStatus('loading')
    
    try {
      await onSubscribe?.({ email })
      setStatus('success')
      setMessage('订阅成功！')
      setEmail('')
      setTimeout(() => setOpen(false), 2000)
    } catch (error) {
      setStatus('error')
      setMessage('订阅失败，请稍后重试')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className={className}>
            <Mail className="h-4 w-4 mr-2" />
            订阅更新
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-4">
            <Gift className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        {status === 'success' ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-green-600 font-medium text-lg">{message}</p>
              <p className="text-sm text-muted-foreground mt-2">
                请查收确认邮件以完成订阅
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">订阅福利</p>
                <p className="text-xs">独家内容 · 技术干货 · 第一时间更新</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modal-email">邮箱地址</Label>
                <Input
                  id="modal-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className={status === 'error' ? 'border-red-500' : ''}
                />
              </div>
              
              {status === 'error' && message && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{message}</span>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    订阅中...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    立即订阅
                  </>
                )}
              </Button>
            </form>
            
            <Separator />
            
            <p className="text-xs text-muted-foreground text-center">
              我们承诺不会向第三方分享您的邮箱地址，您可以随时取消订阅
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// 页脚订阅组件
export function FooterNewsletter({ 
  className, 
  title = "订阅我们的邮件列表",
  description = "获取最新文章和技术资讯，直达您的收件箱",
  onSubscribe 
}: NewsletterProps) {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<SubscriptionStatus>('idle')
  const [message, setMessage] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !isValidEmail(email)) {
      setMessage('请输入有效的邮箱地址')
      setStatus('error')
      return
    }

    setStatus('loading')
    
    try {
      await onSubscribe?.({ email })
      setStatus('success')
      setMessage('订阅成功！请查收确认邮件')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage('订阅失败，请稍后重试')
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      {status === 'success' ? (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="h-4 w-4" />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="输入邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className={cn(
                'flex-1',
                status === 'error' && 'border-red-500'
              )}
            />
            <Button 
              type="submit" 
              disabled={status === 'loading'}
              size="sm"
            >
              {status === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                '订阅'
              )}
            </Button>
          </div>
          
          {status === 'error' && message && (
            <p className="text-xs text-red-600">{message}</p>
          )}
          
          <p className="text-xs text-muted-foreground">
            我们尊重您的隐私。随时可以取消订阅。
          </p>
        </form>
      )}
    </div>
  )
}

// 主订阅组件
export function Newsletter({ 
  variant = 'inline', 
  className,
  title,
  description,
  onSubscribe 
}: NewsletterProps) {
  // 默认订阅处理函数
  const defaultOnSubscribe = async (data: NewsletterData) => {
    // 这里应该调用实际的API
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('订阅失败')
    }
    
    return response.json()
  }

  const subscribeHandler = onSubscribe || defaultOnSubscribe

  switch (variant) {
    case 'card':
      return (
        <NewsletterCard
          className={className}
          title={title}
          description={description}
          onSubscribe={subscribeHandler}
        />
      )
    case 'modal':
      return (
        <NewsletterModal
          className={className}
          title={title}
          description={description}
          onSubscribe={subscribeHandler}
        />
      )
    case 'minimal':
      return (
        <FooterNewsletter
          className={className}
          title={title}
          description={description}
          onSubscribe={subscribeHandler}
        />
      )
    default:
      return (
        <SimpleNewsletter
          className={className}
          onSubscribe={subscribeHandler}
        />
      )
  }
}

// 订阅统计Hook
export function useNewsletterTracking() {
  const trackSubscription = React.useCallback((email: string, source: string) => {
    // 这里可以集成分析工具
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'newsletter_signup', {
        email_address: email,
        source: source,
      })
    }
    
    console.log(`邮件订阅: ${email} from ${source}`)
  }, [])

  return { trackSubscription }
}

export type { NewsletterData }