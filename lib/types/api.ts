// API 相关类型定义 - 定义所有 API 接口的请求和响应类型
// 提供类型安全的 API 通信支持

import { BaseResponse, PaginatedResponse, AnalyticsEvent } from './index';

// ================================
// 通用 API 类型
// ================================

// HTTP 方法枚举
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

// API 响应状态码
export enum ApiStatusCode {
  SUCCESS = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503
}

// API 错误响应
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string; // 用于表单验证错误
  timestamp: string;
}

// ================================
// 搜索 API (/api/search)
// ================================

export interface SearchRequest {
  query: string;
  type?: 'all' | 'posts' | 'projects' | 'pages';
  category?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface SearchResponse extends BaseResponse {
  data: {
    results: Array<{
      id: string;
      title: string;
      description?: string;
      url: string;
      type: 'post' | 'project' | 'page';
      category?: string;
      tags?: string[];
      publishedAt?: string;
      score: number;
      highlight?: {
        title?: string[];
        description?: string[];
        content?: string[];
      };
    }>;
    totalResults: number;
    query: string;
    suggestions?: string[];
  };
}

// 文章统计 API (/api/views, /api/likes)

export interface PostStatsRequest {
  slug: string;
}

export interface ViewsResponse extends BaseResponse {
  data: {
    slug: string;
    views: number;
    uniqueViews?: number;
    lastViewed?: string;
  };
}

export interface LikesResponse extends BaseResponse {
  data: {
    slug: string;
    likes: number;
    userLiked?: boolean; // 当前用户是否已点赞
  };
}

export interface UpdateLikesRequest {
  slug: string;
  action: 'like' | 'unlike';
  userId?: string; // 可选的用户ID，用于防止重复点赞
}

// 邮件订阅 API (/api/newsletter)

export interface NewsletterSubscribeRequest {
  email: string;
  name?: string;
  tags?: string[]; // 订阅标签，如 'weekly', 'tech', 'updates'
  source?: string; // 订阅来源，如 'footer', 'popup', 'post'
}

export interface NewsletterResponse extends BaseResponse {
  data: {
    email: string;
    status: 'subscribed' | 'pending' | 'unsubscribed';
    subscribedAt?: string;
    tags?: string[];
  };
}

export interface NewsletterUnsubscribeRequest {
  email: string;
  token?: string; // 取消订阅令牌
}

// 评论系统 API (/api/comments)

export interface Comment {
  id: string;
  postSlug: string;
  author: {
    name: string;
    email?: string;
    avatar?: string;
    website?: string;
  };
  content: string;
  html?: string; // 渲染后的 HTML
  parentId?: string; // 回复的评论ID
  createdAt: string;
  updatedAt?: string;
  status: 'approved' | 'pending' | 'spam' | 'deleted';
  likes?: number;
  replies?: Comment[];
}

export interface CreateCommentRequest {
  postSlug: string;
  author: {
    name: string;
    email: string;
    website?: string;
  };
  content: string;
  parentId?: string;
  honeypot?: string; // 反垃圾机制
}

export interface CommentsResponse extends PaginatedResponse<Comment> {
  data: Comment[];
  meta: {
    totalComments: number;
    approvedComments: number;
    pendingComments: number;
  };
}

// 联系表单 API (/api/contact)
export interface ContactFormRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
  company?: string;
  phone?: string;
  source?: string;  
  honeypot?: string; 
}

export interface ContactFormResponse extends BaseResponse {
  data: {
    messageId: string;
    status: 'sent' | 'queued' | 'failed';
    sentAt?: string;
  };
}

// OG 图片生成 API (/api/og)

export interface OGImageRequest {
  title: string;
  description?: string;
  type?: 'post' | 'project' | 'page' | 'default';
  category?: string;
  tags?: string[];
  author?: string;
  date?: string;
  theme?: 'light' | 'dark';
  width?: number;
  height?: number;
}

// OG API 返回图片 buffer，类型为 Response

// RSS 订阅 API (/api/rss)

export interface RSSFeedOptions {
  format?: 'rss' | 'atom' | 'json';
  category?: string;
  limit?: number;
  includeContent?: boolean;
}

// RSS API 返回 XML/JSON 字符串

// 分析数据 API (/api/analytics)

