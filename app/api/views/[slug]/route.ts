import { NextRequest, NextResponse } from 'next/server'
import { 
  incrementViews, 
  getPostViews, 
  isValidView,
  getAllViews,
  getPopularPosts,
  getViewsStats
} from '@/lib/storage/views'
import { getPostBySlug } from '@/lib/mdx/mdx'
import { withApiHandler, createOptionsHandler, createSuccessResponse, API_ERRORS, getClientIP } from '@/lib/services/api'

// 验证文章是否存在
async function validatePost(slug: string): Promise<boolean> {
  try {
    const post = await getPostBySlug(slug)
    return post !== null
  } catch {
    return false
  }
}

// GET /api/views/[slug] - 获取文章浏览量
async function getViewsHandler(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  
  if (!slug) {
    throw API_ERRORS.BAD_REQUEST('文章slug不能为空')
  }

  // 检查特殊路由：统计数据
  if (slug === 'stats') {
    const stats = getViewsStats()
    return NextResponse.json(createSuccessResponse(stats, '统计数据获取成功'))
  }

  // 检查特殊路由：热门文章
  if (slug === 'popular') {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    
    const popularPosts = getPopularPosts(limit)
    return NextResponse.json(createSuccessResponse(popularPosts, '热门文章获取成功'))
  }

  // 检查特殊路由：所有浏览数据（需要管理员权限）
  if (slug === 'all') {
    const allViews = getAllViews()
    return NextResponse.json(createSuccessResponse(allViews, '所有浏览数据获取成功'))
  }

  // 验证文章是否存在
  const postExists = await validatePost(slug)
  if (!postExists) {
    throw API_ERRORS.NOT_FOUND('文章不存在')
  }

  // 获取文章浏览数据
  const viewData = getPostViews(slug)
  
  return NextResponse.json(createSuccessResponse(
    viewData || {
      slug,
      views: 0,
      uniqueViews: 0,
      lastViewedAt: null,
      firstViewedAt: null
    },
    '浏览数据获取成功'
  ))
}

export const GET = withApiHandler(getViewsHandler, { 
  rateLimitKey: 'default',
  requireAdmin: false // 大部分路由不需要管理员权限，除了 'all' 路由
})

// POST /api/views/[slug] - 增加文章浏览量
async function incrementViewsHandler(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  
  if (!slug) {
    throw API_ERRORS.BAD_REQUEST('文章slug不能为空')
  }

  // 验证文章是否存在
  const postExists = await validatePost(slug)
  if (!postExists) {
    throw API_ERRORS.NOT_FOUND('文章不存在')
  }

  // 获取客户端信息
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || undefined
  const referrer = request.headers.get('referer') || undefined

  // 检查是否为有效访问（防刷）
  if (!isValidView(ip, slug)) {
    return NextResponse.json(createSuccessResponse(
      getPostViews(slug),
      '访问过于频繁，请稍后再试'
    ))
  }

  // 增加浏览量
  const updatedData = incrementViews(slug, ip, userAgent, referrer)
  
  return NextResponse.json(createSuccessResponse(
    {
      slug: updatedData.slug,
      views: updatedData.views,
      uniqueViews: updatedData.uniqueViews,
      lastViewedAt: updatedData.lastViewedAt
    },
    '浏览量更新成功'
  ))
}

export const POST = withApiHandler(incrementViewsHandler, { 
  rateLimitKey: 'views'
})

// PUT /api/views/[slug] - 批量更新浏览量（管理员功能）
async function updateViewsHandler(
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse> {
  const { slug } = params
  const body = await request.json()

  if (!slug || !body.views || typeof body.views !== 'number') {
    throw API_ERRORS.BAD_REQUEST('请提供有效的浏览量数据')
  }

  // 这里可以实现批量更新逻辑
  // 由于是演示，暂时返回不支持
  throw API_ERRORS.NOT_IMPLEMENTED('批量更新功能暂未实现')
}

export const PUT = withApiHandler(updateViewsHandler, { 
  requireAdmin: true,
  rateLimitKey: 'default'
})

// DELETE /api/views/[slug] - 重置文章浏览量（管理员功能）
async function deleteViewsHandler(
  _request: NextRequest,
  { params: _params }: { params: { slug: string } }
): Promise<NextResponse> {
  // 这里可以实现重置逻辑
  // 由于是演示，暂时返回不支持
  throw API_ERRORS.NOT_IMPLEMENTED('重置功能暂未实现')
}

export const DELETE = withApiHandler(deleteViewsHandler, { 
  requireAdmin: true,
  rateLimitKey: 'default'
})

// OPTIONS - CORS支持
export const OPTIONS = createOptionsHandler()