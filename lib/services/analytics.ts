import { getAllPosts } from '@/lib/mdx/mdx'
import { getAllViews, getViewsStats } from '@/lib/storage/views'
import { getAllLikes, getLikesStats } from '@/lib/storage/likes'

// 分析数据类型定义
export interface AnalyticsData {
  overview: {
    totalPosts: number
    totalViews: number
    totalLikes: number
    totalUniqueViews: number
    averageViewsPerPost: number
    averageLikesPerPost: number
    engagementRate: number // 点赞率 (likes/views)
  }
  
  topPosts: {
    byViews: Array<{ slug: string; title: string; views: number; uniqueViews: number }>
    byLikes: Array<{ slug: string; title: string; likes: number }>
    byEngagement: Array<{ slug: string; title: string; engagementScore: number }>
  }
  
  categoryStats: Array<{
    category: string
    postCount: number
    totalViews: number
    totalLikes: number
    averageViews: number
    averageLikes: number
  }>
  
  tagStats: Array<{
    tag: string
    postCount: number
    totalViews: number
    totalLikes: number
  }>
  
  timeStats: {
    postsPerMonth: Array<{ month: string; count: number }>
    viewsLast30Days: number
    likesLast30Days: number
    recentActivity: {
      last24h: { views: number; likes: number }
      last7d: { views: number; likes: number }
      last30d: { views: number; likes: number }
    }
  }
  
  performance: {
    topPerformingCategories: Array<{ category: string; avgEngagement: number }>
    publishingFrequency: {
      postsThisMonth: number
      postsLastMonth: number
      trend: 'up' | 'down' | 'stable'
    }
  }
}

// 搜索分析数据类型
export interface SearchAnalytics {
  topQueries: Array<{ query: string; count: number; avgResults: number }>
  zeroResultQueries: Array<{ query: string; count: number }>
  searchTrends: {
    totalSearches: number
    avgSearchTime: number
    successRate: number // 有结果的搜索比例
  }
}

// 用户行为分析
export interface UserBehaviorAnalytics {
  sessionStats: {
    averageSessionDuration: number
    bounceRate: number
    pagesPerSession: number
  }
  
  trafficSources: Array<{
    source: string
    sessions: number
    percentage: number
  }>
  
  deviceStats: {
    mobile: number
    desktop: number
    tablet: number
  }
  
  geographyStats: Array<{
    country: string
    sessions: number
    percentage: number
  }>
}

// 内容性能分析
export interface ContentPerformance {
  readingPatterns: {
    averageReadingTime: number
    completionRate: number // 读完文章的用户比例
    scrollDepth: number // 平均滚动深度
  }
  
  contentEffectiveness: {
    viewToLikeRatio: number
    shareRate: number
    commentRate: number
  }
  
  contentGaps: Array<{
    suggestedTopic: string
    demandScore: number
    competitionScore: number
  }>
}

// 获取基础分析数据
export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    // 获取基础数据
    const [posts, viewsData, likesData, viewsStats, likesStats] = await Promise.all([
      getAllPosts(),
      getAllViews(),
      getAllLikes(),
      getViewsStats(),
      getLikesStats()
    ])

    // 计算概览数据
    const overview = {
      totalPosts: posts.length,
      totalViews: viewsStats.totalViews,
      totalLikes: likesStats.totalLikes,
      totalUniqueViews: viewsStats.totalUniqueViews,
      averageViewsPerPost: viewsStats.averageViews,
      averageLikesPerPost: likesStats.averageLikes,
      engagementRate: viewsStats.totalViews > 0 ? (likesStats.totalLikes / viewsStats.totalViews) * 100 : 0
    }

    // 热门文章分析
    const topPosts = await getTopPostsAnalysis(posts, viewsData, likesData)
    
    // 分类统计
    const categoryStats = await getCategoryStats(posts, viewsData, likesData)
    
    // 标签统计
    const tagStats = await getTagStats(posts, viewsData, likesData)
    
    // 时间统计
    const timeStats = await getTimeStats(posts, likesStats.recentActivity)
    
    // 性能分析
    const performance = await getPerformanceAnalysis(posts, categoryStats)

    return {
      overview,
      topPosts,
      categoryStats,
      tagStats,
      timeStats,
      performance
    }
  } catch (error) {
    console.error('Analytics data generation error:', error)
    throw new Error('无法生成分析数据')
  }
}