export interface AnalyticsDataRequest {
  type: 'pageviews' | 'popular' | 'referrers' | 'search' | 'events';
  startDate?: string;
  endDate?: string;
  limit?: number;
  slug?: string; // 特定文章的数据
}

export interface AnalyticsDataResponse extends BaseResponse {
  data: {
    type: string;
    period: {
      start: string;
      end: string;
    };
    results: Array<{
      key: string; // 页面路径、搜索词等
      value: number; // 浏览量、搜索次数等
      change?: number; // 相比上期的变化百分比
    }>;
    total?: number;
    summary?: {
      totalViews: number;
      totalVisitors: number;
      averageTime?: number;
      bounceRate?: number;
    };
  };
}

export interface TrackEventRequest extends AnalyticsEvent {
  // 继承 AnalyticsEvent，可添加额外字段
  url?: string;
  referrer?: string;
  userAgent?: string;
}

// 内容管理 API (管理后台使用)

export interface ContentManagementRequest {
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  type: 'post' | 'project' | 'page';
  slug?: string;
  data?: {
    title?: string;
    description?: string;
    content?: string;
    tags?: string[];
    category?: string;
    featured?: boolean;
    publishedAt?: string;
  };
}

export interface ContentManagementResponse extends BaseResponse {
  data: {
    slug: string;
    status: string;
    lastModified: string;
    url?: string;
  };
}

// 文件上传 API (/api/upload)

export interface FileUploadRequest {
  file: File;
  type: 'image' | 'document' | 'video';
  path?: string; // 上传路径
  resize?: {
    width?: number;
    height?: number;
    quality?: number;
  };
}

export interface FileUploadResponse extends BaseResponse {
  data: {
    url: string;
    filename: string;
    size: number;
    type: string;
    uploadedAt: string;
    metadata?: {
      width?: number;
      height?: number;
      duration?: number; // 视频时长
    };
  };
}

// 站点地图 API (/api/sitemap)

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number; // 0.0 to 1.0
}

export interface SitemapResponse {
  entries: SitemapEntry[];
  lastGenerated: string;
}

// 通用 API 配置

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
}

// API 客户端实例类型
export interface ApiClient {
  get<T = any>(url: string, params?: any): Promise<T>;
  post<T = any>(url: string, data?: any): Promise<T>;
  put<T = any>(url: string, data?: any): Promise<T>;
  patch<T = any>(url: string, data?: any): Promise<T>;
  delete<T = any>(url: string): Promise<T>;
}

// Webhook 类型 (第三方集成)

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: any;
  signature?: string; 
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
  createdAt: string;
}

// GraphQL API 类型定义 - 为项目可能的 GraphQL 支持提供类型基础
// 支持 Query、Mutation、Subscription 以及常见的 GraphQL 操作

// GraphQL 基础类型
export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: (string | number)[];
  extensions?: Record<string, any>;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
  extensions?: Record<string, any>;
}

// GraphQL 分页信息（基于 Relay 规范）
export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface Edge<T> {
  node: T;
  cursor: string;
}

export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
  totalCount?: number;
}

