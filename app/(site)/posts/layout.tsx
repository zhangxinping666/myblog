import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | 文章',
    default: '文章',
  },
  description: '浏览我的技术文章和博客内容',
}

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container py-8">
      {children}
    </div>
  )
}