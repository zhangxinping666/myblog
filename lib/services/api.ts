import { NextRequest, NextResponse } from 'next/server'
import { 
  SECURITY_CONFIG,
  getSecurityHeaders,
  validateApiKey,
  validateAdminToken,
  isWhitelistedIP,
  hasSuspiciousContent,
  SecurityLogger
} from '@/lib/config/security'

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
  timestamp?: string
  requestId?: string
}

// 错误类型
export class ApiError extends Error {
  public statusCode: number
  public code: string
  public details?: any

  constructor(
    message: string, 
    statusCode: number = 500, 
    code: string = 'INTERNAL_ERROR',
    details?: any
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

// 常见错误定义
export const API_ERRORS = {
  // 4xx 客户端错误
  BAD_REQUEST: (message = '请求参数无效') => new ApiError(message, 400, 'BAD_REQUEST'),
  UNAUTHORIZED: (message = '未授权访问') => new ApiError(message, 401, 'UNAUTHORIZED'),
  FORBIDDEN: (message = '权限不足') => new ApiError(message, 403, 'FORBIDDEN'),
  NOT_FOUND: (message = '资源不存在') => new ApiError(message, 404, 'NOT_FOUND'),
  METHOD_NOT_ALLOWED: (message = '请求方法不允许') => new ApiError(message, 405, 'METHOD_NOT_ALLOWED'),
  CONFLICT: (message = '资源冲突') => new ApiError(message, 409, 'CONFLICT'),
  VALIDATION_ERROR: (message = '数据验证失败') => new ApiError(message, 422, 'VALIDATION_ERROR'),
  RATE_LIMITED: (message = '请求过于频繁') => new ApiError(message, 429, 'RATE_LIMITED'),
  
  // 5xx 服务器错误
  INTERNAL_ERROR: (message = '服务器内部错误') => new ApiError(message, 500, 'INTERNAL_ERROR'),
  NOT_IMPLEMENTED: (message = '功能未实现') => new ApiError(message, 501, 'NOT_IMPLEMENTED'),
  SERVICE_UNAVAILABLE: (message = '服务不可用') => new ApiError(message, 503, 'SERVICE_UNAVAILABLE'),
}

// 缓存管理器
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private maxSize = 1000 // 最大缓存项数

  set(key: string, value: any, ttlSeconds: number = 300): void {
    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  // 清理过期项
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// 全局缓存实例
export const cache = new CacheManager()

// 定期清理过期缓存（每5分钟）
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    cache.cleanup()
  }, 5 * 60 * 1000)
}

// 请求限流管理器
class RateLimiter {
  private requests = new Map<string, number[]>()
  private windowMs: number
  private maxRequests: number

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    let requests = this.requests.get(identifier) || []
    
    // 清理过期的请求记录
    requests = requests.filter(timestamp => timestamp > windowStart)
    
    if (requests.length >= this.maxRequests) {
      return true
    }
    
    // 记录当前请求
    requests.push(now)
    this.requests.set(identifier, requests)
    
    return false
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    const requests = this.requests.get(identifier) || []
    const validRequests = requests.filter(timestamp => timestamp > windowStart)
    
    return Math.max(0, this.maxRequests - validRequests.length)
  }

  getResetTime(identifier: string): number {
    const requests = this.requests.get(identifier) || []
    if (requests.length === 0) return 0
    
    const oldestRequest = Math.min(...requests)
    return oldestRequest + this.windowMs
  }
}

// 全局限流器实例
export const rateLimiter = new RateLimiter()

// 生成请求ID
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 获取客户端IP
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  
  if (realIP) return realIP
  if (cfConnectingIP) return cfConnectingIP
  
  return 'unknown'
}

// 创建成功响应
export function createSuccessResponse<T>(
  data: T, 
  message?: string,
  requestId?: string
): ApiResponse<T> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  }
  
  if (message !== undefined) {
    response.message = message
  }
  
  if (requestId !== undefined) {
    response.requestId = requestId
  }
  
  return response
}

// 创建错误响应
export function createErrorResponse(
  error: string | ApiError,
  requestId?: string
): ApiResponse {
  if (typeof error === 'string') {
    const response: ApiResponse = {
      success: false,
      error,
      timestamp: new Date().toISOString(),
    }
    
    if (requestId !== undefined) {
      response.requestId = requestId
    }
    
    return response
  }

  const response: ApiResponse = {
    success: false,
    error: error.message,
    code: error.code,
    timestamp: new Date().toISOString(),
  }
  
  if (requestId !== undefined) {
    response.requestId = requestId
  }
  
  return response
}

