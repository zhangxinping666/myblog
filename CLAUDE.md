# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 提供在此代码仓库中工作的指导。

## 开发命令

- **开发服务器**: `npm run dev` - 启动 Next.js 开发服务器，使用 Turbopack 加速构建，默认访问地址 http://localhost:3000
- **生产构建**: `npm run build` - 使用 Turbopack 构建生产版本
- **启动生产服务器**: `npm start` - 启动生产环境服务器
- **代码检查**: `npm run lint` - 运行 ESLint，包含 Next.js 核心性能规则和 TypeScript 规则

## 项目架构详解

这是一个基于 Next.js 14 的现代博客应用，采用 App Router 架构模式。

### 技术栈
- **框架**: Next.js 14（使用 App Router 而非传统的 Pages Router）
- **编程语言**: TypeScript，开启严格模式（tsconfig.json 中 strict: true）
- **样式方案**: Tailwind CSS v4（注意：v4 版本不需要配置文件，使用方式与 v3 不同）
- **UI 组件库**: Radix UI 无样式组件库，确保可访问性和键盘导航支持
- **内容管理**: MDX 格式的博客文章（存储在 `content/posts/` 目录）
- **字体处理**: 使用 Next.js 内置字体优化，集成 Geist 和 Geist Mono 字体
- **动画库**: Framer Motion 用于页面转场和组件动画
- **搜索功能**: Fuse.js 提供客户端模糊搜索能力
- **构建工具**: Turbopack（Webpack 的 Rust 替代品，开发构建速度更快）
- **性能优化**:
  - Million.js 自动优化 React 组件渲染性能
  - Sharp 用于图片压缩和格式转换
  - Plaiceholder 生成模糊占位图，提升加载体验
  - `reading-time` 自动计算文章阅读时间

### 目录结构详解

#### `app/` - Next.js App Router 路由系统
```
app/
├── (site)/          # 路由组，组织相关页面，不影响 URL 结构
│   ├── about/       # 关于页面 (/about)
│   ├── posts/       # 博客列表和详情
│   │   ├── [slug]/  # 动态路由：文章详情页 (/posts/article-slug)
│   │   ├── error.tsx    # 错误边界，处理加载失败
│   │   ├── loading.tsx  # 加载状态组件
│   │   └── page.tsx     # 文章列表页 (/posts)
│   ├── categories/  # 分类归档 (/categories/[category])
│   │   └── [category]/
│   ├── tags/        # 标签归档 (/tags/[tag])
│   │   └── [tag]/
│   ├── projects/    # 项目展示页面 (/projects)
│   ├── contact/     # 联系页面 (/contact)
│   └── uses/        # 工具/技术栈页面 (/uses)
├── api/             # API 路由（无页面路由）
│   ├── likes/       # POST /api/likes - 处理文章点赞
│   ├── newsletter/  # POST /api/newsletter - 邮件订阅
│   ├── og/          # GET /api/og - 动态生成分享图片
│   ├── search/      # GET /api/search - 搜索接口
│   └── views/       # POST /api/views - 浏览量统计
├── layout.tsx       # 根布局，全局共享
├── globals.css      # 全局样式和 Tailwind 指令
└── not-found.tsx    # 404 页面
```

#### `components/` - 组件按功能分类
```
components/
├── blog/          # 博客专属组件
├── common/        # 通用组件
├── features/      # 功能组件
├── layout/        # 布局组件
├── mdx/          # MDX 自定义组件
└── ui/           # 基础 UI 组件
```

**重要组件说明**:
- `components/mdx/mdx-components.tsx` - 全局 MDX 组件映射，可自定义代码块、提示框等样式
- `components/ui/` - 遵循 shadcn/ui 模式，使用 Radix UI + Tailwind CSS
- `components/features/analytics.tsx` - 集成网站分析（如 Google Analytics、Plausible 等）

