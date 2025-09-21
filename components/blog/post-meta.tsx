import { Calendar, Clock, Eye, MessageSquare, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface PostMetaProps {
  date?: string | undefined
  readingTime?: string | undefined
  views?: number | undefined
  comments?: number | undefined
  tags?: string[]
}

export function PostMeta({
  date,
  readingTime,
  views,
  comments,
  tags,
}: PostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      {date && (
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{new Date(date).toLocaleDateString('zh-CN')}</span>
        </div>
      )}
      {readingTime && (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{readingTime}</span>
        </div>
      )}
      {views !== undefined && (
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{views} 次阅读</span>
        </div>
      )}
      {comments !== undefined && (
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{comments} 条评论</span>
        </div>
      )}
      {tags && tags.length > 0 && (
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          <div className="flex gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostMeta