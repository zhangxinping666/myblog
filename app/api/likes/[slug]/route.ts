import { NextRequest, NextResponse } from 'next/server'
import { 
  toggleLike,
  getPostLikesWithUserStatus,
  getAllLikes,
  getMostLikedPosts,
  getLikesStats,
  getUserLikeHistory
} from '@/lib/storage/likes'
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


// GET /api/likes/[slug] - 获取文章点赞数据
async function getLikesHandler(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  const ip = getClientIP(request)
  
  if (!slug) {
    throw API_ERRORS.BAD_REQUEST('文章slug不能为空')
  }

  // 检查特殊路由：统计数据
  if (slug === 'stats') {
    const stats = getLikesStats()
    return NextResponse.json(createSuccessResponse(stats, '统计数据获取成功'))
  }

  // 检查特殊路由：热门文章
  if (slug === 'popular') {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const popularPosts = getMostLikedPosts(limit)
    return NextResponse.json(createSuccessResponse(popularPosts, '热门文章获取成功'))
  }

  // 检查特殊路由：所有点赞数据（需要管理员权限）
  if (slug === 'all') {
    const allLikes = getAllLikes()
    return NextResponse.json(createSuccessResponse(allLikes, '所有点赞数据获取成功'))
  }
  // 检查特殊路由：用户点赞历史
  if (slug === 'user-history') {
    const userHistory = getUserLikeHistory(ip)
    return NextResponse.json(createSuccessResponse(userHistory, '用户历史获取成功'))
  }
  // 验证文章是否存在
  const postExists = await validatePost(slug)
  if (!postExists) {
    throw API_ERRORS.NOT_FOUND('文章不存在')
  }
  // 获取文章点赞数据（包含用户状态）
  const likeData = getPostLikesWithUserStatus(slug, ip)
  
  return NextResponse.json(createSuccessResponse(
    {
      slug,
      ...likeData
    },
    '点赞数据获取成功'
  ))
}

export const GET = withApiHandler(getLikesHandler, { 
  rateLimitKey: 'default'
})

// POST /api/likes/[slug] - 切换点赞状态
async function toggleLikeHandler(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  const ip = getClientIP(request)
  
  if (!slug) {
    throw API_ERRORS.BAD_REQUEST('文章slug不能为空')
  }

  // 验证文章是否存在
  const postExists = await validatePost(slug)
  if (!postExists) {
    throw API_ERRORS.NOT_FOUND('文章不存在')
  }

  // 获取用户信息
  const userAgent = request.headers.get('user-agent') || undefined

  // 切换点赞状态
  const result = toggleLike(slug, ip, userAgent)
  
  return NextResponse.json(
    createSuccessResponse(
      {
        slug,
        liked: result.liked,
        likesCount: result.likesCount,
        timestamp: new Date().toISOString()
      },
      result.message
    ),
    { 
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    }
  )
}

export const POST = withApiHandler(toggleLikeHandler, { 
  rateLimitKey: 'likes'
})

// PUT /api/likes/[slug] - 批量操作点赞（管理员功能）
async function batchLikesHandler(
  _request: NextRequest,
  { params: _params }: { params: { slug: string } }
): Promise<NextResponse> {
  throw API_ERRORS.NOT_IMPLEMENTED('批量操作功能暂未实现')
}

export const PUT = withApiHandler(batchLikesHandler, { 
  requireAdmin: true,
  rateLimitKey: 'default'
})

// DELETE /api/likes/[slug] - 重置文章点赞数（管理员功能）
async function resetLikesHandler(
  _request: NextRequest,
  { params: _params }: { params: { slug: string } }
): Promise<NextResponse> {
  throw API_ERRORS.NOT_IMPLEMENTED('重置功能暂未实现')
}

export const DELETE = withApiHandler(resetLikesHandler, { 
  requireAdmin: true,
  rateLimitKey: 'default'
})

// OPTIONS - CORS支持
export const OPTIONS = createOptionsHandler()