#### `lib/` - 工具库和配置
```
lib/
├── config/        # 配置文件
│   ├── site.ts    # 站点基本信息（标题、描述、作者等）
│   ├── navigation.ts # 主导航和页脚链接
│   └── seo.ts     # SEO 默认配置
├── hooks/         # 自定义 Hooks
│   ├── use-local-storage.ts # localStorage 状态同步
│   ├── use-media-query.ts   # 响应式断点检测
│   └── use-scroll.ts        # 滚动位置监听
├── utils/         # 工具函数
│   ├── cn.ts      # className 合并（clsx + tailwind-merge）
│                   # 用于条件性应用 Tailwind 样式
│   ├── format.ts  # 日期、数字等格式化
│   └── helper.ts  # 通用辅助函数
└── services/      # 服务层
    ├── api.ts     # API 请求封装（fetch wrapper）
    └── analytics.ts # 分析工具集成
```

#### `content/` - 内容管理
```
content/
├── posts/      # 博客文章（MDX 格式，支持 React 组件）
├── projects/   # 项目展示（可按需扩展）
└── snippets/   # 代码片段（可按需扩展）
```

#### `styles/` - 额外样式
- `prose.css` - MDX 内容样式，配合 @tailwindcss/typography 使用
- `syntax-highlighting.css` - 代码高亮主题样式

#### `scripts/` - 自动化脚本
- `generate-og.js` - 生成文章分享图片（Open Graph）
- `generate-rss.js` - 生成 RSS 订阅文件
- `optimize-images.js` - 批量优化静态图片

### 核心开发模式

1. **路径导入别名**: 
   - `@/` 指向项目根目录，例如：`import { Button } from "@/components/ui/button"`
   - 避免相对路径地狱（../../../）

2. **样式组织**:
   - 使用 `cn()` 工具函数合并 className
   - 响应式设计遵循移动端优先
   - 暗色模式通过 `dark:` 前缀实现

3. **数据获取**:
   - 静态内容使用 MDX frontmatter
   - 动态功能（点赞、浏览量）通过 API Routes
   - 搜索功能在客户端使用 Fuse.js 实现

4. **性能优化实践**:
   - Million.js 自动包装 React 组件（无需手动配置）
   - 图片使用 next/image 配合 Sharp 优化
   - 代码分割：动态导入大型组件
   - 字体使用 next/font 自动优化

5. **内容创作流程**:
   - 在 `content/posts/` 创建 `.mdx` 文件
   - 必须包含 frontmatter 元数据：
     ```yaml
     ---
     title: "文章标题"
     date: "2024-01-20"
     description: "简短描述（用于 SEO 和列表展示）"
     category: "技术"
     tags: ["react", "nextjs", "typescript"]
     image: "/path/to/cover.jpg"  # 可选封面图
     ---
     ```
   - 可在正文使用自定义 React 组件
   - 支持代码高亮、提示框、折叠内容等 MDX 扩展

### 部署和构建

1. **环境要求**:
   - Node.js 18+（Next.js 14 要求）
   - 支持 Vercel、Netlify、Docker 等部署方式

2. **构建过程**:
   ```bash
   npm install     # 安装依赖
   npm run build   # 构建生产版本（包含静态生成）
   npm start       # 启动生产服务器
   ```

3. **优化检查清单**:
   - 运行 `npm run lint` 确保无代码问题
   - 检查 `next.config.ts` 中的配置
   - 确认环境变量设置（如分析工具 ID）

### 常见问题排查

1. **样式不生效**: 检查是否正确导入 `globals.css`
2. **MDX 组件无效**: 确认在 `mdx-components.tsx` 中注册
3. **API 报错**: 检查请求方法和数据格式
4. **构建失败**: 查看 TypeScript 类型错误和 ESLint 警告

# 🏗️ Next.js 博客项目模块化架构指南

## 📁 完整项目目录结构

基于您的需求，我重新整理了完整的项目目录结构，并修正了文件归属问题：

