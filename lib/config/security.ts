// 安全配置
export const SECURITY_CONFIG = {
  // CORS配置
  cors: {
    allowOrigin: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com', 'https://www.yourdomain.com'] 
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With', 
      'Accept', 
      'Origin', 
      'User-Agent',
      'X-Request-ID'
    ],
    exposeHeaders: [
      'X-Request-ID',
      'X-Response-Time',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset'
    ],
    maxAge: 86400 // 24小时
  },

  // 安全头配置
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; media-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self';"
  },

  // 限流配置
  rateLimit: {
    // 默认限流：每分钟100请求
    default: {
      windowMs: 60 * 1000, // 1分钟
      maxRequests: 100
    },
    // 搜索API：每分钟30请求
    search: {
      windowMs: 60 * 1000,
      maxRequests: 30
    },
    // 浏览量更新：每分钟10请求
    views: {
      windowMs: 60 * 1000,
      maxRequests: 10
    },
    // 点赞：每分钟5请求
    likes: {
      windowMs: 60 * 1000,
      maxRequests: 5
    },
    // OG图片生成：每分钟20请求
    og: {
      windowMs: 60 * 1000,
      maxRequests: 20
    },
    // RSS：每分钟60请求
    rss: {
      windowMs: 60 * 1000,
      maxRequests: 60
    }
  },

  // API密钥配置（如果需要）
  apiKeys: {
    enabled: process.env['API_KEYS_ENABLED'] === 'true',
    header: 'X-API-Key',
    keys: process.env['API_KEYS']?.split(',') || []
  },

  // 管理员配置
  admin: {
    enabled: process.env['ADMIN_FEATURES_ENABLED'] === 'true',
    token: process.env['ADMIN_TOKEN'] || '',
    header: 'X-Admin-Token'
  },

  // IP白名单（用于管理功能）
  whitelist: {
    enabled: process.env['IP_WHITELIST_ENABLED'] === 'true',
    ips: process.env['WHITELISTED_IPS']?.split(',') || []
  },

  // 内容安全策略
  contentSecurity: {
    maxRequestSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    sanitizeInput: true
  },

  // 监控配置
  monitoring: {
    logFailedAttempts: true,
    alertThreshold: 100, // 每小时超过100次失败请求时告警
    blacklistDuration: 24 * 60 * 60 * 1000, // 24小时黑名单
    suspiciousPatterns: [
      /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b/i, // SQL注入
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // XSS
      /[<>"\']/, // HTML注入
    ]
  }
}

// 验证API密钥
export function validateApiKey(key: string): boolean {
  if (!SECURITY_CONFIG.apiKeys.enabled) {
    return true // 如果未启用API密钥验证，则通过
  }
  
  return SECURITY_CONFIG.apiKeys.keys.includes(key)
}

// 验证管理员令牌
export function validateAdminToken(token: string): boolean {
  if (!SECURITY_CONFIG.admin.enabled || !SECURITY_CONFIG.admin.token) {
    return false
  }
  
  return token === SECURITY_CONFIG.admin.token
}

// 检查IP是否在白名单中
export function isWhitelistedIP(ip: string): boolean {
  if (!SECURITY_CONFIG.whitelist.enabled) {
    return true
  }
  
  return SECURITY_CONFIG.whitelist.ips.includes(ip)
}

// 检查请求是否包含可疑内容
export function hasSuspiciousContent(content: string): boolean {
  if (!SECURITY_CONFIG.monitoring.logFailedAttempts) {
    return false
  }
  
  return SECURITY_CONFIG.monitoring.suspiciousPatterns.some(pattern => 
    pattern.test(content)
  )
}

// 清理输入内容
export function sanitizeInput(input: string): string {
  if (!SECURITY_CONFIG.contentSecurity.sanitizeInput) {
    return input
  }
  
  return input
    .replace(/[<>]/g, '') // 移除HTML标签
    .replace(/['"]/g, '') // 移除引号
    .replace(/javascript:/gi, '') // 移除JavaScript协议
    .replace(/on\w+=/gi, '') // 移除事件处理器
    .trim()
}

// 生成安全的响应头
export function getSecurityHeaders(origin?: string): Record<string, string> {
  const headers: Record<string, string> = { ...SECURITY_CONFIG.securityHeaders }
  
  // 处理CORS头
  if (origin && SECURITY_CONFIG.cors.allowOrigin.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  } else if (process.env['NODE_ENV'] === 'development') {
    headers['Access-Control-Allow-Origin'] = '*'
  }
  
  headers['Access-Control-Allow-Methods'] = SECURITY_CONFIG.cors.allowMethods.join(', ')
  headers['Access-Control-Allow-Headers'] = SECURITY_CONFIG.cors.allowHeaders.join(', ')
  headers['Access-Control-Expose-Headers'] = SECURITY_CONFIG.cors.exposeHeaders.join(', ')
  headers['Access-Control-Max-Age'] = SECURITY_CONFIG.cors.maxAge.toString()
  
  return headers
}

// 日志记录器
export class SecurityLogger {
  private static logs: Array<{
    timestamp: number
    type: 'warning' | 'error' | 'info'
    message: string
    ip?: string
    userAgent?: string
    details?: any
  }> = []

  static log(type: 'warning' | 'error' | 'info', message: string, details?: {
    ip?: string
    userAgent?: string
    extra?: any
  }) {
    if (!SECURITY_CONFIG.monitoring.logFailedAttempts) {
      return
    }

    const logEntry: any = {
      timestamp: Date.now(),
      type,
      message,
    }
    
    if (details?.ip) {
      logEntry.ip = details.ip
    }
    if (details?.userAgent) {
      logEntry.userAgent = details.userAgent
    }
    if (details?.extra) {
      logEntry.details = details.extra
    }

    this.logs.push(logEntry)

    // 保持日志数量在合理范围内
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-500)
    }

    // 输出到控制台
    console.log(`[SECURITY:${type.toUpperCase()}] ${message}`, details)
  }

  static getLogs(limit: number = 100) {
    return this.logs.slice(-limit)
  }

  static getFailedAttempts(timeWindow: number = 60 * 60 * 1000) {
    const now = Date.now()
    return this.logs.filter(log => 
      (log.type === 'warning' || log.type === 'error') &&
      (now - log.timestamp) < timeWindow
    )
  }

  static shouldAlert(): boolean {
    const recentFailures = this.getFailedAttempts()
    return recentFailures.length > SECURITY_CONFIG.monitoring.alertThreshold
  }
}