// 增强的API路由处理器包装器
export function withApiHandler(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  options: {
    requireApiKey?: boolean
    requireAdmin?: boolean
    rateLimitKey?: keyof typeof SECURITY_CONFIG.rateLimit
    skipSuspiciousContentCheck?: boolean
  } = {}
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const requestId = generateRequestId()
    const startTime = Date.now()
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const origin = request.headers.get('origin')
    
    // 添加请求ID到headers（如果支持）
    try {
      request.headers.set('x-request-id', requestId)
    } catch {
      // 忽略只读错误
    }

    try {
      // 1. IP白名单检查（用于管理功能）
      if (options.requireAdmin && !isWhitelistedIP(clientIP)) {
        SecurityLogger.log('warning', 'Admin access from non-whitelisted IP', {
          ip: clientIP,
          userAgent,
          extra: { endpoint: request.url }
        })
        
        return NextResponse.json(
          createErrorResponse(API_ERRORS.FORBIDDEN('IP not whitelisted'), requestId),
          { 
            status: 403,
            headers: getSecurityHeaders(origin || undefined)
          }
        )
      }

      // 2. API密钥验证
      if (options.requireApiKey) {
        const apiKey = request.headers.get(SECURITY_CONFIG.apiKeys.header)
        if (!apiKey || !validateApiKey(apiKey)) {
          SecurityLogger.log('warning', 'Invalid or missing API key', {
            ip: clientIP,
            userAgent,
            extra: { endpoint: request.url, hasKey: !!apiKey }
          })
          
          return NextResponse.json(
            createErrorResponse(API_ERRORS.UNAUTHORIZED('Invalid API key'), requestId),
            { 
              status: 401,
              headers: getSecurityHeaders(origin || undefined)
            }
          )
        }
      }

      // 3. 管理员令牌验证
      if (options.requireAdmin) {
        const adminToken = request.headers.get(SECURITY_CONFIG.admin.header)
        if (!adminToken || !validateAdminToken(adminToken)) {
          SecurityLogger.log('warning', 'Invalid or missing admin token', {
            ip: clientIP,
            userAgent,
            extra: { endpoint: request.url, hasToken: !!adminToken }
          })
          
          return NextResponse.json(
            createErrorResponse(API_ERRORS.FORBIDDEN('Invalid admin token'), requestId),
            { 
              status: 403,
              headers: getSecurityHeaders(origin || undefined)
            }
          )
        }
      }

      // 4. 请求大小检查
      const contentLength = request.headers.get('content-length')
      if (contentLength && parseInt(contentLength) > SECURITY_CONFIG.contentSecurity.maxRequestSize) {
        SecurityLogger.log('warning', 'Request size too large', {
          ip: clientIP,
          userAgent,
          extra: { endpoint: request.url, size: contentLength }
        })
        
        return NextResponse.json(
          createErrorResponse(API_ERRORS.BAD_REQUEST('Request too large'), requestId),
          { 
            status: 413,
            headers: getSecurityHeaders(origin || undefined)
          }
        )
      }

      // 5. 可疑内容检查
      if (!options.skipSuspiciousContentCheck && (request.method === 'POST' || request.method === 'PUT')) {
        try {
          const body = await request.clone().text()
          if (hasSuspiciousContent(body)) {
            SecurityLogger.log('warning', 'Suspicious content detected', {
              ip: clientIP,
              userAgent,
              extra: { endpoint: request.url, bodyPreview: body.slice(0, 100) }
            })
            
            return NextResponse.json(
              createErrorResponse(API_ERRORS.BAD_REQUEST('Invalid request content'), requestId),
              { 
                status: 400,
                headers: getSecurityHeaders(origin || undefined)
              }
            )
          }
        } catch {
          // 忽略解析错误，继续处理
        }
      }

      // 6. 限流检查
      const rateLimitConfig = options.rateLimitKey 
        ? SECURITY_CONFIG.rateLimit[options.rateLimitKey]
        : SECURITY_CONFIG.rateLimit.default
      
      const specificRateLimiter = new RateLimiter(rateLimitConfig.windowMs, rateLimitConfig.maxRequests)
      
      if (specificRateLimiter.isRateLimited(clientIP)) {
        const resetTime = specificRateLimiter.getResetTime(clientIP)
        const remaining = specificRateLimiter.getRemainingRequests(clientIP)
        
        SecurityLogger.log('info', 'Rate limit exceeded', {
          ip: clientIP,
          userAgent,
          extra: { endpoint: request.url, limit: rateLimitConfig.maxRequests }
        })
        
        const securityHeaders = getSecurityHeaders(origin || undefined)
        return NextResponse.json(
          createErrorResponse(API_ERRORS.RATE_LIMITED(), requestId),
          {
            status: 429,
            headers: {
              ...securityHeaders,
              'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
              'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
            }
          }
        )
      }

      // 7. 执行处理器
      const response = await handler(request, context)
      
      // 8. 添加安全响应头
      const securityHeaders = getSecurityHeaders(origin || undefined)
      const duration = Date.now() - startTime
      
      // 添加所有安全头
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      // 添加请求追踪头
      response.headers.set('X-Request-ID', requestId)
      response.headers.set('X-Response-Time', `${duration}ms`)
      
      // 记录成功响应
      if (response.status >= 400) {
        SecurityLogger.log('warning', `API Error Response: ${response.status}`, {
          ip: clientIP,
          userAgent,
          extra: { endpoint: request.url, duration, status: response.status }
        })
      } else {
        SecurityLogger.log('info', `API Success: ${response.status}`, {
          ip: clientIP,
          userAgent,
          extra: { endpoint: request.url, duration }
        })
      }
      
      return response
      
    } catch (error) {
      // 错误处理
      const duration = Date.now() - startTime
      
      let apiError: ApiError
      
      if (error instanceof ApiError) {
        apiError = error
      } else if (error instanceof Error) {
        apiError = new ApiError(error.message, 500, 'INTERNAL_ERROR')
      } else {
        apiError = new ApiError('未知错误', 500, 'UNKNOWN_ERROR')
      }
      
      SecurityLogger.log('error', `API Exception: ${apiError.message}`, {
        ip: clientIP,
        userAgent,
        extra: { 
          endpoint: request.url, 
          duration, 
          errorCode: apiError.code,
          stack: error instanceof Error ? error.stack : undefined
        }
      })
      
      const securityHeaders = getSecurityHeaders(origin || undefined)
      
      return NextResponse.json(
        createErrorResponse(apiError, requestId),
        {
          status: apiError.statusCode,
          headers: {
            ...securityHeaders,
            'X-Request-ID': requestId,
            'X-Response-Time': `${duration}ms`,
          }
        }
      )
    }
  }
}

