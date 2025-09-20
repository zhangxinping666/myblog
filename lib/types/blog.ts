// 博客相关类型定义 - 博客内容管理的核心类型
// 定义文章、项目、代码片段等内容的数据结构

import { FrontMatter, User, StatsData, ContentStatus, ContentType, SearchResultItem, SiteConfig, NavItem, SEOConfig } from './index';

// ================================
// 博客文章类型
// ================================

// 文章前置数据 (继承通用FrontMatter)
export interface PostFrontMatter extends FrontMatter {
  // 博客文章特有的字段
  series?: string; // 系列文章名称
  seriesOrder?: number; // 在系列中的顺序
  excerpt?: string; // 手动设置的摘要
  canonical?: string; // 原始发布链接
  lastModified?: string; // 最后修改时间
  wordCount?: number; // 字数统计
  tableOfContents?: boolean; // 是否显示目录
  comments?: boolean; // 是否允许评论
  likes?: boolean; // 是否允许点赞
  related?: string[]; // 相关文章slug
  difficulty?: 'beginner' | 'intermediate' | 'advanced'; // 难度等级
  language?: string; // 文章语言
}

// 完整的博客文章对象
export interface BlogPost {
  slug: string;
  frontMatter: PostFrontMatter;
  content: string; // 原始MDX内容
  html?: string; // 渲染后的HTML
  excerpt?: string; // 自动或手动摘要
  toc?: TableOfContentItem[]; // 目录结构
  stats?: StatsData; // 统计数据
  relatedPosts?: BlogPost[]; // 相关文章
  prev?: { title: string; slug: string }; // 上一篇
  next?: { title: string; slug: string }; // 下一篇
  meta: {
    readingTime: {
      text: string;
      minutes: number;
      time: number;
      words: number;
    };
    lastModified: string;
    publishedAt: string;
    wordCount: number;
    status: ContentStatus;
  };
}

// 文章列表项 (用于列表页面，精简版)
export interface BlogPostSummary {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  publishedAt: string;
  lastModified?: string;
  readingTime: {
    text: string;
    minutes: number;
  };
  tags?: string[];
  category?: string;
  featured?: boolean;
  image?: string;
  author?: User;
  stats?: {
    views: number;
    likes: number;
  };
  series?: {
    name: string;
    order: number;
    total: number;
  };
}

// ================================
// 目录相关类型
// ================================

export interface TableOfContentItem {
  id: string;
  title: string;
  level: number; // 1-6 对应 h1-h6
  children?: TableOfContentItem[];
  anchor?: string; // 锚点链接
}

// ================================
// 分类和标签
// ================================

export interface Category {
  slug: string;
  name: string;
  description?: string;
  color?: string; // 主题色
  icon?: string; // 图标
  postCount: number;
  featured?: boolean;
  parent?: string; // 父分类slug
  children?: Category[];
  meta?: {
    title?: string; // SEO标题
    description?: string; // SEO描述
    keywords?: string[];
  };
}

export interface Tag {
  slug: string;
  name: string;
  description?: string;
  color?: string;
  postCount: number;
  relatedTags?: string[]; // 相关标签
  meta?: {
    title?: string;
    description?: string;
  };
}

// 项目类型
export interface ProjectFrontMatter extends FrontMatter {
  // 项目特有字段
  status: 'planning' | 'in-progress' | 'completed' | 'archived';
  startDate?: string;
  endDate?: string;
  technologies?: string[]; // 使用的技术栈
  repository?: {
    url: string;
    platform: 'github' | 'gitlab' | 'bitbucket';
    stars?: number;
    forks?: number;
  };
  demo?: {
    url: string;
    type: 'live' | 'video' | 'screenshots';
  };
  client?: string; // 客户名称
  team?: User[]; // 团队成员
  highlights?: string[]; // 项目亮点
  challenges?: string[]; // 遇到的挑战
  lessons?: string[]; // 学到的经验
}

