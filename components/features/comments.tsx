'use client'

import * as React from 'react'
import { 
  MessageCircle, 
  Reply, 
  Heart, 
  Flag, 
  Edit, 
  Trash2, 
  Send,
  MoreHorizontal,
  User,
  Calendar,
  Loader2
} from 'lucide-react'

import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'

// 评论数据类型
export interface Comment {
  id: string
  content: string
  author: {
    name: string
    avatar?: string
    email?: string
    website?: string
  }
  createdAt: string
  updatedAt?: string
  likes: number
  isLiked?: boolean
  replies?: Comment[]
  parentId?: string
  isEditing?: boolean
  isDeleted?: boolean
}

interface CommentFormData {
  content: string
  author: {
    name: string
    email: string
    website?: string
  }
}

interface CommentsProps {
  comments: Comment[]
  className?: string
  allowReplies?: boolean
  allowEditing?: boolean
  allowReporting?: boolean
  requireAuth?: boolean
  onSubmit?: (data: CommentFormData, parentId?: string) => Promise<void>
  onEdit?: (commentId: string, content: string) => Promise<void>
  onDelete?: (commentId: string) => Promise<void>
  onLike?: (commentId: string) => Promise<void>
  onReport?: (commentId: string, reason: string) => Promise<void>
}

interface CommentItemProps {
  comment: Comment
  level?: number
  allowReplies?: boolean
  allowEditing?: boolean
  allowReporting?: boolean
  onReply?: ((parentId: string) => void | undefined) | undefined
  onEdit?: ((commentId: string, content: string) => Promise<void>) | undefined
  onDelete?: ((commentId: string) => Promise<void>) | undefined
  onLike?: ((commentId: string) => Promise<void>) | undefined
  onReport?: ((commentId: string, reason: string) => Promise<void>) | undefined
}

