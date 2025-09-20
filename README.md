# 🚀 My Blog - 基于 Next.js 14 的现代博客系统

一个功能丰富、性能优化的现代博客应用，采用最新的 Web 技术栈构建。

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

## ✨ 功能特性

### 🎯 核心功能
- **📝 Markdown/MDX 支持** - 富文本内容创作，支持自定义组件
- **🏷️ 多分类/多标签** - 灵活的内容组织方式
- **🔍 全文搜索** - 基于 Fuse.js 的模糊搜索
- **🌗 深色模式** - 支持系统主题切换
- **📱 响应式设计** - 完美适配各种设备
- **⚡ 性能优化** - 采用 Turbopack、Million.js 等优化技术
- **🌍 SEO 优化** - 完整的元标签、结构化数据支持
- **📊 访问统计** - 浏览量、点赞数统计

### 🛠️ 技术亮点
- **Next.js 15** - 使用 App Router 架构
- **TypeScript** - 严格类型检查
- **Tailwind CSS v4** - 现代化样式框架
- **Framer Motion** - 丝滑的动画效果
- **Radix UI** - 无障碍访问的基础组件库
- **Contentlayer** - 类型安全的内容管理
- **Sharp** - 高性能图片处理

### 📊 性能指标
- ⚡ **Turbopack** - 超快的开发构建
- 🚀 **Million.js** - React 组件自动优化
- 🖼️ **Next.js Image** - 自动图片优化
- 🔤 **预加载字体** - 最佳的字体加载策略
- 📱 **PWA** - 可安装的应用体验

## 🚀 快速开始

### 📋 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 🔧 安装依赖

```bash
npm install
# 或使用 pnpm
pnpm install
```

### 🏃‍♂️ 启动开发服务器

```bash
npm run dev
# 或使用 pnpm
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 📦 构建生产版本

```bash
npm run build
npm run start
```

## 🎯 目录结构

```
my-blog/
├── app/                      # Next.js App Router 路由系统
│   ├── (site)/              # 主站点路由组
│   │   ├── posts/           # 文章相关页面
│   │   ├── categories/      # 分类页面
│   │   ├── tags/            # 标签页面
│   │   ├── projects/        # 项目展示
│   │   └── about/           # 关于页面
│   ├── api/                 # API 路由
│   └── layout.tsx           # 根布局
├── components/              # 组件库
│   ├── ui/                  # 基础 UI 组件
│   ├── layout/              # 布局组件
│   ├── blog/                # 博客相关组件
│   └── features/            # 功能组件
├── content/                 # 内容文件 (MDX)
│   ├── posts/              # 博客文章
│   ├── projects/           # 项目内容
│   └── snippets/           # 代码片段
├── lib/                     # 工具库
│   ├── config/             # 配置文件
│   ├── utils/              # 工具函数
│   └── types/              # 类型定义
├── public/                  # 静态资源
├── styles/                  # 样式文件
└── scripts/                 # 自动化脚本
```

## 📝 内容创作

### 文章格式
在 `content/posts/` 目录下创建 `.mdx` 文件：

```mdx
---
title: "我的文章标题"
date: "2024-01-20"
description: "简短描述"
category: "技术"
tags: ["react", "nextjs", "typescript"]
image: "/images/cover.jpg"
---

# 文章标题

你的文章内容在这里，支持：

## Markdown 语法
- ✅ 普通 Markdown
- ✅ 代码高亮
- ✅ 表格
- ✅ 图片
- ✅ 链接

## MDX 组件
- ✅ React 组件
- ✅ 自定义组件
- ✅ 交互式组件

<Callout type="warning">
这是一个警告框
</Callout>

<CodeBlock language="typescript" filename="example.tsx" highlight="2,4-6">
{`import React from 'react';

export function Example() {
  return <div>Hello MDX!</div>;
}`}
</CodeBlock>
```

## 📊 命令一览

| 命令 | 描述 |
|-----|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint |
| `npm run type-check` | 运行 TypeScript 类型检查 |
| `npm run test` | 运行测试 |
| `npm run test:ui` | 运行测试并打开 UI |
| `npm run test:coverage` | 运行测试并生成覆盖率报告 |
| `npm run format` | 格式化代码 |
| `npm generate:rss` | 生成 RSS 订阅 |
| `npm generate:og` | 生成 OG 图片 |
| `npm optimize:images` | 优化图片 |

## 🎨 主题定制

### 颜色系统
在 `tailwind.config.ts` 中自定义：

```ts
// 设计令牌
--background: 0 0% 100%      // 背景色
--foreground: 222.2 84% 4.9% // 前景色
--primary: 222.2 47.4% 11.2% // 主色调
--border: 214.3 31.8% 91.4%  // 边框色
```

### 字体配置
使用 Next.js 字体优化：

```ts
// app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'
```

## 🚀 部署

### Vercel (推荐)
1. 连接 GitHub 仓库
2. 自动部署预览分支
3. 配置环境变量

### 其他平台
支持 Netlify、Cloudflare Pages、Docker 等部署方式。

## 🧩 扩展功能

### 🔍 搜索
- 本地搜索：基于 Fuse.js
- 实时搜索：支持模糊匹配
- 搜索历史：记录用户搜索

### 💬 评论系统
支持多种评论系统集成：
- Giscus (GitHub Discussions)
- Utterances (GitHub Issues) 
- Disqus

### 📨 邮件订阅
- 订阅表单
- 自动发送 newsletter
- 支持多邮件服务

### 📊 分析统计
- Google Analytics
- Plausible Analytics  
- Vercel Analytics

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing-feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

提交格式遵循 Conventional Commits 规范：

```
feat: 新功能
fix: Bug 修复  
docs: 文档更新
style: 样式调整
refactor: 代码重构
test: 测试相关
chore: 其他更改
```

## 🐛 问题反馈

如果发现 bug 或有功能建议，请通过以下方式反馈：
- 创建 GitHub Issue
- 提交 Pull Request
- 讨论区交流

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 🌟 致谢

感谢以下项目/工具：
- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Radix UI](https://www.radix-ui.com/) - UI 组件库
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [Contentlayer](https://contentlayer.dev/) - 内容管理

---

**⭐ 如果这个项目对你有帮助，请给个 Star ⭐**