export interface Project {
  slug: string;
  frontMatter: ProjectFrontMatter;
  content: string;
  html?: string;
  gallery?: {
    images: string[];
    videos?: string[];
  };
  stats?: StatsData;
  relatedProjects?: Project[];
  meta: {
    lastModified: string;
    status: ContentStatus;
  };
}

export interface ProjectSummary {
  slug: string;
  title: string;
  description?: string;
  image?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'archived';
  technologies?: string[];
  featured?: boolean;
  startDate?: string;
  endDate?: string;
  repository?: {
    url: string;
    platform: string;
  };
  demo?: {
    url: string;
    type: string;
  };
}

// 代码片段类型

export interface SnippetFrontMatter extends FrontMatter {
  // 代码片段特有字段
  language: string; // 编程语言
  framework?: string; // 框架名称
  version?: string; // 版本信息
  dependencies?: string[]; // 依赖包
  usage?: string; // 使用说明
  license?: string; // 许可证
  complexity: 'simple' | 'medium' | 'complex'; // 复杂度
}

export interface CodeSnippet {
  slug: string;
  frontMatter: SnippetFrontMatter;
  content: string; // 代码内容
  html?: string; // 高亮后的HTML
  explanation?: string; // 代码解释
  examples?: {
    title: string;
    code: string;
    description?: string;
  }[];
  stats?: StatsData;
  relatedSnippets?: CodeSnippet[];
  meta: {
    lastModified: string;
    status: ContentStatus;
    linesOfCode: number;
  };
}

export interface SnippetSummary {
  slug: string;
  title: string;
  description?: string;
  language: string;
  framework?: string;
  tags?: string[];
  featured?: boolean;
  complexity: 'simple' | 'medium' | 'complex';
  lastModified: string;
  stats?: {
    views: number;
    likes: number;
  };
}

// 内容查询和筛选

export interface ContentQuery {
  type?: ContentType[];
  category?: string[];
  tags?: string[];
  status?: ContentStatus[];
  author?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
  featured?: boolean;
  search?: string;
  sort?: {
    field: 'date' | 'title' | 'views' | 'likes' | 'readingTime';
    order: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
}

export interface ContentQueryResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
  filters: {
    categories: { slug: string; name: string; count: number }[];
    tags: { slug: string; name: string; count: number }[];
    years: { year: number; count: number }[];
    authors: { id: string; name: string; count: number }[];
  };
}

// 系列文章

export interface PostSeries {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  posts: Array<{
    slug: string;
    title: string;
    description?: string;
    order: number;
    publishedAt: string;
    readingTime: { text: string; minutes: number };
    completed: boolean; // 是否已发布
  }>;
  meta: {
    totalPosts: number;
    publishedPosts: number;
    totalReadingTime: number; // 总阅读时间(分钟)
    startDate: string;
    lastUpdated: string;
    status: 'active' | 'completed' | 'paused';
  };
}

// 内容统计和分析

export interface ContentStats {
  overview: {
    totalPosts: number;
    totalProjects: number;
    totalSnippets: number;
    totalViews: number;
    totalLikes: number;
    totalComments?: number;
  };
  trends: {
    period: 'week' | 'month' | 'year';
    views: Array<{ date: string; count: number }>;
    posts: Array<{ date: string; count: number }>;
    engagement: Array<{ date: string; likes: number; comments: number }>;
  };
  popular: {
    posts: BlogPostSummary[];
    projects: ProjectSummary[];
    categories: Array<{ slug: string; name: string; views: number }>;
    tags: Array<{ slug: string; name: string; usage: number }>;
  };
  performance: {
    averageReadingTime: number;
    bounceRate?: number;
    averageTimeOnPage?: number;
    topReferrers?: Array<{ source: string; visits: number }>;
  };
}

// RSS 和订阅

export interface RSSFeed {
  title: string;
  description: string;
  url: string;
  language: string;
  lastBuildDate: string;
  items: Array<{
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    author?: string;
    categories?: string[];
    content?: string; // 全文内容
    enclosure?: {
      url: string;
      type: string;
      length: number;
    };
  }>;
}

