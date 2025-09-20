// 通用类型定义 - 全局共享的基础类型接口
// 提供项目中所有模块都可能用到的基础类型

// 基础响应结构
export interface BaseResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

// 分页信息结构
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 分页响应结构
export interface PaginatedResponse<T> extends BaseResponse<T[]> {
  pagination: PaginationInfo;
}

// 元数据接口 - 用于文章、项目等内容的通用属性
export interface Metadata {
  title: string;
  description?: string;
  image?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  slug: string;
  tags?: string[];
  category?: string;
  featured?: boolean;
  draft?: boolean;
}

// 用户信息接口
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// 站点配置接口
export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  author: User;
  social: {
    twitter?: string;
    github?: string;
    email?: string;
  };
  analytics?: {
    googleAnalyticsId?: string;
    plausibleDomain?: string;
  };
  features: {
    newsletter: boolean;
    comments: boolean;
    search: boolean;
    darkMode: boolean;
  };
}

// 导航项接口
export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: string;
  external?: boolean;
  disabled?: boolean;
  children?: NavItem[];
}

// SEO 相关接口
export interface SEOConfig {
  title?: string;
  description?: string;
  canonical?: string;
  openGraph?: {
    type?: string;
    title?: string;
    description?: string;
    images?: {
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }[];
    url?: string;
    siteName?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    images?: string[];
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
      'max-video-preview'?: number;
      'max-image-preview'?: 'none' | 'standard' | 'large';
      'max-snippet'?: number;
    };
  };
  verification?: {
    google?: string;
    yandex?: string;
    yahoo?: string;
    other?: Record<string, string>;
  };
}

// 搜索结果项接口
export interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: 'post' | 'project' | 'page';
  category?: string;
  tags?: string[];
  publishedAt?: string;
  score?: number; 
}

// 主题相关接口
export interface ThemeConfig {
  defaultTheme: 'light' | 'dark' | 'system';
  enableSystemTheme: boolean;
  storageKey: string;
}

// 文件上传相关接口
export interface FileUploadConfig {
  maxSize: number;  
  allowedTypes: string[];
  uploadPath: string;
}

// 错误信息接口
export interface ErrorInfo {
  code: string;
  message: string;
  details?: any;
  stack?: string;
  timestamp: string;
}

// 统计数据接口
export interface StatsData {
  views: number;
  likes: number;
  shares?: number;
  comments?: number;
  readingTime?: number; 
}

// 内容状态枚举
export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SCHEDULED = 'scheduled'
}

// 排序方向枚举
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

// 内容类型枚举
export enum ContentType {
  POST = 'post',
  PROJECT = 'project',
  SNIPPET = 'snippet',
  PAGE = 'page'
}

// 分析事件接口
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: string;
  userId?: string;
  sessionId?: string;
}

// 表单字段接口
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  options?: { value: string; label: string }[];
}

// 通知消息接口
export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;  
  action?: {
    label: string;
    onClick: () => void;
  };
}

// 缓存配置接口
export interface CacheConfig {
  ttl: number; 
  maxSize?: number;  
  strategy: 'memory' | 'redis' | 'filesystem';
}

// MDX 前置数据接口（通用部分）
export interface FrontMatter {
  title: string;
  description?: string;
  date: string;
  author?: string;
  tags?: string[];
  category?: string;
  image?: string;
  featured?: boolean;
  draft?: boolean;
  slug?: string;
  readingTime?: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
}

// 自定义 Hook 类型定义 - 为项目中的自定义 React Hook 提供类型支持
// 确保 Hook 的参数和返回值类型安全

// useLocalStorage Hook 类型
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prevValue: T) => T)) => void;
  removeValue: () => void;
  isLoading: boolean;
  error: Error | null;
}

// useDebounce Hook 类型
export interface UseDebounceOptions {
  delay: number;
  leading?: boolean; // 是否在延迟开始前执行
  trailing?: boolean; // 是否在延迟结束后执行
  maxWait?: number; // 最大等待时间
}

export interface UseDebounceReturn<T> {
  debouncedValue: T;
  isPending: boolean;
  cancel: () => void;
  flush: () => void;
}

// useMediaQuery Hook 类型
export interface UseMediaQueryReturn {
  matches: boolean;
  isLoading: boolean;
  error: Error | null;
}

// useScroll Hook 类型
export interface UseScrollPosition {
  x: number;
  y: number;
}

export interface UseScrollReturn {
  position: UseScrollPosition;
  direction: 'up' | 'down' | 'left' | 'right' | null;
  isScrolling: boolean;
  reachedTop: boolean;
  reachedBottom: boolean;
  reachedLeft: boolean;
  reachedRight: boolean;
  scrollTo: (options: ScrollToOptions) => void;
  scrollToTop: (smooth?: boolean) => void;
  scrollToBottom: (smooth?: boolean) => void;
}

// useIntersectionObserver Hook 类型
export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean; // 一旦可见就冻结观察
  trackVisibility?: boolean; // 追踪可见性变化
}

