// 站点基础配置信息
export const siteConfig = {
  name: "My Blog",
  title: "My Blog - 分享技术与思考",
  description: "一个现代化的技术博客，分享前端开发、React、Next.js 等技术内容",
  url: "https://my-blog.vercel.app",
  ogImage: "https://my-blog.vercel.app/og.jpg",
  links: {
    twitter: "https://twitter.com/username",
    github: "https://github.com/username",
    linkedin: "https://linkedin.com/in/username",
    email: "mailto:hello@example.com",
  },
  creator: {
    name: "Your Name",
    email: "hello@example.com",
    url: "https://your-website.com",
  },
  keywords: [
    "博客",
    "技术",
    "前端开发", 
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "编程",
    "开发者",
    "教程"
  ],
} as const

export type SiteConfig = typeof siteConfig