// 热门文章分析
async function getTopPostsAnalysis(posts: any[], viewsData: any, likesData: any) {
  const postsWithStats = posts.map(post => {
    const views = viewsData[post.slug]?.views || 0
    const uniqueViews = viewsData[post.slug]?.uniqueViews || 0
    const likes = likesData[post.slug]?.likes || 0
    const engagementScore = views > 0 ? (likes / views) * 100 + Math.log(views + 1) : 0
    
    return {
      slug: post.slug,
      title: post.frontMatter.title,
      views,
      uniqueViews,
      likes,
      engagementScore
    }
  })

  return {
    byViews: postsWithStats
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)
      .map(p => ({ slug: p.slug, title: p.title, views: p.views, uniqueViews: p.uniqueViews })),
      
    byLikes: postsWithStats
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10)
      .map(p => ({ slug: p.slug, title: p.title, likes: p.likes })),
      
    byEngagement: postsWithStats
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 10)
      .map(p => ({ slug: p.slug, title: p.title, engagementScore: Math.round(p.engagementScore * 100) / 100 }))
  }
}

// 分类统计分析
async function getCategoryStats(posts: any[], viewsData: any, likesData: any) {
  const categoryMap = new Map<string, {
    postCount: number
    totalViews: number
    totalLikes: number
    posts: string[]
  }>()

  posts.forEach(post => {
    const category = post.frontMatter.category || '未分类'
    const views = viewsData[post.slug]?.views || 0
    const likes = likesData[post.slug]?.likes || 0

    if (!categoryMap.has(category)) {
      categoryMap.set(category, {
        postCount: 0,
        totalViews: 0,
        totalLikes: 0,
        posts: []
      })
    }

    const categoryData = categoryMap.get(category)!
    categoryData.postCount += 1
    categoryData.totalViews += views
    categoryData.totalLikes += likes
    categoryData.posts.push(post.slug)
  })

  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    postCount: data.postCount,
    totalViews: data.totalViews,
    totalLikes: data.totalLikes,
    averageViews: Math.round(data.totalViews / data.postCount),
    averageLikes: Math.round(data.totalLikes / data.postCount)
  })).sort((a, b) => b.totalViews - a.totalViews)
}

// 标签统计分析
async function getTagStats(posts: any[], viewsData: any, likesData: any) {
  const tagMap = new Map<string, {
    postCount: number
    totalViews: number
    totalLikes: number
  }>()

  posts.forEach(post => {
    const tags = post.frontMatter.tags || []
    const views = viewsData[post.slug]?.views || 0
    const likes = likesData[post.slug]?.likes || 0

    tags.forEach((tag: string) => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, {
          postCount: 0,
          totalViews: 0,
          totalLikes: 0
        })
      }

      const tagData = tagMap.get(tag)!
      tagData.postCount += 1
      tagData.totalViews += views
      tagData.totalLikes += likes
    })
  })

  return Array.from(tagMap.entries()).map(([tag, data]) => ({
    tag,
    postCount: data.postCount,
    totalViews: data.totalViews,
    totalLikes: data.totalLikes
  })).sort((a, b) => b.totalViews - a.totalViews).slice(0, 20)
}

// 时间统计分析
async function getTimeStats(posts: any[], recentActivity: any) {
  // 按月统计文章数量
  const monthMap = new Map<string, number>()
  
  posts.forEach(post => {
    const date = new Date(post.frontMatter.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1)
  })

  const postsPerMonth = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }))

  return {
    postsPerMonth,
    viewsLast30Days: 0, // 这里需要从实际数据计算
    likesLast30Days: recentActivity.likesLast30d || 0,
    recentActivity: {
      last24h: { 
        views: 0, // 需要从views数据计算
        likes: recentActivity.likesLast24h || 0 
      },
      last7d: { 
        views: 0, // 需要从views数据计算
        likes: recentActivity.likesLast7d || 0 
      },
      last30d: { 
        views: 0, // 需要从views数据计算
        likes: recentActivity.likesLast30d || 0 
      }
    }
  }
}