```
my-blog/
├── .github/                          # GitHub 配置
│   ├── workflows/                    
│   │   ├── ci.yml                    # 持续集成
│   │   └── deploy.yml                # 部署流程
│   └── PULL_REQUEST_TEMPLATE.md      # PR 模板
├── .vscode/                          # VSCode 配置
│   ├── settings.json                 # 编辑器设置
│   ├── extensions.json               # 推荐扩展
│   └── launch.json                   # 调试配置
├── app/                              # Next.js App Router
│   ├── (site)/                       # 主站点路由组
│   │   ├── page.tsx                  # 首页
│   │   ├── layout.tsx                # 站点布局
│   │   ├── loading.tsx               # 全局加载页
│   │   ├── error.tsx                 # 全局错误页
│   │   ├── posts/                    # 文章相关
│   │   │   ├── [slug]/               
│   │   │   │   ├── page.tsx          # 文章详情
│   │   │   │   ├── loading.tsx       # 加载状态
│   │   │   │   └── error.tsx         # 错误处理
│   │   │   ├── page.tsx              # 文章列表
│   │   │   └── layout.tsx            # 文章布局
│   │   ├── categories/               # 分类页面
│   │   │   ├── [category]/
│   │   │   │   └── page.tsx          # 分类详情
│   │   │   └── page.tsx              # 分类列表
│   │   ├── tags/                     # 标签页面
│   │   │   ├── [tag]/
│   │   │   │   └── page.tsx          # 标签详情
│   │   │   └── page.tsx              # 标签列表
│   │   ├── about/                    # 关于页面
│   │   │   └── page.tsx
│   │   ├── projects/                 # 项目展示
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx          # 项目详情
│   │   │   └── page.tsx              # 项目列表
│   │   ├── uses/                     # 装备清单
│   │   │   └── page.tsx
│   │   └── contact/                  # 联系页面
│   │       └── page.tsx
│   ├── api/                          # API 路由
│   │   ├── search/
│   │   │   └── route.ts              # 搜索 API
│   │   ├── newsletter/
│   │   │   └── route.ts              # 订阅 API
│   │   ├── views/
│   │   │   └── [slug]/
│   │   │       └── route.ts          # 浏览量 API
│   │   ├── likes/
│   │   │   └── [slug]/
│   │   │       └── route.ts          # 点赞 API
│   │   ├── og/
│   │   │   └── route.tsx             # OG 图片生成
│   │   └── rss/
│   │       └── route.ts              # RSS 订阅
│   ├── layout.tsx                    # 根布局
│   ├── globals.css                   # 全局样式
│   ├── not-found.tsx                 # 404 页面
│   ├── error.tsx                     # 错误边界
│   ├── robots.ts                     # robots.txt
│   ├── sitemap.ts                    # sitemap.xml
│   └── manifest.ts                   # PWA manifest
├── components/                       # 组件库
│   ├── ui/                           # 基础 UI 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── textarea.tsx
│   │   ├── tooltip.tsx
│   │   └── index.ts                  # 统一导出
│   ├── layout/                       # 布局组件
│   │   ├── header.tsx                # 顶部导航
│   │   ├── footer.tsx                # 页脚
│   │   ├── sidebar.tsx               # 侧边栏
│   │   ├── mobile-nav.tsx            # 移动端导航
│   │   └── breadcrumb.tsx            # 面包屑
│   ├── features/                     # 功能组件
│   │   ├── search.tsx                # 搜索功能
│   │   ├── theme-toggle.tsx          # 主题切换
│   │   ├── toc.tsx                   # 目录组件
│   │   ├── share.tsx                 # 分享功能
│   │   ├── newsletter.tsx            # 邮件订阅
│   │   ├── comments.tsx              # 评论系统
│   │   └── analytics.tsx             # 数据分析
│   ├── mdx/                          # MDX 组件
│   │   ├── mdx-components.tsx        # MDX 映射
│   │   ├── code-block.tsx            # 代码块
│   │   ├── callout.tsx               # 提示框
│   │   ├── image.tsx                 # 图片组件
│   │   └── video.tsx                 # 视频组件
│   ├── blog/                         # 博客相关组件
│   │   ├── blog-card.tsx             # 文章卡片
│   │   ├── blog-list.tsx             # 文章列表
│   │   ├── author-card.tsx           # 作者卡片
│   │   ├── related-posts.tsx         # 相关文章
│   │   └── post-meta.tsx             # 文章元信息
│   ├── providers/                    # Context 提供者
│   │   ├── theme-provider.tsx        # 主题提供者
│   │   ├── search-provider.tsx       # 搜索提供者
│   │   └── analytics-provider.tsx    # 分析提供者
│   └── common/                       # 通用组件
│       ├── seo.tsx                   # SEO 组件
│       ├── animated-page.tsx         # 页面动画
│       └── error-boundary.tsx        # 错误边界
├── content/                          # 内容文件
│   ├── posts/                        # 博客文章
│   │   ├── 2024-01-01-hello-world.mdx
│   │   └── ...
│   ├── projects/                     # 项目内容
│   │   ├── project-1.mdx
│   │   └── ...
│   └── snippets/                     # 代码片段
│       ├── snippet-1.mdx
│       └── ...
├── lib/                              # 工具库
│   ├── config/                       # 配置文件
│   │   ├── site.ts                   # 站点配置
│   │   ├── navigation.ts             # 导航配置
│   │   └── seo.ts                    # SEO 配置
│   ├── utils/                        # 工具函数
│   │   ├── cn.ts                     # className 合并
│   │   ├── format.ts                 # 格式化函数
│   │   └── helpers.ts                # 辅助函数
│   ├── hooks/                        # 自定义 Hooks
│   │   ├── use-scroll.ts             # 滚动相关
│   │   ├── use-media-query.ts        # 媒体查询
│   │   ├── use-local-storage.ts      # 本地存储
│   │   └── use-debounce.ts           # 防抖钩子
│   ├── animations/                   # 动画配置
│   │   ├── variants.ts               # 动画变体
│   │   └── transitions.ts            # 过渡配置
│   ├── services/                     # 服务层
│   │   ├── api.ts                    # API 服务
│   │   └── analytics.ts              # 分析服务
│   └── types/                        # 类型定义
│       ├── index.ts                  # 通用类型
│       ├── api.ts                    # API 类型
│       └── blog.ts                   # 博客类型
├── public/                           # 静态资源
│   ├── images/                       # 图片资源
│   │   ├── og-image.png              # OG 图片
│   │   ├── avatar.jpg                # 头像
│   │   └── ...
│   ├── icons/                        # 图标
│   │   ├── favicon.ico
│   │   ├── apple-touch-icon.png
│   │   └── ...
│   └── fonts/                        # 字体文件
│       └── ...
├── scripts/                          # 脚本文件
│   ├── generate-rss.js               # 生成 RSS
│   ├── generate-og.js                # 生成 OG 图片
│   └── optimize-images.js            # 优化图片
├── styles/                           # 样式文件
│   ├── prose.css                     # 文章样式
│   └── syntax-highlighting.css       # 代码高亮
├── tests/                            # 测试文件
│   ├── unit/                         # 单元测试
│   ├── integration/                  # 集成测试
│   └── e2e/                          # 端到端测试
├── .env.example                      # 环境变量示例
├── .eslintrc.json                    # ESLint 配置
├── .gitignore                        # Git 忽略文件
├── .prettierrc                       # Prettier 配置
├── commitlint.config.js              # Commit 规范
├── contentlayer.config.ts            # Contentlayer 配置
├── next-sitemap.config.js            # Sitemap 配置
├── next.config.mjs                   # Next.js 配置
├── package.json                      # 项目配置
├── pnpm-workspace.yaml               # PNPM 工作区
├── postcss.config.js                 # PostCSS 配置
├── README.md                         # 项目说明
├── tailwind.config.ts                # Tailwind 配置
├── tsconfig.json                     # TypeScript 配置
└── vitest.config.ts                  # Vitest 配置
```

