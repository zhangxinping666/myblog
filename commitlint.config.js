/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type 枚举
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复bug
        'docs',     // 文档更新
        'style',    // 代码格式调整（不影响功能）
        'refactor', // 重构（既不是新功能也不是修复bug）
        'perf',     // 性能优化
        'test',     // 添加或修改测试
        'chore',    // 构建过程或辅助工具的变动
        'ci',       // CI 配置文件和脚本的变化
        'build',    // 影响构建系统或外部依赖的更改
        'revert',   // 回滚之前的提交
        'wip',      // 进行中的工作
        'workflow', // 工作流程相关
        'types',    // 类型定义文件的更改
      ],
    ],
    
    // Subject 规则
    'subject-case': [2, 'never', ['pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 72],
    'subject-min-length': [2, 'always', 3],
    
    // Type 规则
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    
    // Scope 规则
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [0, 'never'], // 允许没有 scope
    'scope-enum': [
      1,
      'always',
      [
        // 功能模块
        'ui',           // UI 组件
        'layout',       // 布局组件
        'features',     // 功能组件
        'blog',         // 博客相关
        'mdx',          // MDX 组件
        'providers',    // Context 提供者
        'common',       // 通用组件
        
        // 系统模块
        'api',          // API 路由
        'lib',          // 工具库
        'utils',        // 工具函数
        'hooks',        // 自定义钩子
        'types',        // 类型定义
        'config',       // 配置文件
        'services',     // 服务层
        'animations',   // 动画系统
        
        // 内容管理
        'content',      // 内容文件
        'posts',        // 文章
        'projects',     // 项目
        'snippets',     // 代码片段
        
        // 样式系统
        'styles',       // 样式文件
        'theme',        // 主题相关
        
        // 基础设施
        'deps',         // 依赖更新
        'scripts',      // 脚本文件
        'tests',        // 测试相关
        'ci',           // 持续集成
        'deploy',       // 部署相关
        'seo',          // SEO 优化
        'a11y',         // 可访问性
        'perf',         // 性能优化
        'security',     // 安全相关
        
        // 开发工具
        'eslint',       // ESLint 配置
        'prettier',     // Prettier 配置
        'typescript',   // TypeScript 配置
        'tailwind',     // Tailwind CSS
        'next',         // Next.js 配置
        'vitest',       // Vitest 配置
        'commitlint',   // Commitlint 配置
        
        // 其他
        'docs',         // 文档
        'examples',     // 示例代码
        'tooling',      // 工具链
        'workspace',    // 工作区配置
      ],
    ],
    
    // Header 规则
    'header-max-length': [2, 'always', 100],
    'header-min-length': [2, 'always', 10],
    
    // Body 规则
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    
    // Footer 规则
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    
    // 其他规则
    'signed-off-by': [0, 'never'],
  },
  
  // 忽略规则
  ignores: [
    (commit) => commit.includes('WIP'), // 忽略包含 WIP 的提交
    (commit) => commit.includes('wip'), // 忽略包含 wip 的提交
  ],
  
  // 默认忽略
  defaultIgnores: true,
  
  // 帮助链接
  helpUrl:
    'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
  
  // 提示信息
  prompt: {
    messages: {
      skip: '跳过',
      max: '最多 %d 个字符',
      min: '至少 %d 个字符',
      emptyWarning: '不能为空',
      upperLimitWarning: '超过字符限制',
      lowerLimitWarning: '少于最小字符数',
    },
    questions: {
      type: {
        description: '选择你要提交的更改类型',
        enum: {
          feat: {
            description: '新功能',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: 'Bug 修复',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: '文档更新',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: '代码格式调整（不影响功能的变动）',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: '重构（既不是新增功能，也不是修改bug的代码变动）',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: '性能优化',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: '添加缺失的测试或更正现有的测试',
            title: 'Tests',
            emoji: '🚨',
          },
          chore: {
            description: '构建过程或辅助工具的变动',
            title: 'Chores',
            emoji: '♻️',
          },
          ci: {
            description: 'CI 配置文件和脚本的变化',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          build: {
            description: '影响构建系统或外部依赖项的更改',
            title: 'Builds',
            emoji: '🛠',
          },
          revert: {
            description: '回滚先前的提交',
            title: 'Reverts',
            emoji: '🗑',
          },
        },
      },
      scope: {
        description: '此更改的范围是什么（例如组件或文件名）',
      },
      subject: {
        description: '写一个简短的、命令式的变化描述',
      },
      body: {
        description: '提供更改的详细描述',
      },
      isBreaking: {
        description: '有什么重大变化吗？',
      },
      breakingBody: {
        description: '重大变化的提交需要正文。请输入对提交本身的更长描述',
      },
      breaking: {
        description: '描述重大变化',
      },
      isIssueAffected: {
        description: '此更改是否影响任何未解决的问题？',
      },
      issuesBody: {
        description: '如果问题已修复，则提交需要正文。请输入对提交本身的更长描述',
      },
      issues: {
        description: '添加问题引用（例如"fix #123", "re #123"）',
      },
    },
  },
};

module.exports = config;