import { NextRequest, NextResponse } from 'next/server'
import { withApiHandler, createOptionsHandler, createSuccessResponse, API_ERRORS, validateRequired, validateEmail } from '@/lib/services/api'

// 邮件订阅处理器
async function newsletterSubscriptionHandler(request: NextRequest) {
  const body = await request.json()
  const { email, name, frequency } = body

  // 验证必需字段
  validateRequired(body, ['email'])
  
  // 验证邮箱格式
  if (!validateEmail(email)) {
    throw API_ERRORS.VALIDATION_ERROR('邮箱格式无效')
  }

  // 这里应该实现实际的邮件订阅逻辑
  // 例如：保存到数据库，发送确认邮件等
  
  // 模拟API响应
  console.log('Newsletter subscription:', { email, name, frequency })
  
  return NextResponse.json(
    createSuccessResponse(
      { 
        email,
        subscribed: true,
        timestamp: new Date().toISOString()
      },
      '订阅成功！请查收确认邮件'
    )
  )
}

export const POST = withApiHandler(newsletterSubscriptionHandler, { 
  rateLimitKey: 'default'
})

// OPTIONS - CORS支持
export const OPTIONS = createOptionsHandler()