// 评论表单组件
function CommentForm({ 
  onSubmit, 
  placeholder = "写下你的评论...",
  submitText = "发表评论",
  parentId,
  onCancel,
  className 
}: {
  onSubmit?: ((data: CommentFormData, parentId?: string) => Promise<void>) | undefined
  placeholder?: string
  submitText?: string
  parentId?: string
  onCancel?: (() => void) | undefined
  className?: string
}) {
  const [formData, setFormData] = React.useState<CommentFormData>({
    content: '',
    author: {
      name: '',
      email: '',
      website: ''
    }
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showAuthorFields, setShowAuthorFields] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.content.trim()) return
    if (!formData.author.name.trim() || !formData.author.email.trim()) {
      setShowAuthorFields(true)
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit?.(formData, parentId)
      setFormData({
        content: '',
        author: { name: '', email: '', website: '' }
      })
      setShowAuthorFields(false)
      onCancel?.()
    } catch (error) {
      console.error('提交评论失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={cn('', className)}>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder={placeholder}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              disabled={isSubmitting}
              rows={3}
              className="resize-none"
            />
          </div>
          
          {showAuthorFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="comment-name">姓名 *</Label>
                <Input
                  id="comment-name"
                  value={formData.author.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    author: { ...prev.author, name: e.target.value }
                  }))}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div>
                <Label htmlFor="comment-email">邮箱 *</Label>
                <Input
                  id="comment-email"
                  type="email"
                  value={formData.author.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    author: { ...prev.author, email: e.target.value }
                  }))}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="comment-website">网站（可选）</Label>
                <Input
                  id="comment-website"
                  type="url"
                  value={formData.author.website}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    author: { ...prev.author, website: e.target.value }
                  }))}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!showAuthorFields && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAuthorFields(true)}
                >
                  <User className="h-4 w-4 mr-2" />
                  添加姓名和邮箱
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  取消
                </Button>
              )}
              <Button
                type="submit"
                size="sm"
                disabled={!formData.content.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    发表中...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {submitText}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// 举报对话框
function ReportDialog({ 
  commentId, 
  onReport 
}: { 
  commentId: string
  onReport: (commentId: string, reason: string) => Promise<void>
}) {
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async () => {
    if (!reason.trim()) return

    setIsSubmitting(true)
    try {
      await onReport(commentId, reason)
      setOpen(false)
      setReason('')
    } catch (error) {
      console.error('举报失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground"
      >
        <Flag className="h-4 w-4" />
      </Button>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>举报评论</DialogTitle>
          <DialogDescription>
            请告诉我们这条评论存在什么问题
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="report-reason">举报原因</Label>
            <Textarea
              id="report-reason"
              placeholder="请描述举报原因..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!reason.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  提交中...
                </>
              ) : (
                '提交举报'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 单条评论组件
function CommentItem({ 
  comment, 
  level = 0, 
  allowReplies = true,
  allowEditing = true,
  allowReporting = true,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onReport
}: CommentItemProps) {
  const [isReplying, setIsReplying] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editContent, setEditContent] = React.useState(comment.content)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleEdit = async () => {
    if (editContent.trim() === comment.content) {
      setIsEditing(false)
      return
    }

    try {
      await onEdit?.(comment.id, editContent.trim())
      setIsEditing(false)
    } catch (error) {
      console.error('编辑失败:', error)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete?.(comment.id)
    } catch (error) {
      console.error('删除失败:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLike = async () => {
    try {
      await onLike?.(comment.id)
    } catch (error) {
      console.error('点赞失败:', error)
    }
  }

  if (comment.isDeleted) {
    return (
      <div className={cn('py-4', level > 0 && 'ml-6 border-l pl-4')}>
        <div className="text-sm text-muted-foreground italic">
          此评论已被删除
        </div>
      </div>
    )
  }

  return (
    <div className={cn('py-4', level > 0 && 'ml-6 border-l pl-4')}>
      <div className="space-y-3">
        {/* 评论头部 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              {comment.author.avatar ? (
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <User className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {comment.author.website ? (
                  <a
                    href={comment.author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-sm hover:text-primary"
                  >
                    {comment.author.name}
                  </a>
                ) : (
                  <span className="font-medium text-sm">{comment.author.name}</span>
                )}
                {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                  <span className="text-xs text-muted-foreground">(已编辑)</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(comment.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {/* 操作菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {allowEditing && (
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  编辑
                </DropdownMenuItem>
              )}
              {allowEditing && (
                <DropdownMenuItem 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除
                </DropdownMenuItem>
              )}
              {allowReporting && onReport && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <ReportDialog 
                      commentId={comment.id} 
                      onReport={onReport} 
                    />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* 评论内容 */}
        <div className="pl-11">
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleEdit}>
                  保存
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(comment.content)
                  }}
                >
                  取消
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          )}
        </div>
        
        {/* 评论操作 */}
        {!isEditing && (
          <div className="pl-11 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                'text-muted-foreground hover:text-foreground',
                comment.isLiked && 'text-red-500 hover:text-red-600'
              )}
            >
              <Heart className={cn('h-4 w-4 mr-1', comment.isLiked && 'fill-current')} />
              <span className="text-xs">{comment.likes}</span>
            </Button>
            
            {allowReplies && onReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Reply className="h-4 w-4 mr-1" />
                <span className="text-xs">回复</span>
              </Button>
            )}
          </div>
        )}
        
        {/* 回复表单 */}
        {isReplying && (
          <div className="pl-11 mt-4">
            <CommentForm
              placeholder={`回复 ${comment.author.name}...`}
              submitText="发表回复"
              parentId={comment.id}
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}
      </div>
      
      {/* 子评论 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              level={level + 1}
              allowReplies={allowReplies}
              allowEditing={allowEditing}
              allowReporting={allowReporting}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              onReport={onReport}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// 主评论组件
export function Comments({
  comments,
  className,
  allowReplies = true,
  allowEditing = false,
  allowReporting = true,
  requireAuth = false,
  onSubmit,
  onEdit,
  onDelete,
  onLike,
  onReport,
}: CommentsProps) {
  const [showForm, setShowForm] = React.useState(!requireAuth)

  return (
    <div className={cn('space-y-6', className)}>
      {/* 评论统计 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          评论 ({comments.length})
        </h3>
        
        {requireAuth && !showForm && (
          <Button onClick={() => setShowForm(true)}>
            写评论
          </Button>
        )}
      </div>
      
      {/* 评论表单 */}
      {showForm && (
        <CommentForm
          onSubmit={onSubmit}
          onCancel={requireAuth ? (() => setShowForm(false)) : undefined}
        />
      )}
      
      {/* 评论列表 */}
      {comments.length > 0 ? (
        <div className="space-y-0 divide-y">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              allowReplies={allowReplies}
              allowEditing={allowEditing}
              allowReporting={allowReporting}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              onReport={onReport}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            还没有评论，来发表第一条评论吧！
          </p>
        </div>
      )}
    </div>
  )
}

// 评论统计组件
export function CommentStats({ 
  count, 
  className 
}: { 
  count: number
  className?: string 
}) {
  return (
    <div className={cn('flex items-center gap-1 text-sm text-muted-foreground', className)}>
      <MessageCircle className="h-4 w-4" />
      <span>{count} 条评论</span>
    </div>
  )
}

// 第三方评论系统集成组件
export function ThirdPartyComments({ 
  type = 'giscus',
  config,
  className 
}: {
  type?: 'giscus' | 'disqus' | 'utterances'
  config?: Record<string, any>
  className?: string
}) {
  React.useEffect(() => {
    // 这里可以集成第三方评论系统
    // 例如 Giscus、Disqus、Utterances 等
    console.log(`加载 ${type} 评论系统`, config)
  }, [type, config])

  return (
    <div className={cn('', className)}>
      <div id={`${type}-comments`} />
    </div>
  )
}

export type { Comment as CommentType, CommentFormData }