// 内容模板和生成器

export interface ContentTemplate {
  type: ContentType;
  name: string;
  description?: string;
  frontMatter: Partial<FrontMatter>;
  content: string; // 模板内容
  variables?: Array<{
    name: string;
    type: 'string' | 'array' | 'boolean' | 'date';
    description?: string;
    required?: boolean;
    default?: any;
  }>;
}

export interface ContentGenerator {
  template: ContentTemplate;
  variables: Record<string, any>;
  output: {
    frontMatter: FrontMatter;
    content: string;
    filename: string;
  };
}

// 内容管理器配置

export interface ContentManagerConfig {
  contentDir: string;
  outputDir: string;
  publicPath: string;
  imageOptimization: {
    enabled: boolean;
    formats: string[];
    sizes: number[];
    quality: number;
  };
  mdx: {
    remarkPlugins: string[];
    rehypePlugins: string[];
    customComponents: Record<string, string>;
  };
  seo: {
    generateSitemap: boolean;
    generateRobots: boolean;
    defaultMetadata: Partial<FrontMatter>;
  };
  search: {
    enabled: boolean;
    provider: 'local' | 'algolia' | 'elasticsearch';
    indexFields: string[];
  };
}

// 多语言内容支持 - 为博客添加国际化(i18n)支持，允许多语言内容管理
// 支持多语言文章、分类、标签以及用户界面本地化

// 支持的语言类型
export type SupportedLocale = 'zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR' | 'es-ES' | 'fr-FR' | 'de-DE' | 'pt-BR' | 'ru-RU' | 'ar-SA';

// 语言方向
export type TextDirection = 'ltr' | 'rtl';

// 语言配置
export interface LanguageConfig {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string; // 国旗图标
  direction: TextDirection;
  enabled: boolean;
  isDefault: boolean;
  dateFormat: string; // 日期格式化模式
  numberFormat: string; // 数字格式化模式
  currency?: {
    code: string; // 货币代码 (USD, CNY, JPY, etc.)
    symbol: string; // 货币符号
  };
  meta: {
    description: string;
    keywords: string[];
  };
}

// 多语言内容基础接口
export interface MultiLanguageContent<T = any> {
  defaultLocale: SupportedLocale;
  translations: Record<SupportedLocale, T>;
  fallbackLocale?: SupportedLocale;
}

// 多语言前置数据
export interface MultiLanguageFrontMatter extends Omit<FrontMatter, 'title' | 'description'> {
  // 基础多语言字段
  title: MultiLanguageContent<string>;
  description?: MultiLanguageContent<string>;
  
  // 可选的多语言字段
  excerpt?: MultiLanguageContent<string>;
  keywords?: MultiLanguageContent<string[]>;
  
  // 语言特定配置
  locales: SupportedLocale[];
  defaultLocale: SupportedLocale;
  
  // 翻译相关
  translation: {
    status: 'complete' | 'partial' | 'machine' | 'pending';
    completeness: Record<SupportedLocale, number>; // 0-100 的完成度百分比
    translators?: Record<SupportedLocale, string>; // 翻译者信息
    lastUpdated: Record<SupportedLocale, string>; // 各语言最后更新时间
  };
  
  // SEO 多语言支持
  seo?: {
    title?: MultiLanguageContent<string>;
    description?: MultiLanguageContent<string>;
    keywords?: MultiLanguageContent<string[]>;
    hreflang: Record<SupportedLocale, string>; // 各语言的完整URL
  };
}

// 多语言博客文章
export interface MultiLanguageBlogPost extends Omit<BlogPost, 'frontMatter' | 'content' | 'excerpt' | 'html' | 'toc'> {
  frontMatter: MultiLanguageFrontMatter;
  content: MultiLanguageContent<string>; // 各语言的完整内容
  excerpt?: MultiLanguageContent<string>; // 各语言的摘要
  