// 性能分析
async function getPerformanceAnalysis(posts: any[], categoryStats: any[]) {
  // 最佳表现的分类
  const topPerformingCategories = categoryStats
    .map(cat => ({
      category: cat.category,
      avgEngagement: cat.totalViews > 0 ? (cat.totalLikes / cat.totalViews) * 100 : 0
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement)
    .slice(0, 5)

  // 发布频率趋势
  const now = new Date()
  const thisMonth = posts.filter(post => {
    const postDate = new Date(post.frontMatter.date)
    return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear()
  }).length

  const lastMonth = posts.filter(post => {
    const postDate = new Date(post.frontMatter.date)
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return postDate.getMonth() === lastMonthDate.getMonth() && postDate.getFullYear() === lastMonthDate.getFullYear()
  }).length

  let trend: 'up' | 'down' | 'stable' = 'stable'
  if (thisMonth > lastMonth) trend = 'up'
  else if (thisMonth < lastMonth) trend = 'down'

  return {
    topPerformingCategories,
    publishingFrequency: {
      postsThisMonth: thisMonth,
      postsLastMonth: lastMonth,
      trend
    }
  }
}

// 生成分析报告
export async function generateAnalyticsReport(): Promise<{
  summary: string
  insights: string[]
  recommendations: string[]
  data: AnalyticsData
}> {
  const data = await getAnalyticsData()
  
  // 生成摘要
  const summary = `
博客总共有 ${data.overview.totalPosts} 篇文章，
累计获得 ${data.overview.totalViews} 次浏览和 ${data.overview.totalLikes} 个点赞。
平均每篇文章获得 ${data.overview.averageViewsPerPost} 次浏览，
用户参与率为 ${data.overview.engagementRate.toFixed(2)}%。
  `.trim()

  // 生成洞察
  const insights = [
    `最受欢迎的文章是"${data.topPosts.byViews[0]?.title}"，获得了 ${data.topPosts.byViews[0]?.views} 次浏览`,
    `${data.categoryStats[0]?.category} 分类表现最佳，共有 ${data.categoryStats[0]?.postCount} 篇文章`,
    `本月发布了 ${data.performance.publishingFrequency.postsThisMonth} 篇文章，趋势为${data.performance.publishingFrequency.trend === 'up' ? '上升' : data.performance.publishingFrequency.trend === 'down' ? '下降' : '稳定'}`,
    `最活跃的标签是"${data.tagStats[0]?.tag}"，出现在 ${data.tagStats[0]?.postCount} 篇文章中`
  ]

  // 生成建议
  const recommendations = []
  
  if (data.overview.engagementRate < 5) {
    recommendations.push('考虑提高内容质量以增加用户参与度')
  }
  
  if (data.performance.publishingFrequency.trend === 'down') {
    recommendations.push('保持稳定的发布频率以维持读者关注')
  }
  
  if (data.categoryStats.length > 0) {
    const topCategory = data.categoryStats[0]
    if (topCategory) {
      recommendations.push(`继续在"${topCategory.category}"分类创作内容，该分类表现良好`)
    }
  }

  return {
    summary,
    insights,
    recommendations,
    data
  }
}

// 实时统计数据
export function getRealTimeStats() {
  return {
    activeUsers: 0, // 当前在线用户数，需要实现WebSocket或其他实时统计
    recentViews: 0, // 最近一小时的浏览量
    recentLikes: 0, // 最近一小时的点赞数
    timestamp: new Date().toISOString()
  }
}

// 导出数据为CSV格式
export async function exportAnalyticsData(format: 'json' | 'csv' = 'json'): Promise<string> {
  const data = await getAnalyticsData()
  
  if (format === 'json') {
    return JSON.stringify(data, null, 2)
  }
  
  // CSV格式导出（简化版）
  const csv = [
    'Category,Post Count,Total Views,Total Likes,Average Views,Average Likes',
    ...data.categoryStats.map(cat => 
      `${cat.category},${cat.postCount},${cat.totalViews},${cat.totalLikes},${cat.averageViews},${cat.averageLikes}`
    )
  ].join('\n')
  
  return csv
}

// 预测分析（简单版本）
export async function getPredictiveAnalytics(): Promise<{
  nextMonthViews: number
  contentSuggestions: string[]
  growthForecast: 'positive' | 'negative' | 'stable'
}> {
  const data = await getAnalyticsData()
  
  // 简单的线性预测
  const recentMonths = data.timeStats.postsPerMonth.slice(-3)
  let avgGrowth = 0
  
  if (recentMonths.length > 1) {
    const firstMonth = recentMonths[0]
    const lastMonth = recentMonths[recentMonths.length - 1]
    if (firstMonth && lastMonth) {
      avgGrowth = (lastMonth.count - firstMonth.count) / recentMonths.length
    }
  }
  
  const nextMonthViews = Math.max(0, data.overview.totalViews + (avgGrowth * data.overview.averageViewsPerPost))
  
  // 内容建议基于表现良好的分类和标签
  const contentSuggestions = [
    `考虑创作更多关于 "${data.categoryStats[0]?.category}" 的内容`,
    `"${data.tagStats[0]?.tag}" 标签很受欢迎，可以深入探索`,
    data.performance.publishingFrequency.trend === 'down' 
      ? '增加发布频率以提高用户参与度' 
      : '保持当前的发布节奏'
  ]
  
  let growthForecast: 'positive' | 'negative' | 'stable' = 'stable'
  if (avgGrowth > 0.5) growthForecast = 'positive'
  else if (avgGrowth < -0.5) growthForecast = 'negative'
  
  return {
    nextMonthViews: Math.round(nextMonthViews),
    contentSuggestions,
    growthForecast
  }
}