---
## 🎯 模块划分与文件归属

### 模块1：📦 基础配置模块

**优先级：🔥 最高**  
**实现顺序：第1步**

**包含文件：**
- `package.json` - 项目依赖配置
- `next.config.mjs` - Next.js 框架配置
- `tsconfig.json` - TypeScript 配置
- `tailwind.config.ts` - 样式框架配置
- `postcss.config.js` - CSS 后处理器配置
- `eslintrc.json` - 代码检查配置
- `.prettierrc` - 代码格式化配置
- `vitest.config.ts` - 测试框架配置
- `commitlint.config.js` - 提交信息规范
- `.gitignore` - Git 忽略配置
- `.env.example` - 环境变量模板
- `README.md` - 项目文档

**涉及内容：**
- 项目初始化和依赖管理
- 开发环境配置
- 代码质量保证
- 构建和部署配置

---

### 模块2：🎨 样式系统模块
**优先级：🔥 最高**  
**实现顺序：第2步**

**包含文件：**
- `app/globals.css` - 全局样式定义
- `styles/prose.css` - 文章内容样式
- `styles/syntax-highlighting.css` - 代码高亮样式

**涉及内容：**
- 设计令牌系统
- 主题切换机制
- 响应式设计
- 动画和过渡效果

---

### 模块3：📝 类型定义模块
**优先级：🔥 最高**  
**实现顺序：第3步**

