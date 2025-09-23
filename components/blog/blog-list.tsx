import Link from 'next/link'
import { getAllPosts, getPostsByCategory, getPostsByTag } from '@/lib/mdx/mdx'
import { PostCard } from './blog-card'
import type { PostCardProps } from './blog-card'

export async function BlogList({ 
  category, 
  tag, 
  showPagination = false 
}: { 
  category?: string | undefined
  tag?: string | undefined
  showPagination?: boolean 
}) {
  // 根据条件获取文章
  let posts
  if (category) {
    posts = await getPostsByCategory(category)
  } else if (tag) {
    posts = await getPostsByTag(tag)
  } else {
    posts = await getAllPosts()
  }

  // 限制首页显示的文章数量
  const displayPosts = showPagination ? posts : posts.slice(0, 6)

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-lg text-muted-foreground">
          暂无{category ? `分类: ${category}` : tag ? `标签: ${tag}` : ''}相关文章
        </p>
        <Link href="/posts" className="text-primary hover:underline">
          查看所有文章
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPosts.map((post) => {
          const cardProps: PostCardProps = {
            id: post.slug,
            title: post.frontMatter.title,
            slug: post.slug,
            excerpt: post.frontMatter.description,
            date: post.frontMatter.date,
            readingTime: `${post.readingTime.minutes} 分钟`,
          }
          
          if (post.frontMatter.category) {
            cardProps.category = post.frontMatter.category
          }
          if (post.frontMatter.tags) {
            cardProps.tags = post.frontMatter.tags
          }
          if (post.frontMatter.author) {
            cardProps.author = post.frontMatter.author
          }
          if (post.frontMatter.image) {
            cardProps.image = post.frontMatter.image
          }
          
          return <PostCard key={post.slug} {...cardProps} />
        })}
      </div>
      
      {showPagination && posts.length > 6 && (
        <div className="flex justify-center pt-6">
          <p className="text-sm text-muted-foreground">
            共 {posts.length} 篇文章
          </p>
        </div>
      )}
    </div>
  )
}

export default BlogList