  // 语言特定的处理内容
  html?: MultiLanguageContent<string>; // 各语言渲染后的HTML
  toc?: MultiLanguageContent<TableOfContentItem[]>; // 各语言的目录
  
  // 翻译链接关系
  alternateLinks: Record<SupportedLocale, string>; // 各语言版本的链接
  canonicalLocale: SupportedLocale; // 原始语言版本
  
  // 语言特定元数据
  localeMeta: Record<SupportedLocale, {
    readingTime: {
      text: string;
      minutes: number;
      words: number;
    };
    wordCount: number;
    publishedAt: string; // 该语言版本的发布时间
    lastModified: string; // 该语言版本的最后修改时间
  }>;
}

// 多语言文章摘要
export interface MultiLanguageBlogPostSummary extends Omit<BlogPostSummary, 'title' | 'description' | 'excerpt'> {
  title: MultiLanguageContent<string>;
  description?: MultiLanguageContent<string>;
  excerpt?: MultiLanguageContent<string>;
  
  // 当前显示的语言
  currentLocale: SupportedLocale;
  
  // 可用语言
  availableLocales: SupportedLocale[];
  
  // 翻译完成度
  translationCompleteness: Record<SupportedLocale, number>;
}

// 多语言分类
export interface MultiLanguageCategory extends Omit<Category, 'name' | 'description' | 'meta' | 'postCount'> {
  name: MultiLanguageContent<string>;
  description?: MultiLanguageContent<string>;
  
  // SEO 多语言
  meta?: {
    title?: MultiLanguageContent<string>;
    description?: MultiLanguageContent<string>;
    keywords?: MultiLanguageContent<string[]>;
  };
  
  // 各语言的文章数量
  postCount: Record<SupportedLocale, number>;
}

// 多语言标签
export interface MultiLanguageTag extends Omit<Tag, 'name' | 'description' | 'meta' | 'postCount'> {
  name: MultiLanguageContent<string>;
  description?: MultiLanguageContent<string>;
  
  // SEO 多语言
  meta?: {
    title?: MultiLanguageContent<string>;
    description?: MultiLanguageContent<string>;
  };
  
  // 各语言的使用次数
  postCount: Record<SupportedLocale, number>;
}

// 多语言项目
export interface MultiLanguageProject extends Omit<Project, 'frontMatter' | 'content' | 'html'> {
  frontMatter: MultiLanguageFrontMatter & {
    // 项目特有的多语言字段
    technologies?: MultiLanguageContent<string[]>; // 技术栈名称可能需要本地化
    highlights?: MultiLanguageContent<string[]>; // 项目亮点
    challenges?: MultiLanguageContent<string[]>; // 挑战
    lessons?: MultiLanguageContent<string[]>; // 经验
  };
  content: MultiLanguageContent<string>;
  html?: MultiLanguageContent<string>;
}

// 多语言系列文章
export interface MultiLanguagePostSeries extends Omit<PostSeries, 'name' | 'description' | 'posts'> {
  name: MultiLanguageContent<string>;
  description?: MultiLanguageContent<string>;
  
  // 各语言的文章
  posts: Record<SupportedLocale, Array<{
    slug: string;
    title: string;
    description?: string;
    order: number;
    publishedAt: string;
    readingTime: { text: string; minutes: number };
    completed: boolean;
  }>>;
  
  // 各语言的元数据
  localeMeta: Record<SupportedLocale, {
    totalPosts: number;
    publishedPosts: number;
    totalReadingTime: number;
    startDate: string;
    lastUpdated: string;
  }>;
}

// 多语言搜索
export interface MultiLanguageSearchQuery {
  query: string;
  locale?: SupportedLocale;
  searchInAllLanguages?: boolean; // 是否搜索所有语言的内容
  preferredLocales?: SupportedLocale[]; // 优先搜索的语言顺序
}