**包含文件：**
- `lib/types/index.ts` - 通用类型定义
- `lib/types/api.ts` - API 相关类型
- `lib/types/blog.ts` - 博客相关类型

**涉及内容：**
- 全局类型接口
- API 请求/响应类型
- 组件 Props 类型
- 内容管理类型

---

### 模块4：🔧 工具函数模块
**优先级：🔥 最高**  
**实现顺序：第4步**

**包含文件：**
- `lib/utils/cn.ts` - 样式类名合并工具
- `lib/utils/format.ts` - 数据格式化工具
- `lib/utils/helpers.ts` - 通用辅助函数
- `lib/hooks/use-scroll.ts` - 滚动相关钩子
- `lib/hooks/use-media-query.ts` - 媒体查询钩子
- `lib/hooks/use-local-storage.ts` - 本地存储钩子
- `lib/hooks/use-debounce.ts` - 防抖钩子

**涉及内容：**
- 样式处理工具
- 日期时间格式化
- 字符串处理函数
- 自定义React钩子

---

### 模块5：🧩 基础UI组件模块
**优先级：🚀 高**  
**实现顺序：第5步**

**包含文件：**
- `components/ui/button.tsx` - 按钮组件
- `components/ui/card.tsx` - 卡片组件
- `components/ui/dialog.tsx` - 对话框组件
- `components/ui/dropdown-menu.tsx` - 下拉菜单
- `components/ui/input.tsx` - 输入框组件
- `components/ui/label.tsx` - 标签组件
- `components/ui/separator.tsx` - 分隔线组件
- `components/ui/skeleton.tsx` - 骨架屏组件
- `components/ui/textarea.tsx` - 文本域组件
- `components/ui/tooltip.tsx` - 提示框组件
- `components/ui/index.ts` - 统一导出

**涉及内容：**
- 可复用UI组件
- 组件变体和状态
- 无障碍访问支持
- 组件文档和测试

---

### 模块6：🏠 布局组件模块
**优先级：🚀 高**  
**实现顺序：第6步**

**包含文件：**
- `components/layout/header.tsx` - 网站头部导航
- `components/layout/footer.tsx` - 网站页脚
- `components/layout/sidebar.tsx` - 侧边栏组件
- `components/layout/mobile-nav.tsx` - 移动端导航
- `components/layout/breadcrumb.tsx` - 面包屑导航

**涉及内容：**
- 页面整体布局
- 导航系统设计
- 响应式布局适配
- 移动端交互优化

---

### 模块7：⚡ 功能组件模块
**优先级：🚀 高**  
**实现顺序：第7步**

**包含文件：**
- `components/features/search.tsx` - 搜索功能组件
- `components/features/theme-toggle.tsx` - 主题切换组件
- `components/features/toc.tsx` - 文章目录组件
- `components/features/share.tsx` - 分享功能组件
- `components/features/newsletter.tsx` - 邮件订阅组件
- `components/features/comments.tsx` - 评论系统组件
- `components/features/analytics.tsx` - 数据分析组件

