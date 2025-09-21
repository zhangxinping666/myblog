// Blog list component placeholder
// This would normally fetch and display blog posts
export function BlogList({ 
  category, 
  tag, 
  showPagination = false 
}: { 
  category?: string | undefined
  tag?: string | undefined
  showPagination?: boolean 
}) {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        文章列表组件 - 显示 {category ? `分类: ${category}` : tag ? `标签: ${tag}` : '所有'} 的文章
      </p>
      {showPagination && (
        <div className="flex justify-center">
          <p className="text-sm text-muted-foreground">分页控件</p>
        </div>
      )}
    </div>
  )
}

export default BlogList