export interface MultiLanguageSearchResult extends Omit<SearchResultItem, 'title' | 'description'> {
  title: string;
  description?: string;
  locale: SupportedLocale; // 匹配的语言
  alternateLanguages?: Array<{
    locale: SupportedLocale;
    url: string;
    title: string;
  }>;
  relevanceScore: number; // 相关度评分
  languageScore: number; // 语言匹配度评分
}

// 多语言内容查询
export interface MultiLanguageContentQuery extends Omit<ContentQuery, 'search'> {
  locale?: SupportedLocale;
  includeAllLanguages?: boolean;
  search?: MultiLanguageSearchQuery;
  translationStatus?: ('complete' | 'partial' | 'machine' | 'pending')[];
}

// 多语言站点配置
export interface MultiLanguageSiteConfig extends Omit<SiteConfig, 'name' | 'title' | 'description'> {
  // 基础多语言信息
  name: MultiLanguageContent<string>;
  title: MultiLanguageContent<string>;
  description: MultiLanguageContent<string>;
  
  // 语言配置
  languages: LanguageConfig[];
  defaultLanguage: SupportedLocale;
  fallbackLanguage: SupportedLocale;
  
  // 语言检测
  languageDetection: {
    enabled: boolean;
    order: ('browser' | 'cookie' | 'localStorage' | 'path' | 'subdomain' | 'header')[];
    caches: ('cookie' | 'localStorage')[];
    cookieName: string;
    cookieOptions: {
      maxAge: number;
      domain?: string;
      path: string;
      sameSite: 'strict' | 'lax' | 'none';
    };
  };
  
  // URL 结构策略
  urlStrategy: {
    type: 'path' | 'subdomain' | 'domain' | 'query';
    pathPrefix: boolean; // 是否在路径前加语言前缀
    hideDefaultLocale: boolean; // 是否隐藏默认语言的前缀
  };
  
  // 翻译配置
  translation: {
    provider?: 'google' | 'deepl' | 'azure' | 'aws' | 'manual';
    apiKey?: string;
    autoTranslate: boolean;
    reviewRequired: boolean;
    namespaces: string[]; // 翻译命名空间
  };
}

// 国际化路由配置
export interface I18nRoute {
  path: string;
  locales: Record<SupportedLocale, string>; // 各语言的路径
  params?: Record<string, MultiLanguageContent<string>>; // 动态参数的翻译
}

// 多语言导航
export interface MultiLanguageNavItem extends Omit<NavItem, 'title' | 'description' | 'children' | 'href'> {
  title: MultiLanguageContent<string>;
  description?: MultiLanguageContent<string>;
  href: MultiLanguageContent<string>; // 各语言的链接
  children?: MultiLanguageNavItem[];
}

// 多语言 SEO 配置
export interface MultiLanguageSEOConfig extends Omit<SEOConfig, 'title' | 'description' | 'openGraph' | 'twitter'> {
  title?: MultiLanguageContent<string>;
  description?: MultiLanguageContent<string>;
  
  // 多语言 Open Graph
  openGraph?: {
    type?: string;
    title?: MultiLanguageContent<string>;
    description?: MultiLanguageContent<string>;
    images?: {
      url: string;
      width?: number;
      height?: number;
      alt?: MultiLanguageContent<string>;
    }[];
    siteName?: MultiLanguageContent<string>;
    locale: SupportedLocale;
    alternateLocales: SupportedLocale[];
  };
  
  // 多语言 Twitter Card
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    title?: MultiLanguageContent<string>;
    description?: MultiLanguageContent<string>;
    images?: string[];
  };
  
  // hreflang 标签
  hreflang: Record<SupportedLocale, string>;
  
  // 结构化数据
  structuredData?: {
    organization?: MultiLanguageContent<any>;
    website?: MultiLanguageContent<any>;
    breadcrumbs?: MultiLanguageContent<any>;
  };
}

// 翻译管理
export interface TranslationManager {
  // 翻译状态
  getTranslationStatus: (contentId: string) => Promise<Record<SupportedLocale, {
    status: 'complete' | 'partial' | 'machine' | 'pending';
    completeness: number;
    lastUpdated: string;
    translator?: string;
  }>>;
  