**涉及内容：**
- 用户交互功能
- 第三方服务集成
- 实时数据更新
- 用户体验优化

---

### 模块8：📄 页面路由模块
**优先级：🚀 高**  
**实现顺序：第8步**

**包含文件：**
- `app/layout.tsx` - 根布局文件
- `app/(site)/layout.tsx` - 站点布局文件
- `app/(site)/page.tsx` - 首页
- `app/(site)/loading.tsx` - 全局加载页
- `app/(site)/error.tsx` - 全局错误页
- `app/(site)/posts/page.tsx` - 文章列表页
- `app/(site)/posts/layout.tsx` - 文章布局页
- `app/(site)/posts/[slug]/page.tsx` - 文章详情页
- `app/(site)/posts/[slug]/loading.tsx` - 文章加载页
- `app/(site)/posts/[slug]/error.tsx` - 文章错误页
- `app/(site)/categories/page.tsx` - 分类列表页
- `app/(site)/categories/[category]/page.tsx` - 分类详情页
- `app/(site)/tags/page.tsx` - 标签列表页
- `app/(site)/tags/[tag]/page.tsx` - 标签详情页
- `app/(site)/about/page.tsx` - 关于页面
- `app/(site)/projects/page.tsx` - 项目列表页
- `app/(site)/projects/[slug]/page.tsx` - 项目详情页
- `app/(site)/uses/page.tsx` - 装备清单页
- `app/(site)/contact/page.tsx` - 联系页面
- `app/not-found.tsx` - 404页面
- `app/error.tsx` - 错误边界

**涉及内容：**
- 路由结构设计
- 页面布局系统
- 数据获取策略
- 错误处理机制

---

### 模块9：🔌 API服务模块
**优先级：⭐ 中**  
**实现顺序：第9步**

**包含文件：**
- `app/api/search/route.ts` - 搜索API接口
- `app/api/newsletter/route.ts` - 邮件订阅API
- `app/api/views/[slug]/route.ts` - 文章浏览量API
- `app/api/likes/[slug]/route.ts` - 文章点赞API
- `app/api/og/route.tsx` - OG图片生成API
- `app/api/rss/route.ts` - RSS订阅API
- `lib/services/api.ts` - API服务封装
- `lib/services/analytics.ts` - 数据分析服务

**涉及内容：**
- RESTful API设计
- 数据持久化
- 第三方API集成
- 缓存策略实现

---

### 模块10：📖 内容管理模块
**优先级：⭐ 中**  
**实现顺序：第10步**

**包含文件：**
- `contentlayer.config.ts` - 内容层配置
- `components/mdx/mdx-components.tsx` - MDX组件映射
- `components/mdx/code-block.tsx` - 代码块组件
- `components/mdx/callout.tsx` - 提示框组件
- `components/mdx/image.tsx` - 图片组件
- `components/mdx/video.tsx` - 视频组件
- `components/blog/blog-card.tsx` - 文章卡片组件
- `components/blog/blog-list.tsx` - 文章列表组件
- `components/blog/author-card.tsx` - 作者卡片组件
- `components/blog/related-posts.tsx` - 相关文章组件
- `components/blog/post-meta.tsx` - 文章元信息组件
- `content/posts/` - 博客文章目录
- `content/projects/` - 项目内容目录
- `content/snippets/` - 代码片段目录

**涉及内容：**
- Markdown/MDX处理
- 内容结构化管理
- 元数据提取
- 内容搜索索引

---

### 模块11：🎬 动画系统模块
**优先级：⭐ 中**  
**实现顺序：第11步**

**包含文件：**
- `lib/animations/variants.ts` - 动画变体配置
- `lib/animations/transitions.ts` - 过渡动画配置
- `components/common/animated-page.tsx` - 页面动画组件

**涉及内容：**
- 页面切换动画
- 组件进入/退出动画
- 交互反馈动画
- 性能优化策略

---

### 模块12：🔄 状态管理模块
**优先级：⭐ 中**  
**实现顺序：第12步**

