'use client'

import * as React from 'react'
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Copy, 
  Check,
  MessageCircle,
  Mail,
  QrCode
} from 'lucide-react'

import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

interface ShareData {
  title: string
  url: string
  description?: string | undefined
  hashtags?: string[]
}

interface ShareProps {
  data: ShareData
  className?: string | undefined
  variant?: 'dropdown' | 'buttons' | 'minimal'
  size?: 'sm' | 'lg'
}

interface ShareButtonProps {
  platform: string
  icon: React.ReactNode
  label: string
  url: string
  className?: string
  onClick?: () => void
}

// 分享平台配置
const SHARE_PLATFORMS = {
  twitter: {
    name: 'Twitter',
    icon: <Twitter className="h-4 w-4" />,
    getUrl: (data: ShareData) => {
      const params = new URLSearchParams({
        text: data.title,
        url: data.url,
        ...(data.hashtags && { hashtags: data.hashtags.join(',') })
      })
      return `https://twitter.com/intent/tweet?${params}`
    }
  },
  facebook: {
    name: 'Facebook',
    icon: <Facebook className="h-4 w-4" />,
    getUrl: (data: ShareData) => {
      const params = new URLSearchParams({
        u: data.url,
        quote: data.title
      })
      return `https://www.facebook.com/sharer/sharer.php?${params}`
    }
  },
  linkedin: {
    name: 'LinkedIn',
    icon: <Linkedin className="h-4 w-4" />,
    getUrl: (data: ShareData) => {
      const params = new URLSearchParams({
        url: data.url,
        title: data.title,
        summary: data.description || '',
      })
      return `https://www.linkedin.com/sharing/share-offsite/?${params}`
    }
  },
  weibo: {
    name: '微博',
    icon: <MessageCircle className="h-4 w-4" />,
    getUrl: (data: ShareData) => {
      const params = new URLSearchParams({
        title: `${data.title} ${data.url}`,
        url: data.url,
      })
      return `https://service.weibo.com/share/share.php?${params}`
    }
  },
  wechat: {
    name: '微信',
    icon: <MessageCircle className="h-4 w-4" />,
    getUrl: (data: ShareData) => {
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.url)}`
    }
  },
  email: {
    name: '邮件',
    icon: <Mail className="h-4 w-4" />,
    getUrl: (data: ShareData) => {
      const params = new URLSearchParams({
        subject: data.title,
        body: `${data.description || data.title}\n\n${data.url}`
      })
      return `mailto:?${params}`
    }
  }
}

// 单个分享按钮组件
function ShareButton({ platform, icon, label, url, className, onClick }: ShareButtonProps) {
  const handleClick = () => {
    onClick?.()
    
    // 对于邮件，直接打开
    if (platform === 'email') {
      window.location.href = url
      return
    }
    
    // 对于其他平台，在新窗口打开
    window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn('flex items-center gap-2', className)}
            onClick={handleClick}
          >
            {icon}
            <span className="sr-only md:not-sr-only">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>分享到{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// 复制链接组件
function CopyLinkButton({ url, className }: { url: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn('flex items-center gap-2', className)}
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only md:not-sr-only">
              {copied ? '已复制' : '复制链接'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? '链接已复制到剪贴板' : '复制链接'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// 使用原生分享API
function NativeShareButton({ data, className }: { data: ShareData; className?: string }) {
  const [isSupported, setIsSupported] = React.useState(false)

  React.useEffect(() => {
    setIsSupported(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  const handleNativeShare = async () => {
    if (!isSupported) return

    try {
      await navigator.share({
        title: data.title,
        url: data.url,
        text: data.description || '',
      })
    } catch (err) {
      // 用户取消分享或其他错误
      console.log('分享取消或失败:', err)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn('flex items-center gap-2', className)}
      onClick={handleNativeShare}
    >
      <Share2 className="h-4 w-4" />
      <span className="sr-only md:not-sr-only">分享</span>
    </Button>
  )
}

// 二维码分享对话框
function QRCodeDialog({ data }: { data: ShareData }) {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.url)}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          <span className="sr-only md:not-sr-only">二维码</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>扫码分享</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <img
            src={qrCodeUrl}
            alt="分享二维码"
            className="border rounded-lg"
            width={200}
            height={200}
          />
          <p className="text-sm text-muted-foreground text-center">
            扫描二维码分享此内容
          </p>
          
          <div className="w-full space-y-2">
            <Label htmlFor="share-url">链接地址</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={data.url}
                readOnly
                className="flex-1"
              />
              <CopyLinkButton url={data.url} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 主分享组件
export function Share({ data, className, variant = 'dropdown', size = 'sm' }: ShareProps) {
  const platforms = Object.entries(SHARE_PLATFORMS)

  // 下拉菜单模式
  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size={size}
            className={cn('flex items-center gap-2', className)}
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only md:not-sr-only">分享</span>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-48">
          <NativeShareButton data={data} className="w-full justify-start" />
          <DropdownMenuSeparator />
          
          {platforms.map(([key, platform]) => (
            <DropdownMenuItem key={key} asChild>
              <a
                href={platform.getUrl(data)}
                target={key === 'email' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full"
              >
                {platform.icon}
                {platform.name}
              </a>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <CopyLinkButton url={data.url} className="w-full justify-start" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // 按钮组模式
  if (variant === 'buttons') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        <NativeShareButton data={data} />
        
        {platforms.slice(0, 4).map(([key, platform]) => (
          <ShareButton
            key={key}
            platform={key}
            icon={platform.icon}
            label={platform.name}
            url={platform.getUrl(data)}
          />
        ))}
        
        <CopyLinkButton url={data.url} />
        <QRCodeDialog data={data} />
      </div>
    )
  }

  // 最小化模式
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <NativeShareButton data={data} />
      <CopyLinkButton url={data.url} />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end">
          {platforms.map(([key, platform]) => (
            <DropdownMenuItem key={key} asChild>
              <a
                href={platform.getUrl(data)}
                target={key === 'email' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                {platform.icon}
                {platform.name}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// 文章分享组件
export function ArticleShare({ 
  title, 
  url, 
  description, 
  className 
}: { 
  title: string
  url?: string
  description?: string
  className?: string 
}) {
  const shareData: ShareData = {
    title,
    url: url || (typeof window !== 'undefined' ? window.location.href : ''),
    description: description,
    hashtags: ['博客', '文章']
  }

  return (
    <div className={cn('border rounded-lg p-4 bg-muted/30', className)}>
      <h4 className="font-semibold text-sm mb-3">分享这篇文章</h4>
      <Share data={shareData} variant="buttons" />
    </div>
  )
}

// 简单分享按钮
export function SimpleShare({ 
  title, 
  url, 
  className 
}: { 
  title: string
  url?: string
  className?: string | undefined
}) {
  const shareData: ShareData = {
    title,
    url: url || (typeof window !== 'undefined' ? window.location.href : ''),
  }

  return (
    <Share 
      data={shareData} 
      variant="minimal" 
      className={className || undefined} 
    />
  )
}

// 社交分享统计Hook
export function useShareTracking() {
  const trackShare = React.useCallback((platform: string, url: string) => {
    // 这里可以集成分析工具，如 Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: platform,
        content_type: 'article',
        item_id: url,
      })
    }
    
    // 也可以发送到自己的分析API
    console.log(`分享到 ${platform}: ${url}`)
  }, [])

  return { trackShare }
}

export type { ShareData }