// GraphQL 输入类型
export interface GraphQLPaginationInput {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

export interface GraphQLSortInput {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface GraphQLFilterInput {
  field: string;
  operator: 'EQ' | 'NE' | 'GT' | 'GTE' | 'LT' | 'LTE' | 'IN' | 'NOT_IN' | 'CONTAINS' | 'STARTS_WITH' | 'ENDS_WITH';
  value: any;
}

// 博客文章 GraphQL 类型
export interface PostGraphQL {
  id: string;
  slug: string;
  title: string;
  description?: string;
  content: string;
  excerpt?: string;
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  draft: boolean;
  readingTime: {
    text: string;
    minutes: number;
    words: number;
  };
  author: UserGraphQL;
  category?: CategoryGraphQL;
  tags: TagGraphQL[];
  image?: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  seo: {
    title?: string;
    description?: string;
    keywords: string[];
  };
}

export interface PostConnection extends Connection<PostGraphQL> {}

export interface PostInput {
  title: string;
  description?: string;
  content: string;
  excerpt?: string;
  categoryId?: string;
  tagIds?: string[];
  image?: string;
  featured?: boolean;
  draft?: boolean;
  publishedAt?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

// 用户 GraphQL 类型
export interface UserGraphQL {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  website?: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  createdAt: string;
  updatedAt: string;
  posts: PostConnection;
  totalPosts: number;
}

export interface UserInput {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  website?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// 分类 GraphQL 类型
export interface CategoryGraphQL {
  id: string;
  slug: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  posts: PostConnection;
  postCount: number;
  parent?: CategoryGraphQL;
  children: CategoryGraphQL[];
}

export interface CategoryInput {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  featured?: boolean;
  parentId?: string;
}

// 标签 GraphQL 类型
export interface TagGraphQL {
  id: string;
  slug: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  posts: PostConnection;
  postCount: number;
}

export interface TagInput {
  name: string;
  description?: string;
  color?: string;
}

// 评论 GraphQL 类型
export interface CommentGraphQL {
  id: string;
  content: string;
  html: string;
  createdAt: string;
  updatedAt: string;
  status: 'APPROVED' | 'PENDING' | 'SPAM' | 'DELETED';
  author: {
    name: string;
    email: string;
    avatar?: string;
    website?: string;
  };
  post: PostGraphQL;
  parent?: CommentGraphQL;
  replies: CommentGraphQL[];
  likes: number;
}

export interface CommentInput {
  content: string;
  postId: string;
  parentId?: string;
  author: {
    name: string;
    email: string;
    website?: string;
  };
}

// GraphQL Query 类型
export interface GraphQLQueries {
  // 文章查询
  post: (args: { slug: string }) => PostGraphQL | null;
  posts: (args: {
    pagination?: GraphQLPaginationInput;
    sort?: GraphQLSortInput[];
    filter?: GraphQLFilterInput[];
    search?: string;
  }) => PostConnection;
  
  // 分类查询
  category: (args: { slug: string }) => CategoryGraphQL | null;
  categories: (args: {
    pagination?: GraphQLPaginationInput;
    sort?: GraphQLSortInput[];
  }) => Connection<CategoryGraphQL>;
  
  // 标签查询
  tag: (args: { slug: string }) => TagGraphQL | null;
  tags: (args: {
    pagination?: GraphQLPaginationInput;
    sort?: GraphQLSortInput[];
  }) => Connection<TagGraphQL>;
  
  // 用户查询
  user: (args: { id: string }) => UserGraphQL | null;
  users: (args: {
    pagination?: GraphQLPaginationInput;
    sort?: GraphQLSortInput[];
  }) => Connection<UserGraphQL>;
  
  // 评论查询
  comments: (args: {
    postId?: string;
    pagination?: GraphQLPaginationInput;
    sort?: GraphQLSortInput[];
  }) => Connection<CommentGraphQL>;
  
  // 搜索查询
  search: (args: {
    query: string;
    type?: 'POST' | 'CATEGORY' | 'TAG';
    pagination?: GraphQLPaginationInput;
  }) => {
    posts: PostConnection;
    categories: Connection<CategoryGraphQL>;
    tags: Connection<TagGraphQL>;
    totalResults: number;
  };
  
  // 统计查询
  stats: () => {
    totalPosts: number;
    totalCategories: number;
    totalTags: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  };
}

// GraphQL Mutation 类型
export interface GraphQLMutations {
  // 文章操作
  createPost: (args: { input: PostInput }) => {
    post: PostGraphQL;
    errors?: GraphQLError[];
  };
  updatePost: (args: { id: string; input: Partial<PostInput> }) => {
    post: PostGraphQL;
    errors?: GraphQLError[];
  };
  deletePost: (args: { id: string }) => {
    success: boolean;
    errors?: GraphQLError[];
  };
  publishPost: (args: { id: string }) => {
    post: PostGraphQL;
    errors?: GraphQLError[];
  };
  
  // 分类操作
  createCategory: (args: { input: CategoryInput }) => {
    category: CategoryGraphQL;
    errors?: GraphQLError[];
  };
  updateCategory: (args: { id: string; input: Partial<CategoryInput> }) => {
    category: CategoryGraphQL;
    errors?: GraphQLError[];
  };
  deleteCategory: (args: { id: string }) => {
    success: boolean;
    errors?: GraphQLError[];
  };
  