export interface UseIntersectionObserverReturn {
  ref: React.RefObject<Element>;
  isVisible: boolean;
  entry: IntersectionObserverEntry | null;
  observer: IntersectionObserver | null;
}

// useToggle Hook 类型
export interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
  setValue: (value: boolean) => void;
}

// useCounter Hook 类型
export interface UseCounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
  add: (value: number) => void;
  subtract: (value: number) => void;
}

// useCopyToClipboard Hook 类型
export interface UseCopyToClipboardReturn {
  copiedText: string | null;
  copy: (text: string) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
}

// useAsync Hook 类型
export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncReturn<T> extends UseAsyncState<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

// useFetch Hook 类型
export interface UseFetchOptions extends RequestInit {
  immediate?: boolean; // 是否立即执行
  retry?: number; // 重试次数
  retryDelay?: number; // 重试延迟
  timeout?: number; // 超时时间
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (url?: string, options?: RequestInit) => Promise<T>;
  cancel: () => void;
  retry: () => Promise<T>;
}

// useForm Hook 类型
export interface UseFormFieldConfig {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  validate?: (value: any) => string | boolean;
}

export interface UseFormConfig {
  initialValues?: Record<string, any>;
  fields?: Record<string, UseFormFieldConfig>;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormFieldState {
  value: any;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

export interface UseFormReturn {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  getFieldProps: (name: string) => {
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    error: string | null;
    touched: boolean;
  };
  setFieldValue: (name: string, value: any) => void;
  setFieldError: (name: string, error: string) => void;
  setFieldTouched: (name: string, touched: boolean) => void;
  validateField: (name: string) => string | null;
  validateForm: () => boolean;
  resetForm: () => void;
  submitForm: () => Promise<void>;
}

// useTheme Hook 类型
export interface UseThemeReturn {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  systemTheme: 'light' | 'dark';
}

// useKeyPress Hook 类型
export interface UseKeyPressOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  target?: React.RefObject<Element> | Element | Window;
}

export interface UseKeyPressReturn {
  isPressed: boolean;
}

// useClickOutside Hook 类型
export interface UseClickOutsideReturn {
  ref: React.RefObject<HTMLElement>;
}

// useHover Hook 类型
export interface UseHoverReturn {
  ref: React.RefObject<HTMLElement>;
  isHovered: boolean;
}

// useFocus Hook 类型
export interface UseFocusReturn {
  ref: React.RefObject<HTMLElement>;
  isFocused: boolean;
  focus: () => void;
  blur: () => void;
}

// useWindowSize Hook 类型
export interface UseWindowSizeReturn {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// useEventListener Hook 类型
export interface UseEventListenerOptions {
  passive?: boolean;
  capture?: boolean;
  once?: boolean;
}

// useInterval Hook 类型
export interface UseIntervalReturn {
  start: () => void;
  stop: () => void;
  toggle: () => void;
  reset: () => void;
  isActive: boolean;
}

// useTimeout Hook 类型
export interface UseTimeoutReturn {
  start: () => void;
  stop: () => void;
  reset: () => void;
  isActive: boolean;
}

// usePrevious Hook 类型
export type UsePreviousReturn<T> = T | undefined;

// useUpdateEffect Hook 类型 (类似 useEffect 但跳过第一次渲染)
export type UseUpdateEffectCallback = React.EffectCallback;
export type UseUpdateEffectDeps = React.DependencyList;

// useMount Hook 类型
export type UseMountCallback = () => void | (() => void);

// useUnmount Hook 类型
export type UseUnmountCallback = () => void;

// useIsomorphicLayoutEffect Hook 类型
export type UseIsomorphicLayoutEffectCallback = React.EffectCallback;
export type UseIsomorphicLayoutEffectDeps = React.DependencyList;

// 综合的自定义 Hook 类型集合
export interface CustomHookTypes {
  UseLocalStorageReturn: UseLocalStorageReturn<any>;
  UseDebounceReturn: UseDebounceReturn<any>;
  UseMediaQueryReturn: UseMediaQueryReturn;
  UseScrollReturn: UseScrollReturn;
  UseIntersectionObserverReturn: UseIntersectionObserverReturn;
  UseToggleReturn: UseToggleReturn;
  UseCounterReturn: UseCounterReturn;
  UseCopyToClipboardReturn: UseCopyToClipboardReturn;
  UseAsyncReturn: UseAsyncReturn<any>;
  UseFetchReturn: UseFetchReturn<any>;
  UseFormReturn: UseFormReturn;
  UseThemeReturn: UseThemeReturn;
  UseKeyPressReturn: UseKeyPressReturn;
  UseClickOutsideReturn: UseClickOutsideReturn;
  UseHoverReturn: UseHoverReturn;
  UseFocusReturn: UseFocusReturn;
  UseWindowSizeReturn: UseWindowSizeReturn;
  UseIntervalReturn: UseIntervalReturn;
  UseTimeoutReturn: UseTimeoutReturn;
}
