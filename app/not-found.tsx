import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="text-2xl font-semibold">页面未找到</h2>
        <p className="text-muted-foreground max-w-md">
          抱歉，您访问的页面不存在。可能是链接有误，或者页面已被移除。
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            返回首页
          </Link>
          <Link
            href="/posts"
            className="px-6 py-3 border rounded-md hover:bg-accent transition-colors"
          >
            浏览文章
          </Link>
        </div>
      </div>
    </div>
  );
}