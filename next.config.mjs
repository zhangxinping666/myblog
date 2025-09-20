import { withContentlayer } from 'next-contentlayer';
import million from 'million/compiler';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用实验性功能
  experimental: {
    // 启用 Turbopack 用于开发和构建
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // 启用 App Directory
    appDir: true,
    // 启用服务器组件
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
    // 优化包导入
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },

  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },

  // MDX 配置
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  // Webpack 配置
  webpack: (config, { dev, isServer }) => {
    // SVG 作为组件导入
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // 优化 bundle 大小
    if (!dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      };
    }

    return config;
  },

  // 环境变量配置
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // 重定向配置
  async redirects() {
    return [
      {
        source: '/feed',
        destination: '/api/rss',
        permanent: true,
      },
      {
        source: '/rss',
        destination: '/api/rss',
        permanent: true,
      },
    ];
  },

  // Headers 配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate',
          },
        ],
      },
    ];
  },

  // 压缩配置
  compress: true,

  // 电量模式配置
  poweredByHeader: false,

  // 生成源映射
  productionBrowserSourceMaps: false,

  // 严格模式
  reactStrictMode: true,

  // SWC Minify
  swcMinify: true,

  // 输出配置
  output: 'standalone',

  // 类型检查
  typescript: {
    // 构建时忽略类型错误（在 CI 中单独运行类型检查）
    ignoreBuildErrors: false,
  },

  // ESLint 配置
  eslint: {
    // 构建时忽略 ESLint 错误（在 CI 中单独运行）
    ignoreDuringBuilds: false,
  },
};

// 使用 Million.js 优化性能
const millionConfig = {
  auto: {
    threshold: 0.1,
    skip: ['useBadHook', /badVariable/g],
    rsc: true,
  },
};

export default million.next(withContentlayer(nextConfig), millionConfig);