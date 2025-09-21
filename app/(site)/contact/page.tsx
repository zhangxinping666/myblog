'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, MapPin, Send, Clock, MessageSquare, Github, Twitter, Linkedin, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

// Client component, metadata should be in a separate file or parent server component
// export const metadata: Metadata = {
//   title: '联系我',
//   description: '通过邮件、社交媒体或联系表单与我取得联系',
// }

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage('')
    }
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage('请输入您的姓名')
      return false
    }
    if (!formData.email.trim()) {
      setErrorMessage('请输入邮箱地址')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('请输入有效的邮箱地址')
      return false
    }
    if (!formData.subject.trim()) {
      setErrorMessage('请输入邮件主题')
      return false
    }
    if (!formData.message.trim()) {
      setErrorMessage('请输入邮件内容')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setStatus('error')
      return
    }

    setStatus('sending')
    
    try {
      // 这里应该调用实际的邮件发送 API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('发送失败')
      }

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setStatus('error')
      setErrorMessage('发送失败，请稍后重试或直接通过邮箱联系我')
    }
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">联系我</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            有项目合作、技术交流或其他事宜？欢迎通过以下方式与我联系
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">发送消息</h2>
            <p className="text-muted-foreground">
              填写下面的表单，我会尽快回复您
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              {status === 'success' ? (
                <div className="text-center space-y-4 py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">消息发送成功！</h3>
                    <p className="text-muted-foreground">
                      感谢您的来信，我会在 24 小时内回复您
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setStatus('idle')}
                  >
                    发送新消息
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">姓名 *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={status === 'sending'}
                        placeholder="您的姓名"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱 *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={status === 'sending'}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">主题 *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      disabled={status === 'sending'}
                      placeholder="邮件主题"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">消息内容 *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      disabled={status === 'sending'}
                      placeholder="请描述您的需求或想要讨论的内容..."
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  {status === 'error' && errorMessage && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        发送中...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        发送消息
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    提交表单即表示您同意我处理您的个人信息用于回复目的
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">联系方式</h2>
            <p className="text-muted-foreground">
              也可以通过以下方式直接联系我
            </p>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mail className="h-5 w-5 text-blue-600" />
                  邮箱
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href="mailto:hello@example.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@example.com
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  工作日通常在 24 小时内回复
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-5 w-5 text-green-600" />
                  回复时间
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>工作日 (周一至周五)</span>
                  <Badge variant="secondary">24小时内</Badge>
                </div>
                <div className="flex justify-between">
                  <span>周末</span>
                  <Badge variant="outline">48小时内</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-5 w-5 text-red-600" />
                  位置
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">北京, 中国</p>
                <p className="text-xs text-muted-foreground mt-1">
                  UTC+8 时区
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">社交媒体</h3>
            <div className="grid grid-cols-1 gap-3">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Github className="h-5 w-5" />
                    <div>
                      <p className="font-medium">GitHub</p>
                      <p className="text-xs text-muted-foreground">查看我的开源项目</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                      访问
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Twitter className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Twitter</p>
                      <p className="text-xs text-muted-foreground">关注我的技术分享</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      关注
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5" />
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <p className="text-xs text-muted-foreground">职业网络连接</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                      连接
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Contact Guidelines */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">联系指南</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">项目合作</p>
                  <p>包含项目描述、预算范围和时间要求</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">技术咨询</p>
                  <p>详细描述遇到的技术问题和现有环境</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">演讲邀请</p>
                  <p>提供活动信息、主题要求和时间安排</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}