// 数据验证辅助函数
export function validateRequired(data: any, fields: string[]): void {
  const missing = fields.filter(field => {
    const value = data[field]
    return value === undefined || value === null || value === ''
  })
  
  if (missing.length > 0) {
    throw API_ERRORS.VALIDATION_ERROR(`缺少必需字段: ${missing.join(', ')}`)
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 缓存装饰器
export function withCache(
  keyGenerator: (request: NextRequest, context?: any) => string,
  ttlSeconds: number = 300
) {
  return function (
    handler: (request: NextRequest, context?: any) => Promise<NextResponse>
  ) {
    return async (request: NextRequest, context?: any): Promise<NextResponse> => {
      const cacheKey = keyGenerator(request, context)
      
      // 尝试从缓存获取
      const cached = cache.get(cacheKey)
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            'X-Cache': 'HIT',
            'Cache-Control': `public, max-age=${ttlSeconds}`,
          }
        })
      }
      
      // 执行处理器
      const response = await handler(request, context)
      
      // 如果是成功响应，缓存结果
      if (response.status === 200) {
        try {
          const data = await response.json()
          cache.set(cacheKey, data, ttlSeconds)
          
          return NextResponse.json(data, {
            headers: {
              'X-Cache': 'MISS',
              'Cache-Control': `public, max-age=${ttlSeconds}`,
            }
          })
        } catch {
          // 如果无法解析JSON，直接返回原响应
          return response
        }
      }
      
      return response
    }
  }
}

// API统计信息
export function getApiStats() {
  return {
    cacheSize: cache.size(),
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    security: {
      recentLogs: SecurityLogger.getLogs(10),
      recentFailures: SecurityLogger.getFailedAttempts().length,
      shouldAlert: SecurityLogger.shouldAlert()
    }
  }
}

// 创建OPTIONS处理器（用于CORS预检）
export function createOptionsHandler() {
  return async (request: NextRequest) => {
    const origin = request.headers.get('origin')
    const securityHeaders = getSecurityHeaders(origin || undefined)
    
    return new NextResponse(null, {
      status: 200,
      headers: securityHeaders
    })
  }
}

// 安全状态检查中间件
export function withSecurityCheck() {
  return withApiHandler(async (request: NextRequest) => {
    const stats = getApiStats()
    console.log(request)
    
    return NextResponse.json({
      success: true,
      data: {
        status: 'healthy',
        security: {
          rateLimitActive: true,
          securityHeadersActive: true,
          monitoringActive: SECURITY_CONFIG.monitoring.logFailedAttempts,
          apiKeysRequired: SECURITY_CONFIG.apiKeys.enabled,
          adminFeaturesEnabled: SECURITY_CONFIG.admin.enabled,
          recentFailures: stats.security.recentFailures,
          shouldAlert: stats.security.shouldAlert
        },
        timestamp: stats.timestamp
      }
    })
  }, { rateLimitKey: 'default' })
}

// 导出安全配置（用于客户端CORS检查）
export function getPublicSecurityConfig() {
  return {
    cors: {
      allowOrigin: SECURITY_CONFIG.cors.allowOrigin,
      allowMethods: SECURITY_CONFIG.cors.allowMethods,
      allowHeaders: SECURITY_CONFIG.cors.allowHeaders
    },
    rateLimit: {
      // 只暴露窗口时间，不暴露具体限制
      windows: Object.keys(SECURITY_CONFIG.rateLimit).reduce((acc, key) => {
        acc[key] = {
          windowMs: SECURITY_CONFIG.rateLimit[key as keyof typeof SECURITY_CONFIG.rateLimit].windowMs
        }
        return acc
      }, {} as Record<string, { windowMs: number }>)
    },
    features: {
      apiKeysEnabled: SECURITY_CONFIG.apiKeys.enabled,
      adminFeaturesEnabled: SECURITY_CONFIG.admin.enabled,
      whitelistEnabled: SECURITY_CONFIG.whitelist.enabled
    }
  }
}