  // 标签操作
  createTag: (args: { input: TagInput }) => {
    tag: TagGraphQL;
    errors?: GraphQLError[];
  };
  updateTag: (args: { id: string; input: Partial<TagInput> }) => {
    tag: TagGraphQL;
    errors?: GraphQLError[];
  };
  deleteTag: (args: { id: string }) => {
    success: boolean;
    errors?: GraphQLError[];
  };
  
  // 评论操作
  createComment: (args: { input: CommentInput }) => {
    comment: CommentGraphQL;
    errors?: GraphQLError[];
  };
  updateComment: (args: { id: string; input: Partial<CommentInput> }) => {
    comment: CommentGraphQL;
    errors?: GraphQLError[];
  };
  deleteComment: (args: { id: string }) => {
    success: boolean;
    errors?: GraphQLError[];
  };
  approveComment: (args: { id: string }) => {
    comment: CommentGraphQL;
    errors?: GraphQLError[];
  };
  
  // 互动操作
  likePost: (args: { postId: string }) => {
    post: PostGraphQL;
    success: boolean;
  };
  unlikePost: (args: { postId: string }) => {
    post: PostGraphQL;
    success: boolean;
  };
  
  // 邮件订阅
  subscribeNewsletter: (args: { 
    email: string; 
    name?: string; 
    tags?: string[] 
  }) => {
    success: boolean;
    message: string;
    errors?: GraphQLError[];
  };
}

// GraphQL Subscription 类型
export interface GraphQLSubscriptions {
  // 文章更新订阅
  postUpdated: (args: { slug?: string }) => PostGraphQL;
  postCreated: () => PostGraphQL;
  postDeleted: () => { id: string; slug: string };
  
  // 评论订阅
  commentAdded: (args: { postId: string }) => CommentGraphQL;
  commentUpdated: (args: { postId: string }) => CommentGraphQL;
  
  // 统计更新订阅
  statsUpdated: () => {
    postId: string;
    views: number;
    likes: number;
    comments: number;
  };
  
  // 实时通知
  notification: (args: { userId?: string }) => {
    id: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    title: string;
    message: string;
    createdAt: string;
  };
}

// GraphQL Schema 类型
export interface GraphQLSchema {
  Query: GraphQLQueries;
  Mutation: GraphQLMutations;
  Subscription: GraphQLSubscriptions;
}

// GraphQL 客户端配置
export interface GraphQLClientConfig {
  endpoint: string;
  headers?: Record<string, string>;
  credentials?: 'omit' | 'same-origin' | 'include';
  cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached';
  subscriptions?: {
    endpoint: string;
    protocol: 'ws' | 'wss';
    connectionParams?: Record<string, any>;
  };
  errorHandler?: (errors: GraphQLError[]) => void;
  authToken?: string | (() => string | Promise<string>);
}

// GraphQL 操作类型
export interface GraphQLOperation {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

export interface GraphQLBatchOperation {
  operations: GraphQLOperation[];
}

// GraphQL 缓存类型
export interface GraphQLCacheConfig {
  ttl: number; // 缓存时间 (秒)
  maxSize: number; // 最大缓存条目数
  normalize: boolean; // 是否标准化缓存
  persistQuery: boolean; // 是否持久化查询
}

// 综合的 GraphQL 类型集合
export interface GraphQLTypes {
  // 响应类型
  GraphQLResponse: GraphQLResponse<any>;
  GraphQLError: GraphQLError;
  
  // 分页类型
  PageInfo: PageInfo;
  Edge: Edge<any>;
  Connection: Connection<any>;
  
  // 实体类型
  PostGraphQL: PostGraphQL;
  UserGraphQL: UserGraphQL;
  CategoryGraphQL: CategoryGraphQL;
  TagGraphQL: TagGraphQL;
  CommentGraphQL: CommentGraphQL;
  
  // 输入类型
  PostInput: PostInput;
  UserInput: UserInput;
  CategoryInput: CategoryInput;
  TagInput: TagInput;
  CommentInput: CommentInput;
  
  // 操作类型
  GraphQLQueries: GraphQLQueries;
  GraphQLMutations: GraphQLMutations;
  GraphQLSubscriptions: GraphQLSubscriptions;
  GraphQLSchema: GraphQLSchema;
  
  // 配置类型
  GraphQLClientConfig: GraphQLClientConfig;
  GraphQLCacheConfig: GraphQLCacheConfig;
}