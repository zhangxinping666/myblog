// 导航配置文件
export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  description?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface MainNavItem extends NavItem {
  title: string;
  href:string;
}

export interface SidebarNavItem extends NavItemWithChildren {
  title: string;
  href:string;
  items: SidebarNavItem[];
}

// 主导航配置
export const mainNav: MainNavItem[] = [
  {
    title: "首页",
    href: "/",
  },
  {
    title: "文章",
    href: "/posts",
  },
  {
    title: "分类",
    href: "/categories",
  },
  {
    title: "标签", 
    href: "/tags",
  },
  {
    title: "项目",
    href: "/projects",
  },
  {
    title: "关于",
    href: "/about",
  },
  {
    title: "联系",
    href: "/contact",
  },
]

// 侧边栏导航配置
export const sidebarNav: SidebarNavItem[] = [
  {
    title: "开始",
    href: "/docs",
    items: [
      {
        title: "介绍",
        href: "/docs",
        items: [],
      },
      {
        title: "安装",
        href: "/docs/installation",
        items: [],
      },
    ],
  },
  {
    title: "组件",
    href: "/docs/components",
    items: [
      {
        title: "Button",
        href: "/docs/components/button",
        items: [],
      },
      {
        title: "Card",
        href: "/docs/components/card", 
        items: [],
      },
    ],
  },
]

// 页脚导航配置
export const footerNav = {
  main: [
    {
      title: "首页",
      href: "/",
    },
    {
      title: "文章",
      href: "/posts",
    },
    {
      title: "关于",
      href: "/about",
    },
    {
      title: "联系",
      href: "/contact",
    },
  ],
  social: [
    {
      title: "GitHub",
      href: "https://github.com",
      external: true,
    },
    {
      title: "Twitter",
      href: "https://twitter.com",
      external: true,
    },
    {
      title: "LinkedIn", 
      href: "https://linkedin.com",
      external: true,
    },
  ],
  legal: [
    {
      title: "隐私政策",
      href: "/privacy",
    },
    {
      title: "使用条款",
      href: "/terms",
    },
    {
      title: "Cookie政策",
      href: "/cookies",
    },
  ],
} as const