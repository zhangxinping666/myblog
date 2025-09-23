import Link from 'next/link'
import { Calendar, Clock, Tag, User, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils/format'

export interface PostCardProps {
  id: string
  title: string
  slug: string
  excerpt: string
  date: string
  category?: string
  tags?: string[]
  readingTime?: string
  author?: string
  image?: string
}

export function PostCard({
  title,
  slug,
  excerpt,
  date,
  category,
  tags,
  readingTime,
  author,
  image,
}: PostCardProps) {
  return (
    <Card className="group h-full flex flex-col hover:shadow-lg transition-shadow">
      {/* 封面图片 */}
      {image && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className="flex-1">
        {/* 分类标签 */}
        {category && (
          <Link href={`/categories/${category}`}>
            <Badge variant="secondary" className="mb-2">
              {category}
            </Badge>
          </Link>
        )}
        
        {/* 标题 */}
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/posts/${slug}`}>
            {title}
          </Link>
        </CardTitle>
        
        {/* 描述 */}
        <CardDescription className="line-clamp-3 mt-2">
          {excerpt}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* 元信息 */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {author && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{author}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(date)}</span>
          </div>
          {readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{readingTime}</span>
            </div>
          )}
        </div>
        
        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.slice(0, 3).map((tag) => (
              <Link key={tag} href={`/tags/${tag}`}>
                <Badge variant="outline" className="text-xs">
                  <Tag className="h-2.5 w-2.5 mr-1" />
                  {tag}
                </Badge>
              </Link>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" asChild className="group/button">
          <Link href={`/posts/${slug}`}>
            阅读更多
            <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover/button:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// 文章卡片骨架屏
export function PostCardSkeleton() {
  return (
    <Card className="h-full">
      <div className="aspect-video bg-muted animate-pulse rounded-t-lg" />
      <CardHeader>
        <div className="h-5 w-16 bg-muted animate-pulse rounded" />
        <div className="h-6 bg-muted animate-pulse rounded mt-2" />
        <div className="space-y-2 mt-2">
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

export default PostCard