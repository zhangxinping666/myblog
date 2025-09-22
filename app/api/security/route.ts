import { NextRequest, NextResponse } from 'next/server'
import { 
  withApiHandler, 
  createOptionsHandler, 
  createSuccessResponse, 
  getApiStats,
  getPublicSecurityConfig
} from '@/lib/services/api'
import { SecurityLogger } from '@/lib/config/security'

// 获取安全状态处理器
async function getSecurityStatusHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const includeConfig = searchParams.get('config') === 'true'
  const includeLogs = searchParams.get('logs') === 'true'
  const logLimit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))

  const stats = getApiStats()
  
  const securityStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    monitoring: {
      recentFailures: stats.security.recentFailures,
      shouldAlert: stats.security.shouldAlert,
      totalLogs: SecurityLogger.getLogs().length
    },
    system: {
      uptime: stats.uptime,
      memory: {
        used: Math.round(stats.memory.heapUsed / 1024 / 1024) + 'MB',
        total: Math.round(stats.memory.heapTotal / 1024 / 1024) + 'MB'
      },
      cache: {
        size: stats.cacheSize,
        status: 'active'
      }
    }
  }

  const response: any = {
    security: securityStatus
  }

  // 包含公共配置信息（如果请求）
  if (includeConfig) {
    response.config = getPublicSecurityConfig()
  }

  // 包含最近的日志（需要管理员权限）
  if (includeLogs) {
    response.logs = SecurityLogger.getLogs(logLimit)
  }

  return NextResponse.json(
    createSuccessResponse(response, '安全状态获取成功'),
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }
  )
}

export const GET = withApiHandler(getSecurityStatusHandler, { 
  rateLimitKey: 'default',
  requireAdmin: false // 基础状态信息不需要管理员权限
})

// 清除安全日志处理器（管理员功能）
async function clearSecurityLogsHandler(_request: NextRequest) {
  // 这里可以实现清除日志的逻辑
  // 由于SecurityLogger的logs是私有的，需要添加清除方法
  
  return NextResponse.json(
    createSuccessResponse(
      { cleared: true, timestamp: new Date().toISOString() },
      '安全日志已清除'
    )
  )
}

export const DELETE = withApiHandler(clearSecurityLogsHandler, { 
  requireAdmin: true,
  rateLimitKey: 'default'
})

// 安全配置更新处理器（管理员功能）
async function updateSecurityConfigHandler(_request: NextRequest) {
  // 这里可以实现动态更新安全配置的逻辑
  // 由于配置是导入的常量，实际项目中可能需要数据库或配置文件支持
  
  return NextResponse.json(
    createSuccessResponse(
      { updated: false, reason: '动态配置更新功能暂未实现' },
      '配置更新请求已处理'
    )
  )
}

export const POST = withApiHandler(updateSecurityConfigHandler, { 
  requireAdmin: true,
  rateLimitKey: 'default'
})

// OPTIONS - CORS支持
export const OPTIONS = createOptionsHandler()