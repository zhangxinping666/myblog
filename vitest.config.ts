/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // 测试环境配置
    environment: 'jsdom',
    
    // 全局设置
    globals: true,
    
    // 设置文件
    setupFiles: ['./tests/setup.ts'],
    
    // 包含的测试文件
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    
    // 排除的文件
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'coverage',
      'e2e',
    ],
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'coverage/**',
        'dist/**',
        '.next/**',
        'node_modules/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.{js,ts,mjs}',
        '**/index.{js,ts}',
        'scripts/**',
        'public/**',
        'app/**/layout.tsx',
        'app/**/loading.tsx',
        'app/**/error.tsx',
        'app/**/not-found.tsx',
        'components/ui/**', // UI 组件通常不需要单元测试
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    
    // 测试超时
    testTimeout: 10000,
    
    // 钩子超时
    hookTimeout: 10000,
    
    // 是否监听文件变化
    watch: false,
    
    // 报告器
    reporters: ['verbose', 'junit'],
    
    // 输出目录
    outputFile: {
      junit: './coverage/junit.xml',
    },
    
    // 并发测试
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
    
    // 模拟配置
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
  },
  
  // 解析配置
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@/components': resolve(__dirname, './components'),
      '@/lib': resolve(__dirname, './lib'),
      '@/app': resolve(__dirname, './app'),
      '@/content': resolve(__dirname, './content'),
      '@/public': resolve(__dirname, './public'),
      '@/styles': resolve(__dirname, './styles'),
      '@/types': resolve(__dirname, './lib/types'),
    },
  },
  
  // 定义全局变量
  define: {
    'import.meta.vitest': undefined,
  },
  
  // Vite 优化配置
  optimizeDeps: {
    include: ['react', 'react-dom', '@testing-library/react'],
  },
});