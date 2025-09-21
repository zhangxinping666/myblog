import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  date?: string
}

export interface RelatedPostsProps {
  posts: RelatedPost[]
  title?: string
}

export function RelatedPosts({ posts, title = '相关文章' }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="block space-y-1 group"
            >
              <h4 className="font-medium group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              {post.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              {post.date && (
                <p className="text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString('zh-CN')}
                </p>
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RelatedPosts
