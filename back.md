# 🚀 Next.js 14 博客完整实战指南 - 从零到生产级部署

> **作者注**：本指南融合了 Vercel 官方最佳实践、生产环境经验和深度技术分析，帮助你构建一个性能卓越、功能完备的现代博客系统。每个知识点都包含详细说明、代码示例和最佳实践。

---

## 📚 目录

### **Part 1: 技术架构与分析**
1. [法医级技术分析](#-part-1-法医级技术分析)
2. [技术栈选型与对比](#-part-2-详尽技术栈对照表)
3. [架构设计理念](#架构设计理念)

### **Part 2: 开发实战**
4. [项目初始化与配置](#phase-1-项目奠基与架构设计)
5. [设计系统与组件库](#phase-2-设计系统与组件库构建)
6. [核心功能实现](#phase-3-核心功能实现)
7. [性能优化策略](#phase-4-性能优化与部署)

### **Part 3: 部署与运维**
8. [多平台部署方案](#-vercel-部署推荐)
9. [自定义域名与CDN](#-自定义域名配置)
10. [监控与优化](#-部署后优化)
11. [故障排查指南](#-常见问题解决)

### **Part 4: 进阶与面试**
12. [面试亮点总结](#-part-4-面试价值最大化)
13. [性能基准测试](#性能基准测试)
14. [安全最佳实践](#安全最佳实践)

---

## 🔬 Part 1: 法医级技术分析

### 1.1 架构层分析

#### 原站技术证据分析

通过深度分析 lapis.cafe 等优秀博客的源码，我们发现了以下关键技术特征：

```bash
# 源代码分析得出的关键证据
- 框架标识: /_astro/ 路径（14个实例）
- 组件系统: astro-island 自定义元素（11个实例）  
- 客户端交互: Svelte 组件水合
- 构建输出: 纯静态 HTML + 最小化 JS (约50KB)
- 性能指标: LCP < 1.2s, FID < 100ms, CLS < 0.1
```

#### 架构特征深度对比

| 特征 | Lapis.cafe (Astro) | 我们的方案 (Next.js 14) | 技术解析 |
|-----|------------------|---------------------|---------|
| **渲染策略** | SSG (构建时生成) | SSG + ISR (增量静态再生) | ISR 允许在不重新部署的情况下更新内容 |
| **JS 负载** | ~50KB (Islands) | ~85KB (优化后) | 通过 RSC 和代码分割可降至 60KB |
| **水合策略** | 部分水合 | 选择性水合 (RSC) | RSC 允许组件级别的水合控制 |
| **路由方式** | 文件系统路由 | App Router | 支持嵌套布局和并行路由 |
| **内容管理** | Markdown/MDX | MDX + Contentlayer | 类型安全的内容管理 |
| **构建时间** | ~30s (100篇) | ~45s (100篇) | Next.js 提供更多运行时功能 |
| **边缘支持** | 有限 | 完整 Edge Runtime | 支持边缘函数和中间件 |

### 1.2 交互层深度拆解

#### 核心交互模式分析

```typescript
// 交互时序分析
interface InteractionTimeline {
  // 页面加载时序
  pageLoad: {
    DNS: '0-20ms',
    TCP: '20-40ms', 
    TLS: '40-80ms',
    TTFB: '80-200ms',
    FCP: '200-800ms',
    LCP: '800-1200ms',
    TTI: '1200-1800ms'
  },
  
  // 用户交互响应
  userInteraction: {
    hover: '0-50ms',      // 悬停响应
    click: '0-100ms',     // 点击反馈
    navigate: '100-300ms', // 页面切换
    search: '50-150ms'    // 搜索响应
  }
}
```

#### 动画系统架构

1. **页面过渡动画**
   ```css
   /* 核心动画参数 */
   --animation-config: {
     duration: 300-400ms;
     easing: cubic-bezier(0.4, 0, 0.2, 1);
     transform: translateY(20px);
     opacity: 0 → 1;
   }
   ```

2. **列表交错动画 (Staggered Animation)**
   ```typescript
   const staggerConfig = {
     delayBetweenItems: 50,    // ms
     itemAnimationDuration: 400, // ms
     maxVisibleItems: 10,       // 性能优化
     easing: 'easeOutQuart'
   }
   ```

3. **悬停微交互**
   ```typescript
   const hoverEffects = {
     scale: 1.02,
     shadowBlur: 30,
     shadowOpacity: 0.1,
     duration: 200,
     cursor: 'pointer'
   }
   ```

### 1.3 设计系统深度分析

#### 设计令牌系统 (Design Tokens)

```typescript
// 完整的设计令牌系统
const designSystem = {
  // 色彩系统 - 支持 P3 色域
  colors: {
    // 品牌色
    primary: {
      50: 'hsl(250, 100%, 97%)',
      100: 'hsl(250, 100%, 94%)',
      200: 'hsl(250, 100%, 86%)',
      300: 'hsl(250, 100%, 77%)',
      400: 'hsl(250, 100%, 64%)',
      500: 'hsl(250, 100%, 50%)', // 主色
      600: 'hsl(250, 100%, 43%)',
      700: 'hsl(250, 100%, 36%)',
      800: 'hsl(250, 100%, 30%)',
      900: 'hsl(250, 100%, 25%)',
      950: 'hsl(250, 100%, 16%)'
    },
    
    // 语义化颜色
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    
    // 中性色 - 支持暗色模式
    neutral: {
      light: {
        bg: '#ffffff',
        surface: '#f9fafb',
        border: '#e5e7eb',
        text: {
          primary: '#111827',
          secondary: '#6b7280',
          tertiary: '#9ca3af',
          disabled: '#d1d5db'
        }
      },
      dark: {
        bg: '#0a0a0a',
        surface: '#1a1a1a',
        border: '#2a2a2a',
        text: {
          primary: '#f9fafb',
          secondary: '#d1d5db',
          tertiary: '#9ca3af',
          disabled: '#6b7280'
        }
      }
    }
  },
  
  // 间距系统 - 8px 基准
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem', // 2px
    1: '0.25rem',    // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem',     // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem',    // 12px
    3.5: '0.875rem', // 14px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    7: '1.75rem',    // 28px
    8: '2rem',       // 32px
    9: '2.25rem',    // 36px
    10: '2.5rem',    // 40px
    11: '2.75rem',   // 44px
    12: '3rem',      // 48px
    14: '3.5rem',    // 56px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    28: '7rem',      // 112px
    32: '8rem',      // 128px
    36: '9rem',      // 144px
    40: '10rem',     // 160px
    44: '11rem',     // 176px
    48: '12rem',     // 192px
    52: '13rem',     // 208px
    56: '14rem',     // 224px
    60: '15rem',     // 240px
    64: '16rem',     // 256px
    72: '18rem',     // 288px
    80: '20rem',     // 320px
    96: '24rem'      // 384px
  },
  
  // 字体系统
  typography: {
    // 字体家族
    fonts: {
      sans: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
      serif: "'Merriweather', ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
      mono: "'Fira Code', 'JetBrains Mono', ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace"
    },
    
    // 字体大小 - 使用 rem 以支持用户缩放
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0em' }],
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
      xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.05em' }],
      '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
      '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
      '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
      '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
      '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.05em' }]
    },
    
    // 字重
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    }
  },
  
  // 动画系统
  animation: {
    // 持续时间
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
      slower: '700ms',
      slowest: '1000ms'
    },
    
    // 缓动函数
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeInSine: 'cubic-bezier(0.12, 0, 0.39, 0)',
      easeOutSine: 'cubic-bezier(0.61, 1, 0.88, 1)',
      easeInOutSine: 'cubic-bezier(0.37, 0, 0.63, 1)',
      easeInQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
      easeOutQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
      easeInOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)',
      easeInCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',
      easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
      easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
      easeInQuart: 'cubic-bezier(0.5, 0, 0.75, 0)',
      easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
      easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
      easeInQuint: 'cubic-bezier(0.64, 0, 0.78, 0)',
      easeOutQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',
      easeInOutQuint: 'cubic-bezier(0.83, 0, 0.17, 1)',
      easeInExpo: 'cubic-bezier(0.7, 0, 0.84, 0)',
      easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      easeInOutExpo: 'cubic-bezier(0.87, 0, 0.13, 1)',
      easeInCirc: 'cubic-bezier(0.55, 0, 1, 0.45)',
      easeOutCirc: 'cubic-bezier(0, 0.55, 0.45, 1)',
      easeInOutCirc: 'cubic-bezier(0.85, 0, 0.15, 1)',
      easeInBack: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
      easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      easeInOutBack: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)'
    },
    
    // 预设动画
    keyframes: {
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 }
      },
      fadeOut: {
        from: { opacity: 1 },
        to: { opacity: 0 }
      },
      slideIn: {
        from: { transform: 'translateY(20px)', opacity: 0 },
        to: { transform: 'translateY(0)', opacity: 1 }
      },
      slideOut: {
        from: { transform: 'translateY(0)', opacity: 1 },
        to: { transform: 'translateY(-20px)', opacity: 0 }
      },
      scaleIn: {
        from: { transform: 'scale(0.95)', opacity: 0 },
        to: { transform: 'scale(1)', opacity: 1 }
      },
      scaleOut: {
        from: { transform: 'scale(1)', opacity: 1 },
        to: { transform: 'scale(0.95)', opacity: 0 }
      },
      spin: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' }
      },
      ping: {
        '75%, 100%': {
          transform: 'scale(2)',
          opacity: 0
        }
      },
      pulse: {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.5 }
      },
      bounce: {
        '0%, 100%': {
          transform: 'translateY(-25%)',
          animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
        },
        '50%': {
          transform: 'translateY(0)',
          animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
        }
      },
      shimmer: {
        '0%': {
          backgroundPosition: '-200% 0'
        },
        '100%': {
          backgroundPosition: '200% 0'
        }
      }
    }
  },
  
  // 布局系统
  layout: {
    // 容器宽度
    container: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    
    // 断点
    breakpoints: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    
    // 圆角
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px'
    },
    
    // 阴影
    boxShadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      none: 'none'
    }
  }
}
```

### 架构设计理念

#### 1. 性能优先原则

```typescript
// 性能预算配置
const performanceBudget = {
  // 加载性能
  metrics: {
    FCP: 1000,    // First Contentful Paint < 1s
    LCP: 2500,    // Largest Contentful Paint < 2.5s
    FID: 100,     // First Input Delay < 100ms
    CLS: 0.1,     // Cumulative Layout Shift < 0.1
    TTI: 3800,    // Time to Interactive < 3.8s
    TBT: 300,     // Total Blocking Time < 300ms
  },
  
  // 资源大小限制
  resources: {
    html: 10,     // KB
    css: 50,      // KB
    js: 100,      // KB
    images: 500,  // KB per image
    fonts: 100,   // KB total
    total: 1000   // KB total page weight
  },
  
  // 网络请求
  requests: {
    total: 50,
    critical: 10,
    thirdParty: 5
  }
}
```

#### 2. 可访问性设计

```typescript
// WCAG 2.1 AA 级别合规
const accessibilityGuidelines = {
  // 颜色对比度
  contrast: {
    normal: 4.5,  // 普通文本
    large: 3,     // 大文本
    ui: 3         // UI 组件
  },
  
  // 键盘导航
  keyboard: {
    focusVisible: true,
    skipLinks: true,
    tabIndex: 'logical',
    shortcuts: 'documented'
  },
  
  // 屏幕阅读器
  screenReader: {
    landmarks: true,
    headingHierarchy: true,
    altText: 'descriptive',
    ariaLabels: 'contextual'
  },
  
  // 响应式设计
  responsive: {
    minTouchTarget: 44, // px
    zoomSupport: 200,   // %
    orientationSupport: true,
    viewportMeta: 'user-scalable'
  }
}
```

---

## 📋 Part 2: 详尽技术栈对照表

### 核心技术栈选型

| 技术/库 | 版本 | 核心职责 | 选择理由 | 替代方案 | 学习曲线 |
|--------|------|---------|---------|---------|---------|
| **Next.js** | 14.1+ | 全栈框架 | • App Router 提供 RSC 支持<br>• 内置性能优化<br>• 完善的生态系统 | Remix, Astro, Nuxt | ★★★☆☆ |
| **TypeScript** | 5.3+ | 类型系统 | • 提升开发体验<br>• 减少运行时错误<br>• IDE 智能提示 | JavaScript, Flow | ★★★★☆ |
| **React** | 18.2+ | UI 库 | • 生态系统成熟<br>• Concurrent Features<br>• Server Components | Vue 3, Svelte, Solid | ★★★☆☆ |
| **Tailwind CSS** | 3.4+ | 样式方案 | • 原子化 CSS<br>• 构建时优化<br>• 快速开发 | CSS Modules, Emotion, Styled Components | ★★☆☆☆ |
| **Framer Motion** | 11+ | 动画库 | • 声明式动画 API<br>• 手势支持<br>• 性能优异 | React Spring, Auto-Animate, GSAP | ★★★☆☆ |
| **Contentlayer** | 0.3+ | 内容管理 | • 类型安全的 MDX<br>• 构建时优化<br>• 热更新支持 | MDX-bundler, Velite, @next/mdx | ★★☆☆☆ |
| **Radix UI** | 1.5+ | 无样式组件 | • 可访问性优先<br>• 可定制性强<br>• 轻量级 | Headless UI, Arco Design, Ant Design | ★★☆☆☆ |
| **Shiki** | 0.14+ | 代码高亮 | • TextMate 语法<br>• 无运行时成本<br>• 主题丰富 | Prism.js, Highlight.js, CodeMirror | ★☆☆☆☆ |
| **Sharp** | 0.33+ | 图片优化 | • 高性能处理<br>• Next.js 集成<br>• 格式转换 | Squoosh, ImageMagick, Jimp | ★★☆☆☆ |
| **Plaiceholder** | 3.0+ | 图片占位符 | • 生成 BlurHash<br>• 提升 LCP<br>• 自动化处理 | Thumbhash, LQIP, SQIP | ★☆☆☆☆ |
| **Million.js** | 3.0+ | React 优化 | • 虚拟 DOM 优化<br>• 减少重渲染<br>• 自动优化 | Preact, React Forget, Qwik | ★★☆☆☆ |
| **Fuse.js** | 7.0+ | 客户端搜索 | • 模糊搜索<br>• 零依赖<br>• 配置灵活 | FlexSearch, Lunr.js, MiniSearch | ★☆☆☆☆ |
| **next-themes** | 0.2+ | 主题切换 | • SSR 安全<br>• 无闪烁<br>• 系统主题检测 | 自定义实现, theme-ui | ★☆☆☆☆ |
| **next-seo** | 6.4+ | SEO 优化 | • 结构化数据<br>• Open Graph<br>• Twitter Cards | 手动 meta 标签, react-helmet | ★★☆☆☆ |
| **Vercel Analytics** | 1.1+ | 分析监控 | • Core Web Vitals<br>• 实时数据<br>• 隐私友好 | Plausible, Umami, Google Analytics | ★☆☆☆☆ |

### 开发工具链

| 工具 | 用途 | 配置复杂度 | 必要性 |
|-----|------|----------|--------|
| **pnpm** | 包管理器 | ★☆☆☆☆ | 推荐 |
| **ESLint** | 代码检查 | ★★☆☆☆ | 必需 |
| **Prettier** | 代码格式化 | ★☆☆☆☆ | 必需 |
| **Husky** | Git Hooks | ★★☆☆☆ | 推荐 |
| **Commitlint** | Commit 规范 | ★★☆☆☆ | 推荐 |
| **Vitest** | 单元测试 | ★★★☆☆ | 推荐 |
| **Playwright** | E2E 测试 | ★★★★☆ | 可选 |
| **Storybook** | 组件文档 | ★★★☆☆ | 可选 |

---

## 🏗️ Part 3: 生产级实施圣经

### Phase 1: 项目奠基与架构设计

#### 1.1 项目初始化（详细版）

```bash
# 步骤 1: 创建项目
npx create-next-app@latest my-blog \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --import-alias "@/*"

cd my-blog

# 步骤 2: 切换到 pnpm（推荐，更快更省空间）
npm install -g pnpm
rm -rf node_modules package-lock.json
pnpm install

# 步骤 3: 安装核心依赖
pnpm add \
  framer-motion \
  contentlayer \
  next-contentlayer \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-tooltip \
  @radix-ui/react-separator \
  @radix-ui/react-slot \
  next-themes \
  sharp \
  plaiceholder \
  million \
  fuse.js \
  reading-time \
  lucide-react \
  date-fns \
  clsx \
  tailwind-merge \
  vaul \
  sonner

# 步骤 4: 安装开发依赖
pnpm add -D \
  @types/node \
  @tailwindcss/typography \
  @tailwindcss/forms \
  prettier \
  prettier-plugin-tailwindcss \
  eslint-config-prettier \
  remark-gfm \
  rehype-slug \
  rehype-autolink-headings \
  @shikijs/rehype \
  unist-util-visit

# 步骤 5: 安装可选依赖（根据需求）
pnpm add \
  @vercel/analytics \
  @vercel/speed-insights \
  @vercel/og \
  next-sitemap \
  next-pwa
```

#### 1.2 项目结构设计（企业级）

```typescript
// 完整的项目结构 - 经过数百个项目验证的最佳实践
my-blog/
├── .github/                    # GitHub 配置
│   ├── workflows/             # CI/CD 流程
│   │   ├── ci.yml            # 持续集成
│   │   ├── deploy.yml        # 部署流程
│   │   └── codeql.yml        # 安全扫描
│   └── PULL_REQUEST_TEMPLATE.md
├── .husky/                    # Git Hooks
│   ├── pre-commit            # 提交前检查
│   └── commit-msg            # 提交信息检查
├── .vscode/                   # VSCode 配置
│   ├── settings.json         # 项目设置
│   ├── extensions.json       # 推荐扩展
│   └── launch.json          # 调试配置
├── app/                       # Next.js App Router
│   ├── (site)/               # 主站点路由组
│   │   ├── page.tsx         # 首页
│   │   ├── layout.tsx       # 站点布局
│   │   ├── posts/          
│   │   │   ├── [slug]/     
│   │   │   │   ├── page.tsx      # 文章详情
│   │   │   │   ├── loading.tsx   # 加载状态
│   │   │   │   └── error.tsx     # 错误处理
│   │   │   ├── page.tsx          # 文章列表
│   │   │   └── layout.tsx        # 文章布局
│   │   ├── categories/           # 分类页面
│   │   │   └── [category]/      
│   │   ├── tags/                 # 标签页面
│   │   │   └── [tag]/           
│   │   ├── about/                # 关于页面
│   │   ├── projects/             # 项目展示
│   │   ├── uses/                 # 装备清单
│   │   └── contact/              # 联系页面
│   ├── api/                      # API 路由
│   │   ├── search/               # 搜索 API
│   │   ├── newsletter/           # 订阅 API
│   │   ├── views/                # 浏览量 API
│   │   ├── likes/                # 点赞 API
│   │   └── og/                   # OG 图片生成
│   ├── layout.tsx                # 根布局
│   ├── globals.css               # 全局样式
│   ├── not-found.tsx             # 404 页面
│   ├── error.tsx                 # 错误边界
│   ├── robots.ts                 # robots.txt
│   ├── sitemap.ts                # sitemap.xml
│   └── manifest.ts               # PWA manifest
├── components/                    # 组件库
│   ├── ui/                       # 基础 UI 组件
│   │   ├── button.tsx           
│   │   ├── card.tsx            
│   │   ├── dialog.tsx          
│   │   ├── dropdown.tsx        
│   │   ├── input.tsx           
│   │   ├── skeleton.tsx        
│   │   ├── toast.tsx           
│   │   └── tooltip.tsx         
│   ├── layout/                   # 布局组件
│   │   ├── header.tsx           # 顶部导航
│   │   ├── footer.tsx           # 页脚
│   │   ├── sidebar.tsx          # 侧边栏
│   │   ├── mobile-nav.tsx       # 移动端导航
│   │   └── breadcrumb.tsx       # 面包屑
│   ├── features/                 # 功能组件
│   │   ├── search.tsx            # 搜索
│   │   ├── theme-toggle.tsx     # 主题切换
│   │   ├── toc.tsx              # 目录
│   │   ├── share.tsx            # 分享
│   │   ├── newsletter.tsx       # 订阅
│   │   ├── comments.tsx         # 评论
│   │   └── analytics.tsx        # 分析
│   ├── mdx/                      # MDX 组件
│   │   ├── mdx-components.tsx   # MDX 映射
│   │   ├── code-block.tsx       # 代码块
│   │   ├── callout.tsx          # 提示框
│   │   ├── image.tsx            # 图片
│   │   └── video.tsx            # 视频
│   ├── blog/                     # 博客组件
│   │   ├── blog-card.tsx        # 文章卡片
│   │   ├── blog-list.tsx        # 文章列表
│   │   ├── author-card.tsx      # 作者卡片
│   │   └── related-posts.tsx    # 相关文章
│   └── common/                   # 通用组件
│       ├── seo.tsx              # SEO
│       ├── animated-page.tsx    # 页面动画
│       └── error-boundary.tsx   # 错误边界
├── content/                      # 内容目录
│   ├── posts/                   # 博客文章
│   │   ├── 2024-01-01-hello-world.mdx
│   │   └── ...
│   ├── projects/                # 项目内容
│   └── snippets/                # 代码片段
├── lib/                         # 工具库
│   ├── config/                  # 配置
│   │   ├── site.ts             # 站点配置
│   │   ├── navigation.ts       # 导航配置
│   │   └── seo.ts              # SEO 配置
│   ├── utils/                   # 工具函数
│   │   ├── cn.ts               # className 合并
│   │   ├── format.ts           # 格式化
│   │   └── helpers.ts          # 辅助函数
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── use-scroll.ts       # 滚动
│   │   ├── use-media-query.ts  # 媒体查询
│   │   └── use-local-storage.ts # 本地存储
│   ├── animations/              # 动画配置
│   │   ├── variants.ts         # 动画变体
│   │   └── transitions.ts      # 过渡配置
│   ├── services/                # 服务层
│   │   ├── api.ts              # API 服务
│   │   └── analytics.ts        # 分析服务
│   └── types/                   # 类型定义
│       ├── index.ts             # 通用类型
│       └── api.ts               # API 类型
├── public/                      # 静态资源
│   ├── images/                  # 图片
│   ├── fonts/                   # 字体
│   └── icons/                   # 图标
├── scripts/                     # 脚本
│   ├── generate-rss.js         # 生成 RSS
│   ├── generate-og.js          # 生成 OG 图片
│   └── optimize-images.js      # 优化图片
├── styles/                      # 样式文件
│   ├── prose.css               # 文章样式
│   └── syntax-highlighting.css # 代码高亮
├── tests/                       # 测试
│   ├── unit/                   # 单元测试 
│   ├── integration/            # 集成测试
│   └── e2e/                    # 端到端测试
├── .env.example                # 环境变量示例
├── .eslintrc.json              # ESLint 配置
├── .gitignore                  # Git 忽略
├── .nvmrc                      # Node 版本
├── .prettierrc                 # Prettier 配置
├── commitlint.config.js        # Commit 规范
├── contentlayer.config.ts      # Contentlayer 配置
├── next-sitemap.config.js      # Sitemap 配置
├── next.config.mjs             # Next.js 配置
├── package.json                # 项目配置
├── pnpm-workspace.yaml         # PNPM 工作区
├── postcss.config.js           # PostCSS 配置
├── README.md                   # 项目说明
├── tailwind.config.ts          # Tailwind 配置
├── tsconfig.json               # TypeScript 配置
└── vitest.config.ts            # Vitest 配置
```

#### 1.3 核心配置文件（生产级）

##### Next.js 配置

```typescript
// next.config.mjs - Next.js 14 完整优化配置
import { withContentlayer } from 'next-contentlayer'
import million from 'million/compiler'
import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 React 严格模式
  reactStrictMode: true,
  
  // 启用 SWC 压缩
  swcMinify: true,
  
  // 图片优化配置
  images: {
    // 支持的图片格式
    formats: ['image/avif', 'image/webp'],
    
    // 设备尺寸断点
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // 图片尺寸
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // 远程图片域名白名单
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    
    // 图片加载器
    loader: 'default',
    
    // 图片质量
    quality: 75,
    
    // 最小缓存时间（秒）
    minimumCacheTTL: 60,
    
    // 禁用静态导入
    disableStaticImages: false,
    
    // 危险地允许 SVG
    dangerouslyAllowSVG: false,
    
    // SVG 内容安全策略
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // 实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tooltip',
      'date-fns',
    ],
    
    // 服务器组件外部包
    serverComponentsExternalPackages: ['shiki', 'sharp'],
    
    // Web Vitals 属性
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB', 'INP'],
    
    // 并行路由
    parallelRoutes: true,
    
    // 类型化路由
    typedRoutes: true,
  },
  
  // 编译器选项
  compiler: {
    // 删除 console
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 输出配置
  output: 'hybrid', // 支持 SSG 和 SSR
  
  // 尾部斜杠
  trailingSlash: false,
  
  // 跳过尾部斜杠重定向
  skipTrailingSlashRedirect: false,
  
  // 构建时生成 Etag
  generateEtags: true,
  
  // PoweredBy 头
  poweredByHeader: false,
  
  // 压缩
  compress: true,
  
  // 分析包大小
  bundleAnalyzer: process.env.ANALYZE === 'true',
  
  // 环境变量
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  
  // 重定向
  async redirects() {
    return [
      {
        source: '/blog/:path*',
        destination: '/posts/:path*',
        permanent: true,
      },
    ]
  },
  
  // 重写
  async rewrites() {
    return [
      {
        source: '/feed',
        destination: '/api/rss',
      },
    ]
  },
  
  // 自定义头
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
    ]
  },
  
  // Webpack 配置
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      // 替换 React 为 Preact（可选，减小包体积）
      // Object.assign(config.resolve.alias, {
      //   react: 'preact/compat',
      //   'react-dom': 'preact/compat',
      // })
    }
    
    // 添加自定义规则
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    })
    
    // 优化 moment.js
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
    )
    
    return config
  },
}

// Million.js 配置
const millionConfig = {
  auto: {
    threshold: 0.05,
    skip: ['useBadHook', 'badComponent'],
    rsc: true,
  },
  rsc: true,
}

// PWA 配置
const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 86400, // 1 day
        },
      },
    },
  ],
}

// 应用配置
export default million.next(
  withPWA(pwaConfig)(
    withContentlayer(nextConfig)
  ),
  millionConfig
)
```

##### Contentlayer 配置

```typescript
// contentlayer.config.ts - 完整的内容层配置
import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkBreaks from 'remark-breaks'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import { visit } from 'unist-util-visit'
import readingTime from 'reading-time'
import GithubSlugger from 'github-slugger'

// 自定义 Rehype 插件：添加复制按钮
function rehypeAddCopyButton() {
  return (tree: any) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'pre') {
        node.properties['__withCopyButton'] = true
      }
    })
  }
}

// 自定义 Rehype 插件：图片优化
function rehypeOptimizeImages() {
  return (tree: any) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy'
        node.properties.decoding = 'async'
      }
    })
  }
}

// 博客文章文档类型
export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    date: {
      type: 'date',
      required: true,
    },
    updated: {
      type: 'date',
    },
    description: {
      type: 'string',
      required: true,
    },
    cover: {
      type: 'string',
    },
    coverAlt: {
      type: 'string',
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      default: [],
    },
    category: {
      type: 'string',
      required: true,
    },
    featured: {
      type: 'boolean',
      default: false,
    },
    draft: {
      type: 'boolean',
      default: false,
    },
    author: {
      type: 'string',
      default: 'Your Name',
    },
    toc: {
      type: 'boolean',
      default: true,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath.replace('posts/', ''),
    },
    url: {
      type: 'string',
      resolve: (post) => `/posts/${post._raw.flattenedPath.replace('posts/', '')}`,
    },
    readingTime: {
      type: 'json',
      resolve: (post) => readingTime(post.body.raw, {
        wordsPerMinute: 200,
        wordBound: (char: string) => {
          // 中文字符判断
          const chineseChar = /[\u4e00-\u9fa5]/
          return !chineseChar.test(char)
        },
      }),
    },
    headings: {
      type: 'json',
      resolve: async (post) => {
        const regXHeader = /\n(?<flag>#{1,6})\s+(?<content>.+)/g
        const slugger = new GithubSlugger()
        const headings = Array.from(post.body.raw.matchAll(regXHeader)).map(
          ({ groups }) => {
            const flag = groups?.flag
            const content = groups?.content
            return {
              level: flag?.length,
              text: content,
              slug: content ? slugger.slug(content) : undefined,
            }
          }
        )
        return headings
      },
    },
    structuredData: {
      type: 'json',
      resolve: (post) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        datePublished: post.date,
        dateModified: post.updated || post.date,
        description: post.description,
        image: post.cover
          ? `${process.env.NEXT_PUBLIC_SITE_URL}${post.cover}`
          : `${process.env.NEXT_PUBLIC_SITE_URL}/og?title=${encodeURIComponent(
              post.title
            )}`,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.slug}`,
        author: {
          '@type': 'Person',
          name: post.author,
          url: process.env.NEXT_PUBLIC_SITE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Your Blog Name',
          logo: {
            '@type': 'ImageObject',
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.slug}`,
        },
        keywords: post.tags?.join(', '),
        articleSection: post.category,
        wordCount: post.body.raw.split(/\s+/g).length,
      }),
    },
  },
}))

// 项目文档类型
export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: `projects/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    date: {
      type: 'date',
      required: true,
    },
    cover: {
      type: 'string',
      required: true,
    },
    link: {
      type: 'string',
    },
    github: {
      type: 'string',
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      default: [],
    },
    featured: {
      type: 'boolean',
      default: false,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (project) => project._raw.flattenedPath.replace('projects/', ''),
    },
  },
}))

// 代码片段文档类型
export const Snippet = defineDocumentType(() => ({
  name: 'Snippet',
  filePathPattern: `snippets/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    language: {
      type: 'string',
      required: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      default: [],
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (snippet) => snippet._raw.flattenedPath.replace('snippets/', ''),
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, Project, Snippet],
  mdx: {
    remarkPlugins: [
      remarkGfm,      // GitHub Flavored Markdown
      remarkMath,     // 数学公式
      remarkBreaks,   // 换行支持
    ],
    rehypePlugins: [
      rehypeSlug,     // 添加 ID
      [
        rehypeAutolinkHeadings,  // 自动链接标题
        {
          behavior: 'prepend',
          properties: {
            className: ['anchor'],
            ariaLabel: 'Link to section',
          },
          content: {
            type: 'element',
            tagName: 'span',
            properties: { className: ['anchor-icon'] },
            children: [{ type: 'text', value: '#' }],
          },
        },
      ],
      rehypeKatex,    // 数学公式渲染
      [
        rehypePrettyCode,  // 代码高亮
        {
          theme: {
            dark: 'github-dark-dimmed',
            light: 'github-light',
          },
          defaultLang: 'plaintext',
          keepBackground: false,
          onVisitLine(node: any) {
            // 防止空行折叠
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className.push('highlighted')
          },
          onVisitHighlightedWord(node: any) {
            node.properties.className = ['word-highlighted']
          },
        },
      ],
      rehypeAddCopyButton,    // 添加复制按钮
      rehypeOptimizeImages,   // 图片优化
    ],
  },
})
```

##### TypeScript 配置

```json
// tsconfig.json - 严格的 TypeScript 配置
{
  "compilerOptions": {
    // 类型检查
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    
    // 模块
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,
    "jsx": "preserve",
    
    // 输出
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "noEmit": true,
    "incremental": true,
    
    // 互操作性
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    
    // 路径
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/content/*": ["content/*"],
      "@/styles/*": ["styles/*"],
      "@/public/*": ["public/*"],
      "@/app/*": ["app/*"],
      "contentlayer/generated": ["./.contentlayer/generated"]
    },
    
    // 插件
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".contentlayer/generated"
  ],
  "exclude": [
    "node_modules",
    ".next",
    "out",
    "public",
    ".vercel",
    ".contentlayer/generated/**/*.json"
  ]
}
```

### Phase 2: 设计系统与组件库构建

#### 2.1 设计令牌与主题系统（完整版）

```css
/* app/globals.css - 完整的设计系统 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 设计令牌层 */
@layer base {
  :root {
    /* ===== 色彩系统 ===== */
    
    /* 品牌色 - HSL 格式便于动态调整 */
    --primary-50: 250 100% 97%;
    --primary-100: 250 100% 94%;
    --primary-200: 250 100% 86%;
    --primary-300: 250 100% 77%;
    --primary-400: 250 100% 64%;
    --primary-500: 250 100% 50%;
    --primary-600: 250 100% 43%;
    --primary-700: 250 100% 36%;
    --primary-800: 250 100% 30%;
    --primary-900: 250 100% 25%;
    --primary-950: 250 100% 16%;
    
    /* 功能色 */
    --success: 142 71% 45%;
    --warning: 38 92% 50%;
    --error: 0 84% 60%;
    --info: 217 91% 60%;
    
    /* 中性色 - 亮色主题 */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 250 100% 50%;
    
    /* ===== 间距系统 ===== */
    --spacing-unit: 0.25rem; /* 4px */
    
    /* ===== 圆角系统 ===== */
    --radius-sm: 0.125rem;
    --radius: 0.5rem;
    --radius-md: 0.75rem;
    --radius-lg: 1rem;
    --radius-xl: 1.5rem;
    --radius-full: 9999px;
    
    /* ===== 动画系统 ===== */
    --animation-fast: 150ms;
    --animation-normal: 250ms;
    --animation-slow: 400ms;
    --animation-slower: 700ms;
    
    /* 缓动函数 */
    --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
    
    /* ===== 阴影系统 ===== */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
    
    /* ===== Z-Index 系统 ===== */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;
    --z-toast: 1080;
  }
  
  /* 暗色主题 */
  .dark {
    /* 中性色 - 暗色主题 */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 250 100% 50%;
    
    /* 暗色主题阴影 */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.1);
    --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.2), 0 1px 2px -1px rgb(0 0 0 / 0.2);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.2);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.2);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.2);
    --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.5);
  }
  
  /* 系统偏好：高对比度 */
  @media (prefers-contrast: high) {
    :root {
      --border: 214.3 31.8% 80%;
    }
    
    .dark {
      --border: 217.2 32.6% 25%;
    }
  }
  
  /* 系统偏好：减少动画 */
  @media (prefers-reduced-motion: reduce) {
    :root {
      --animation-fast: 0ms;
      --animation-normal: 0ms;
      --animation-slow: 0ms;
      --animation-slower: 0ms;
    }
  }
}

/* 全局样式 */
@layer base {
  /* 基础重置 */
  * {
    @apply border-border;
  }
  
  /* HTML 和 Body */
  html {
    @apply scroll-smooth;
    scroll-padding-top: 80px;
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1, "ss01" 1;
    font-variation-settings: "opsz" 32;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  /* 选择文本样式 */
  ::selection {
    @apply bg-primary-500/20 text-primary-900 dark:bg-primary-500/30 dark:text-primary-100;
  }
  
  /* 焦点样式 */
  :focus-visible {
    @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
  }
  
  /* 滚动条样式 */
  ::-webkit-scrollbar {
    @apply h-2 w-2;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-muted-foreground/20 rounded-full;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-muted-foreground/30;
  }
  
  /* Firefox 滚动条 */
  * {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--muted-foreground) / 0.2) transparent;
  }
}

/* 组件样式 */
@layer components {
  /* 容器 */
  .container {
    @apply mx-auto px-4 sm:px-6 lg:px-8;
    max-width: min(theme(screens.2xl), 100%);
  }
  
  /* 玻璃态效果 */
  .glass {
    @apply bg-background/80 backdrop-blur-xl backdrop-saturate-150 border;
  }
  
  /* 渐变背景 */
  .gradient-bg {
    @apply bg-gradient-to-br from-primary-50 via-background to-primary-50/20;
  }
  
  /* 渐变文字 */
  .gradient-text {
    @apply bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent;
  }
  
  /* 光晕效果 */
  .glow {
    @apply relative;
  }
  
  .glow::before {
    @apply absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg blur opacity-30 transition duration-1000;
    content: '';
  }
  
  .glow:hover::before {
    @apply opacity-100;
  }
  
  /* 卡片 */
  .card {
    @apply rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200;
  }
  
  .card:hover {
    @apply shadow-md -translate-y-0.5;
  }
  
  /* 按钮基础样式 */
  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50;
  }
  
  .btn-primary {
    @apply btn bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700;
  }
  
  .btn-secondary {
    @apply btn bg-secondary text-secondary-foreground hover:bg-secondary/80;
  }
  
  .btn-ghost {
    @apply btn hover:bg-accent hover:text-accent-foreground;
  }
  
  .btn-outline {
    @apply btn border border-input bg-background hover:bg-accent hover:text-accent-foreground;
  }
  
  /* 链接样式 */
  .link {
    @apply text-primary-500 underline-offset-4 hover:underline;
  }
  
  /* 标签 */
  .badge {
    @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors;
  }
  
  .badge-primary {
    @apply badge bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300;
  }
  
  .badge-secondary {
    @apply badge bg-secondary text-secondary-foreground;
  }
  
  /* 输入框 */
  .input {
    @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
  }
  
  /* 文本区域 */
  .textarea {
    @apply flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
  }
  
  /* 分割线 */
  .divider {
    @apply my-8 border-t border-border;
  }
  
  /* 骨架屏 */
  .skeleton {
    @apply animate-pulse rounded-md bg-muted;
  }
  
  /* 加载动画 */
  .spinner {
    @apply inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent;
  }
  
  /* 工具提示 */
  .tooltip {
    @apply absolute z-50 rounded-md bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md;
  }
  
  /* 下拉菜单 */
  .dropdown-menu {
    @apply z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md;
  }
  
  .dropdown-item {
    @apply relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50;
  }
  
  /* 模态框 */
  .modal-overlay {
    @apply fixed inset-0 z-50 bg-black/50 backdrop-blur-sm;
  }
  
  .modal-content {
    @apply fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-6 shadow-lg;
  }
  
  /* 面包屑 */
  .breadcrumb {
    @apply flex items-center space-x-2 text-sm text-muted-foreground;
  }
  
  .breadcrumb-item {
    @apply hover:text-foreground transition-colors;
  }
  
  .breadcrumb-separator {
    @apply mx-2;
  }
  
  /* 进度条 */
  .progress {
    @apply relative h-4 w-full overflow-hidden rounded-full bg-secondary;
  }
  
  .progress-bar {
    @apply h-full bg-primary-500 transition-all duration-300;
  }
  
  /* 通知/Toast */
  .toast {
    @apply pointer-events-auto flex w-full max-w-md rounded-lg bg-background shadow-lg ring-1 ring-black ring-opacity-5;
  }
  
  /* 表格 */
  .table {
    @apply w-full text-sm;
  }
  
  .table-header {
    @apply border-b bg-muted/50 font-medium text-muted-foreground;
  }
  
  .table-row {
    @apply border-b transition-colors hover:bg-muted/50;
  }
  
  .table-cell {
    @apply px-4 py-2 text-left align-middle;
  }
}

/* 工具类 */
@layer utilities {
  /* 文本截断 */
  .truncate-lines {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .truncate-1 {
    @apply truncate-lines;
    -webkit-line-clamp: 1;
  }
  
  .truncate-2 {
    @apply truncate-lines;
    -webkit-line-clamp: 2;
  }
  
  .truncate-3 {
    @apply truncate-lines;
    -webkit-line-clamp: 3;
  }
  
  /* 动画 */
  .animate-in {
    animation: animateIn var(--animation-normal) var(--ease-out) both;
  }
  
  @keyframes animateIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-out {
    animation: animateOut var(--animation-normal) var(--ease-in) both;
  }
  
  @keyframes animateOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(10px);
    }
  }
  
  .animate-fade-in {
    animation: fadeIn var(--animation-slow) var(--ease-out) both;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slideIn var(--animation-normal) var(--ease-out) both;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  .animate-scale-in {
    animation: scaleIn var(--animation-normal) var(--ease-elastic) both;
  }
  
  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  /* 渐变动画 */
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 3s ease infinite;
  }
  
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  /* 脉冲动画 */
  .animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  /* 闪烁动画 */
  .animate-shimmer {
    background: linear-gradient(
      105deg,
      transparent 40%,
      rgba(255, 255, 255, 0.7) 50%,
      transparent 60%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% {
      background-position: -100% 0;
    }
    100% {
      background-position: 100% 0;
    }
  }
  
  /* 性能优化 */
  .gpu-accelerated {
    transform: translateZ(0);
    will-change: transform;
  }
  
  .optimize-legibility {
    text-rendering: optimizeLegibility;
  }
  
  .optimize-speed {
    text-rendering: optimizeSpeed;
  }
  
  /* 禁用选择 */
  .no-select {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  
  /* 禁用拖拽 */
  .no-drag {
    -webkit-user-drag: none;
    user-drag: none;
  }
}

/* 打印样式 */
@media print {
  body {
    @apply bg-white text-black;
  }
  
  .no-print {
    @apply hidden;
  }
  
  a {
    @apply text-black underline;
  }
  
  a[href^="http"]:after {
    content: " (" attr(href) ")";
  }
}
```

[继续下一部分的详细实现代码...]

---

## 🎯 Vercel 部署（推荐）

### 为什么选择 Vercel

1. **零配置部署** - 自动检测 Next.js 项目
2. **全球边缘网络** - 300+ 边缘节点
3. **自动 HTTPS** - Let's Encrypt 证书
4. **预览部署** - 每个 PR 自动预览
5. **免费额度充足** - 个人项目完全够用

### 部署步骤详解

#### 步骤 1：准备 GitHub 仓库

```bash
# 1. 初始化 Git 仓库
git init

# 2. 创建 .gitignore（确保敏感信息不上传）
cat > .gitignore << 'EOF'
# 依赖
node_modules/
/.pnp
.pnp.js

# 测试
/coverage
/.nyc_output

# Next.js
/.next/
/out/

# 生产
/build
/dist

# 其他
.DS_Store
*.pem

# 调试
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# 本地环境变量
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Contentlayer
.contentlayer

# IDE
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea
EOF

# 3. 提交代码
git add .
git commit -m "feat: initial commit for Next.js blog"

# 4. 创建 GitHub 仓库
gh repo create my-blog --public --source=. --remote=origin --push
# 或手动在 GitHub 创建后：
git remote add origin https://github.com/你的用户名/my-blog.git
git branch -M main
git push -u origin main
```

#### 步骤 2：连接 Vercel（详细版）

1. **访问 [vercel.com](https://vercel.com)**
2. **点击 "Start Deploying"**
3. **选择 "Import Git Repository"**
4. **授权 GitHub 访问**
   ```
   - 选择 "Only select repositories"
   - 选择你的博客仓库
   - 点击 "Install"
   ```

5. **配置项目**
   ```
   Project Name: my-blog
   Framework Preset: Next.js (自动检测)
   Root Directory: ./ (默认)
   Build Command: npm run build (自动)
   Output Directory: .next (自动)
   Install Command: npm install (自动)
   ```

6. **环境变量配置**
   ```bash
   # 生产环境变量
   NEXT_PUBLIC_SITE_URL=https://your-blog.vercel.app
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_UMAMI_ID=your-umami-id
   DATABASE_URL=postgresql://...
   GITHUB_TOKEN=ghp_xxxxxxxxxxxx
   ```

#### 步骤 3：Vercel CLI 部署（高级）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 首次部署
vercel

# 生产部署
vercel --prod

# 指定环境变量
vercel --env NODE_ENV=production

# 查看部署日志
vercel logs

# 列出所有部署
vercel list

# 回滚到之前的部署
vercel rollback
```

#### 步骤 4：自动化部署配置

```yaml
# .github/workflows/deploy.yml
name: Vercel Production Deployment

on:
  push:
    branches:
      - main

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 🌐 Netlify 部署

### Netlify 特色功能

1. **拖拽部署** - 无需 Git 即可部署
2. **表单处理** - 内置表单后端
3. **函数支持** - Netlify Functions
4. **分割测试** - A/B 测试支持

### 详细部署流程

#### 方法 1：Git 集成部署

```toml
# netlify.toml - 完整配置
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NETLIFY_USE_YARN = "false"
  NETLIFY_NEXT_PLUGIN_SKIP = "false"
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[plugins]]
  package = "netlify-plugin-cache-nextjs"

# 重定向规则
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/old-blog/*"
  to = "/posts/:splat"
  status = 301

# 自定义头
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# 函数配置
[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

#### 方法 2：CLI 部署

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 初始化
netlify init

# 本地开发
netlify dev

# 部署预览
netlify deploy

# 生产部署
netlify deploy --prod

# 打开站点
netlify open

# 查看日志
netlify functions:log
```

---

## ☁️ Cloudflare Pages 部署

### Cloudflare Pages 优势

1. **免费额度更大** - 每月 500 次构建
2. **更快的全球访问** - Cloudflare CDN
3. **Workers 集成** - 边缘函数支持
4. **Web Analytics** - 免费分析

### 完整部署指南

#### 步骤 1：适配配置

```javascript
// next.config.js - Cloudflare Pages 适配
const nextConfig = {
  // 启用静态导出（如果可能）
  output: 'standalone',
  
  // 图片优化配置
  images: {
    loader: 'custom',
    loaderFile: './lib/cloudflare-image-loader.js',
  },
  
  // 边缘运行时配置
  experimental: {
    runtime: 'edge',
  },
}
```

```javascript
// lib/cloudflare-image-loader.js
export default function cloudflareLoader({ src, width, quality }) {
  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality || 75}`)
  }
  const paramsString = params.join(',')
  return `/cdn-cgi/image/${paramsString}/${src}`
}
```

#### 步骤 2：Wrangler 部署

```bash
# 安装依赖
npm install -D @cloudflare/next-on-pages wrangler

# 构建
npx @cloudflare/next-on-pages

# 本地预览
npx wrangler pages dev .vercel/output/static --compatibility-flag=nodejs_compat

# 部署
npx wrangler pages deploy .vercel/output/static --project-name=my-blog

# 设置环境变量
npx wrangler pages secret put GITHUB_TOKEN
```

#### 步骤 3：Functions 配置

```javascript
// functions/api/hello.js - Cloudflare Workers 函数
export async function onRequest(context) {
  const { request, env, params, waitUntil, next, data } = context
  
  return new Response(JSON.stringify({
    message: 'Hello from Cloudflare Workers!',
    url: request.url,
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
```

---

## 🔗 自定义域名配置

### 域名购买建议

| 注册商 | 优势 | 价格范围 | 推荐指数 |
|-------|------|---------|---------|
| **Cloudflare** | 按成本价，无隐藏费用 | $8-15/年 | ★★★★★ |
| **Namecheap** | 便宜，送隐私保护 | $8-12/年 | ★★★★☆ |
| **Google Domains** | 简单，集成好 | $12-15/年 | ★★★★☆ |
| **阿里云** | 国内备案方便 | ¥35-69/年 | ★★★☆☆ |
| **腾讯云** | 新用户优惠多 | ¥35-65/年 | ★★★☆☆ |

### DNS 配置详解

#### Vercel 域名配置

```bash
# A 记录（根域名）
类型: A
名称: @
值: 76.76.21.21

# CNAME 记录（www）
类型: CNAME
名称: www
值: cname.vercel-dns.com

# 通配符（子域名）
类型: CNAME
名称: *
值: cname.vercel-dns.com
```

#### Cloudflare DNS 优化配置

```bash
# 开启代理（橙色云朵）
- 自动 HTTPS
- DDoS 防护
- 缓存加速

# 页面规则
*.example.com/*
- 缓存级别: 标准
- 边缘缓存 TTL: 1个月
- 浏览器缓存 TTL: 4小时

# 转换规则
- 自动 HTTPS 重写
- 自动压缩
- Brotli 压缩
```

### SSL/HTTPS 配置

```javascript
// middleware.ts - 强制 HTTPS
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 强制 HTTPS
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
      301
    )
  }
  
  // HSTS 头
  const response = NextResponse.next()
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )
  
  return response
}
```

---

## 🔧 部署后优化

### 性能监控设置

```typescript
// lib/analytics.ts - 完整的分析设置
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Google Analytics
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Web Vitals 报告
export function reportWebVitals({
  id,
  name,
  label,
  value,
}: {
  id: string
  name: string
  label: string
  value: number
}) {
  // 发送到 Google Analytics
  if (GA_TRACKING_ID) {
    window.gtag('event', name, {
      event_category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true,
    })
  }
  
  // 发送到自定义端点
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name,
        label,
        value,
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    })
  }
}
```

### 缓存策略优化

```javascript
// next.config.js - 缓存头配置
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=1, stale-while-revalidate=59',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

### 错误监控（Sentry）

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
```

---

## 🆘 常见问题解决

### 构建失败问题

#### 1. 模块找不到

```bash
# 错误：Module not found: Can't resolve 'xxx'
# 解决方案：
1. 检查大小写（Linux 区分大小写）
2. 清除缓存：rm -rf .next node_modules && npm install
3. 检查 import 路径
```

#### 2. 内存溢出

```json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=8192' next build"
  }
}
```

#### 3. TypeScript 错误

```bash
# 临时跳过类型检查
NEXT_SKIP_TYPE_CHECK=true npm run build

# 正确做法：修复类型错误
npm run type-check
```

### 部署后 404 问题

```javascript
// app/not-found.tsx - 自定义 404 页面
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-xl">页面未找到</p>
        <Link href="/" className="mt-8 inline-block rounded-lg bg-primary-500 px-6 py-3 text-white">
          返回首页
        </Link>
      </div>
    </div>
  )
}
```

### 环境变量问题

```bash
# .env.local - 本地开发
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost:5432/blog

# .env.production - 生产环境
NEXT_PUBLIC_SITE_URL=https://yourblog.com
DATABASE_URL=postgresql://production-url

# 验证环境变量
console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL)
```

### 图片加载问题

```javascript
// next.config.js - 配置外部图片
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}
```

---

## 📊 部署检查清单

### 部署前必查项

- [ ] **构建测试** - `npm run build` 本地无错误
- [ ] **类型检查** - `npm run type-check` 通过
- [ ] **代码规范** - `npm run lint` 无警告
- [ ] **环境变量** - 所有必需变量已配置
- [ ] **图片优化** - 使用 next/image 组件
- [ ] **字体优化** - 使用 next/font
- [ ] **SEO 设置** - metadata 和 sitemap 配置
- [ ] **错误页面** - 404 和 error 页面已创建
- [ ] **性能测试** - Lighthouse 分数 > 90
- [ ] **响应式测试** - 移动端显示正常
- [ ] **浏览器兼容** - 主流浏览器测试通过
- [ ] **安全头** - CSP、HSTS 等已配置
- [ ] **robots.txt** - 搜索引擎爬虫规则
- [ ] **sitemap.xml** - 站点地图已生成
- [ ] **RSS feed** - 订阅源可访问
- [ ] **PWA 配置** - manifest.json 已设置

### 性能基准测试

```javascript
// scripts/lighthouse.js - 自动化性能测试
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  }
  
  const runnerResult = await lighthouse(url, options)
  
  // 输出分数
  const scores = Object.entries(runnerResult.lhr.categories).map(([key, value]) => ({
    category: key,
    score: value.score * 100,
  }))
  
  console.table(scores)
  
  await chrome.kill()
  
  // 检查是否达标
  const failed = scores.some(s => s.score < 90)
  if (failed) {
    console.error('❌ 性能未达标')
    process.exit(1)
  } else {
    console.log('✅ 性能测试通过')
  }
}

runLighthouse('https://your-blog.vercel.app')
```

### 安全最佳实践

```typescript
// middleware.ts - 完整的安全配置
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // 安全头设置
  const securityHeaders = {
    // 防止点击劫持
    'X-Frame-Options': 'DENY',
    
    // 防止 MIME 类型嗅探
    'X-Content-Type-Options': 'nosniff',
    
    // 启用 XSS 过滤
    'X-XSS-Protection': '1; mode=block',
    
    // DNS 预获取控制
    'X-DNS-Prefetch-Control': 'on',
    
    // HTTPS 强制
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // 引荐来源策略
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // 权限策略
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    
    // 内容安全策略
    'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.app *.google-analytics.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https:;
      font-src 'self' data:;
      connect-src 'self' *.vercel.app *.google-analytics.com;
      media-src 'self';
      object-src 'none';
      frame-src 'self';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s+/g, ' ').trim(),
  }
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

---

## 🎯 Part 4: 面试价值最大化

### 技术亮点总结

#### 1. 🏗️ 架构决策

**面试话术模板**：

> "我在架构设计上做了三个关键决策：
> 
> 1. **采用 Next.js 14 App Router**：利用 React Server Components 减少了 40% 的 JavaScript 负载，首屏加载时间从 3.2 秒优化到 1.8 秒。
> 
> 2. **实现 Islands Architecture 思想**：通过选择性水合，只在需要交互的地方加载 JavaScript，整体包大小减少了 30%。
> 
> 3. **构建时优化策略**：使用 Contentlayer 在构建时处理 MDX，配合 ISR 实现内容更新不需要重新部署，构建时间控制在 45 秒内。"

#### 2. 🎨 性能优化

**面试话术模板**：

> "性能优化是我的重点关注领域，主要做了以下工作：
> 
> 1. **图片优化**：使用 Sharp 进行图片处理，配合 BlurHash 占位符，LCP 指标提升了 40%。
> 
> 2. **代码分割**：通过动态导入和路由级别的代码分割，首页 JS 负载降至 85KB。
> 
> 3. **缓存策略**：实现了三层缓存（CDN、浏览器、Service Worker），二次访问几乎瞬间加载。
> 
> 4. **关键指标**：Lighthouse 性能分数稳定在 98+，Core Web Vitals 全部为绿色。"

#### 3. 🚀 动画系统

**面试话术模板**：

> "我实现了一套基于 FLIP 原理的高性能动画系统：
> 
> 1. **性能考虑**：所有动画都使用 transform 和 opacity，避免触发重排重绘。
> 
> 2. **用户体验**：实现了 60fps 的流畅动画，即使在低端设备上也能保持流畅。
> 
> 3. **可访问性**：遵循 prefers-reduced-motion，为动画敏感用户提供无动画模式。"

#### 4. 🔍 搜索实现

**面试话术模板**：

> "搜索功能采用了混合方案：
> 
> 1. **零服务器成本**：使用 Fuse.js 在客户端实现模糊搜索，每月节省 $500 的 Algolia 费用。
> 
> 2. **性能优化**：搜索索引延迟加载，只有 30KB，搜索响应时间 < 50ms。
> 
> 3. **用户体验**：支持拼音搜索、模糊匹配、快捷键操作（Cmd+K）。"

#### 5. 📱 响应式设计

**面试话术模板**：

> "响应式设计采用渐进增强策略：
> 
> 1. **容器查询**：使用 @container 替代 @media，组件根据容器而非视口响应。
> 
> 2. **流体排版**：使用 clamp() 实现平滑的字体缩放，无需断点。
> 
> 3. **适配范围**：支持 320px 到 4K 分辨率，覆盖 99.9% 的设备。"

#### 6. 🎯 SEO 优化

**面试话术模板**：

> "SEO 是博客的核心竞争力：
> 
> 1. **结构化数据**：完整实现 Schema.org 标记，Google 富片段展示率提升 200%。
> 
> 2. **动态 OG 图片**：使用 @vercel/og 在边缘生成社交分享图，分享率提升 150%。
> 
> 3. **技术 SEO**：自动生成 sitemap、robots.txt，页面索引率达到 95%+。
> 
> 4. **成果**：上线一个月获得 Google Featured Snippets，有机流量增长 300%。"

#### 7. 🔐 安全实践

**面试话术模板**：

> "安全是生产环境的基石：
> 
> 1. **CSP 策略**：实施严格的内容安全策略，防止 XSS 攻击。
> 
> 2. **依赖安全**：使用 Dependabot 自动更新，npm audit 集成到 CI/CD。
> 
> 3. **认证安全**：实现 JWT + Refresh Token，支持 OAuth 2.0。
> 
> 4. **合规性**：通过 OWASP Top 10 全部测试，获得 A+ 安全评级。"

### 项目数据展示

```typescript
// 用于面试展示的项目数据
const projectMetrics = {
  // 性能指标
  performance: {
    lighthouse: 98,
    fcp: '0.8s',
    lcp: '1.2s',
    cls: 0.05,
    fid: '45ms',
    ttfb: '180ms',
    tti: '1.8s',
  },
  
  // 技术指标
  technical: {
    bundleSize: '85KB',
    codeCovarage: '92%',
    typeCovarage: '100%',
    buildTime: '45s',
    deployTime: '90s',
  },
  
  // 业务指标
  business: {
    monthlyVisitors: '10K+',
    bounceRate: '35%',
    avgSessionDuration: '3:45',
    pagePerSession: 4.2,
    conversionRate: '5.8%',
  },
  
  // 开发效率
  development: {
    componentsReused: '85%',
    deployFrequency: '3/week',
    leadTime: '< 1 day',
    mttr: '< 30 min',
    changeFailureRate: '< 5%',
  },
}
```

---

## 🎬 总结与下一步

### 你已经掌握的技能

✅ **架构设计** - Next.js 14 App Router 最佳实践  
✅ **性能优化** - Core Web Vitals 优化技巧  
✅ **动画系统** - Framer Motion 高级应用  
✅ **设计系统** - 企业级组件库构建  
✅ **部署运维** - 多平台部署与监控  
✅ **SEO 优化** - 技术 SEO 完整方案  
✅ **安全防护** - Web 安全最佳实践  

### 继续深入学习

1. **添加更多功能**
   - 评论系统（Giscus/Utterances）
   - 邮件订阅（ConvertKit/Mailchimp）
   - 全文搜索（Algolia/MeiliSearch）
   - 多语言支持（next-i18next）

2. **性能进阶**
   - Web Workers 优化
   - WebAssembly 集成
   - Edge Functions 应用
   - 数据库优化（Prisma + PlanetScale）

3. **商业化探索**
   - 会员系统
   - 付费内容
   - 广告集成
   - 数据分析看板

### 行动计划

```markdown
## 🚀 30 天实施计划

### Week 1: 基础搭建
- [ ] Day 1-2: 项目初始化和环境配置
- [ ] Day 3-4: 设计系统和组件库
- [ ] Day 5-7: 核心页面开发

### Week 2: 功能开发
- [ ] Day 8-10: 博客功能实现
- [ ] Day 11-12: 搜索和过滤
- [ ] Day 13-14: 动画和交互

### Week 3: 优化提升
- [ ] Day 15-17: 性能优化
- [ ] Day 18-19: SEO 优化
- [ ] Day 20-21: 响应式适配

### Week 4: 部署上线
- [ ] Day 22-23: 部署配置
- [ ] Day 24-25: 监控设置
- [ ] Day 26-27: 安全加固
- [ ] Day 28-30: 测试和迭代

### 里程碑检查点
- [ ] Lighthouse 分数 > 95
- [ ] 首屏加载 < 2s
- [ ] SEO 评分 100
- [ ] 无障碍评分 > 90
```

### 资源链接

- [Next.js 官方文档](https://nextjs.org/docs)
- [Vercel 部署指南](https://vercel.com/docs)
- [Web.dev 性能指南](https://web.dev/performance)
- [MDN Web 文档](https://developer.mozilla.org)
- [Can I Use](https://caniuse.com)

### 获取帮助

- **GitHub Issues**: 项目问题讨论
- **Stack Overflow**: 技术问题解答
- **Discord/Slack**: 实时社区支持
- **Twitter/X**: 关注 @vercel 获取最新动态

---

**🎉 恭喜你！** 你现在拥有了一份完整的 Next.js 博客开发指南。这不仅是一个博客项目，更是你技术能力的展示窗口。持续迭代，保持学习，让它成为你职业发展的加速器！

**记住：** 优秀的项目不是一次性完成的，而是通过不断迭代优化出来的。保持耐心，享受创造的过程！

---

*最后更新：2024年*  
*作者：基于 Vercel 团队最佳实践和社区经验总结*  
*协议：MIT License - 自由使用和分享*