**包含文件：**
- `components/providers/theme-provider.tsx` - 主题状态管理
- `components/providers/search-provider.tsx` - 搜索状态管理
- `components/providers/analytics-provider.tsx` - 分析数据管理

**涉及内容：**
- 全局状态管理
- Context API使用
- 状态持久化
- 性能优化

---

### 模块13：📊 SEO优化模块
**优先级：🔵 低**  
**实现顺序：第13步**

**包含文件：**
- `lib/config/site.ts` - 站点基础配置
- `lib/config/navigation.ts` - 导航配置
- `lib/config/seo.ts` - SEO配置
- `components/common/seo.tsx` - SEO组件
- `app/robots.ts` - 爬虫规则配置
- `app/sitemap.ts` - 站点地图生成
- `app/manifest.ts` - PWA配置

**涉及内容：**
- 元标签优化
- 结构化数据
- 站点地图生成
- PWA配置

---

### 模块14：🖼️ 静态资源模块
**优先级：🔵 低**  
**实现顺序：第14步**

**包含文件：**
- `public/images/` - 图片资源目录
- `public/icons/` - 图标资源目录
- `public/fonts/` - 字体资源目录
- `scripts/generate-og.js` - OG图片生成脚本
- `scripts/optimize-images.js` - 图片优化脚本

**涉及内容：**
- 图片资源管理
- 图标系统设计
- 字体加载优化
- 资源压缩优化

---

### 模块15：🧪 测试模块
**优先级：🔵 低**  
**实现顺序：第15步**

**包含文件：**
- `tests/unit/` - 单元测试目录
- `tests/integration/` - 集成测试目录
- `tests/e2e/` - 端到端测试目录

**涉及内容：**
- 组件单元测试
- API集成测试
- 用户流程测试
- 性能测试

---

### 模块16：🚀 部署配置模块
**优先级：🔵 低**  
**实现顺序：第16步**

**包含文件：**
- `.github/workflows/ci.yml` - 持续集成配置
- `.github/workflows/deploy.yml` - 部署流程配置
- `.github/PULL_REQUEST_TEMPLATE.md` - PR模板
- `.vscode/settings.json` - 编辑器配置
- `.vscode/extensions.json` - 推荐扩展配置
- `.vscode/launch.json` - 调试配置
- `next-sitemap.config.js` - 站点地图配置
- `pnpm-workspace.yaml` - 工作区配置
- `scripts/generate-rss.js` - RSS生成脚本

**涉及内容：**
- CI/CD流程配置
- 代码质量检查
- 自动化部署
- 开发环境配置

---

## 🎯 实现优先级总结

### 🔥 第一优先级（第1-4步）- 基础设施
1. **基础配置模块** - 项目能够启动
2. **样式系统模块** - 基础样式支持
3. **类型定义模块** - TypeScript支持
4. **工具函数模块** - 基础工具函数

### 🚀 第二优先级（第5-8步）- 核心功能
5. **基础UI组件模块** - 可复用组件
6. **布局组件模块** - 页面结构
7. **功能组件模块** - 核心功能
8. **页面路由模块** - 页面系统

### ⭐ 第三优先级（第9-12步）- 增强功能
9. **API服务模块** - 后端接口
10. **内容管理模块** - 内容系统
11. **动画系统模块** - 用户体验
12. **状态管理模块** - 状态管理

### 🔵 第四优先级（第13-16步）- 优化完善
13. **SEO优化模块** - 搜索优化
14. **静态资源模块** - 资源管理
15. **测试模块** - 质量保证
16. **部署配置模块** - 生产部署

---

## 📝 实施建议

1. **严格按照优先级顺序实施**，确保基础模块稳定后再开发高级功能
2. **每个模块完成后进行测试验证**，确保功能正常
3. **定期code review**，保证代码质量
4. **文档同步更新**，便于团队协作
5. **性能监控持续关注**，及时优化问题

这个模块化架构确保了项目的可维护性、可扩展性和开发效率，为构建高质量的Next.js博客项目提供了清晰的路线图。