  // 自动翻译
  autoTranslate: (
    content: string,
    fromLocale: SupportedLocale,
    toLocale: SupportedLocale
  ) => Promise<string>;
  
  // 翻译验证
  validateTranslation: (
    original: string,
    translated: string,
    fromLocale: SupportedLocale,
    toLocale: SupportedLocale
  ) => Promise<{
    accuracy: number;
    suggestions: string[];
    warnings: string[];
  }>;
  
  // 翻译导入导出
  exportTranslations: (locale: SupportedLocale) => Promise<Record<string, any>>;
  importTranslations: (locale: SupportedLocale, translations: Record<string, any>) => Promise<void>;
}

// 语言切换组件配置
export interface LanguageSwitcherConfig {
  type: 'dropdown' | 'list' | 'flags' | 'names';
  showFlags: boolean;
  showNativeNames: boolean;
  showCompleteness: boolean; // 显示翻译完成度
  position: 'header' | 'footer' | 'sidebar' | 'floating';
  persistChoice: boolean;
  redirectToEquivalent: boolean; // 切换语言时是否重定向到对应页面
}

// 多语言内容同步
export interface ContentSyncConfig {
  enabled: boolean;
  syncFields: string[]; // 需要同步的字段（如标签、分类）
  autoSync: boolean;
  conflictResolution: 'manual' | 'latest' | 'source' | 'target';
  notifications: {
    onSync: boolean;
    onConflict: boolean;
    channels: ('email' | 'slack' | 'webhook')[];
  };
}

// 多语言统计
export interface MultiLanguageStats {
  overview: {
    totalLanguages: number;
    activeLanguages: number;
    totalContent: Record<SupportedLocale, number>;
    translationCompleteness: Record<SupportedLocale, number>;
  };
  
  content: {
    posts: Record<SupportedLocale, number>;
    projects: Record<SupportedLocale, number>;
    categories: Record<SupportedLocale, number>;
    tags: Record<SupportedLocale, number>;
  };
  
  engagement: {
    viewsByLanguage: Record<SupportedLocale, number>;
    popularContent: Record<SupportedLocale, Array<{
      slug: string;
      title: string;
      views: number;
    }>>;
    languagePreferences: Record<SupportedLocale, number>;
  };
  
  translation: {
    pendingTranslations: number;
    machineTranslations: number;
    humanTranslations: number;
    reviewRequired: number;
    averageTranslationTime: Record<SupportedLocale, number>; // 平均翻译时间（天）
  };
}

// 综合的多语言支持类型集合
export interface MultiLanguageSupport {
  // 基础类型
  SupportedLocale: SupportedLocale;
  LanguageConfig: LanguageConfig;
  MultiLanguageContent: MultiLanguageContent<any>;
  
  // 内容类型
  MultiLanguageFrontMatter: MultiLanguageFrontMatter;
  MultiLanguageBlogPost: MultiLanguageBlogPost;
  MultiLanguageBlogPostSummary: MultiLanguageBlogPostSummary;
  MultiLanguageCategory: MultiLanguageCategory;
  MultiLanguageTag: MultiLanguageTag;
  MultiLanguageProject: MultiLanguageProject;
  MultiLanguagePostSeries: MultiLanguagePostSeries;
  
  // 搜索和查询
  MultiLanguageSearchQuery: MultiLanguageSearchQuery;
  MultiLanguageSearchResult: MultiLanguageSearchResult;
  MultiLanguageContentQuery: MultiLanguageContentQuery;
  
  // 配置类型
  MultiLanguageSiteConfig: MultiLanguageSiteConfig;
  MultiLanguageSEOConfig: MultiLanguageSEOConfig;
  LanguageSwitcherConfig: LanguageSwitcherConfig;
  ContentSyncConfig: ContentSyncConfig;
  
  // 管理和统计
  TranslationManager: TranslationManager;
  MultiLanguageStats: MultiLanguageStats;
}