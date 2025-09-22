import fs from 'fs'
import path from 'path'

// 点赞数据类型
interface LikeData {
  slug: string
  likes: number
  likeHistory: LikeRecord[]
  lastLikedAt: string | null
  firstLikedAt: string | null
}

interface LikeRecord {
  timestamp: string
  ip: string
  userAgent?: string | undefined
  action: 'like' | 'unlike'
  userIdentifier: string // IP的hash或者用户ID
}

interface LikesDatabase {
  [slug: string]: LikeData
}

// 用户点赞状态
interface UserLikeStatus {
  [userIdentifier: string]: {
    [slug: string]: boolean
  }
}

// 数据存储路径
const DATA_DIR = path.join(process.cwd(), 'data')
const LIKES_FILE = path.join(DATA_DIR, 'likes.json')
const USER_LIKES_FILE = path.join(DATA_DIR, 'user-likes.json')

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// 生成用户标识符（基于IP的简单hash）
function generateUserIdentifier(ip: string): string {
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash 
  }
  return Math.abs(hash).toString(36)
}

// 读取点赞数据
function readLikesData(): LikesDatabase {
  ensureDataDir()
  try {
    if (fs.existsSync(LIKES_FILE)) {
      const data = fs.readFileSync(LIKES_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading likes data:', error)
  }
  return {}
}

// 写入点赞数据
function writeLikesData(data: LikesDatabase) {
  ensureDataDir()
  try {
    fs.writeFileSync(LIKES_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing likes data:', error)
    throw new Error('无法保存点赞数据')
  }
}

// 读取用户点赞状态
function readUserLikesData(): UserLikeStatus {
  ensureDataDir()
  try {
    if (fs.existsSync(USER_LIKES_FILE)) {
      const data = fs.readFileSync(USER_LIKES_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading user likes data:', error)
  }
  return {}
}

// 写入用户点赞状态
function writeUserLikesData(data: UserLikeStatus) {
  ensureDataDir()
  try {
    fs.writeFileSync(USER_LIKES_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing user likes data:', error)
    throw new Error('无法保存用户点赞状态')
  }
}

// 检查用户是否已经点赞
export function hasUserLiked(ip: string, slug: string): boolean {
  const userIdentifier = generateUserIdentifier(ip)
  const userLikes = readUserLikesData()
  return userLikes[userIdentifier]?.[slug] === true
}

// 切换点赞状态
export function toggleLike(
  slug: string,
  ip: string,
  userAgent?: string|undefined
): { success: boolean; liked: boolean; likesCount: number; message: string } {
  const userIdentifier = generateUserIdentifier(ip)
  const now = new Date().toISOString()
  // 读取数据
  const likesData = readLikesData()
  const userLikes = readUserLikesData()
  // 初始化文章数据
  if (!likesData[slug]) {
    likesData[slug] = {
      slug,
      likes: 0,
      likeHistory: [],
      lastLikedAt: null,
      firstLikedAt: null
    }
  }
  // 初始化用户数据
  if (!userLikes[userIdentifier]) {
    userLikes[userIdentifier] = {}
  }
  const postData = likesData[slug]
  const currentlyLiked = userLikes[userIdentifier][slug] === true
  let message: string
  let liked: boolean
  if (currentlyLiked) {
    // 取消点赞
    postData.likes = Math.max(0, postData.likes - 1)
    userLikes[userIdentifier][slug] = false
    liked = false
    message = '已取消点赞'
    // 添加取消点赞记录
    postData.likeHistory.push({
      timestamp: now,
      ip,
      userAgent,
      action: 'unlike',
      userIdentifier
    })
  } else {
    // 点赞
    postData.likes += 1
    userLikes[userIdentifier][slug] = true
    liked = true
    message = '点赞成功'
    
    // 更新时间戳
    postData.lastLikedAt = now
    if (!postData.firstLikedAt) {
      postData.firstLikedAt = now
    }
    
    // 添加点赞记录
    postData.likeHistory.push({
      timestamp: now,
      ip,
      userAgent,
      action: 'like',
      userIdentifier
    })
  }
  
  // 限制历史记录长度
  if (postData.likeHistory.length > 200) {
    postData.likeHistory = postData.likeHistory.slice(-200)
  }
  
  // 保存数据
  writeLikesData(likesData)
  writeUserLikesData(userLikes)
  
  return {
    success: true,
    liked,
    likesCount: postData.likes,
    message
  }
}

// 获取文章点赞数据
export function getPostLikes(slug: string): LikeData | null {
  const likesData = readLikesData()
  return likesData[slug] || null
}

// 获取文章点赞数据（包含用户状态）
export function getPostLikesWithUserStatus(slug: string, ip: string): {
  likes: number
  userLiked: boolean
  lastLikedAt: string | null
} {
  const postData = getPostLikes(slug)
  const userLiked = hasUserLiked(ip, slug)
  
  return {
    likes: postData?.likes || 0,
    userLiked,
    lastLikedAt: postData?.lastLikedAt || null
  }
}

// 获取所有点赞数据
export function getAllLikes(): LikesDatabase {
  return readLikesData()
}

// 获取热门文章（按点赞量排序）
export function getMostLikedPosts(limit: number = 10): Array<{ slug: string; likes: number }> {
  const likesData = readLikesData()
  
  return Object.values(likesData)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, limit)
    .map(post => ({
      slug: post.slug,
      likes: post.likes
    }))
}

// 获取点赞统计
export function getLikesStats(): {
  totalPosts: number
  totalLikes: number
  averageLikes: number
  mostLikedPost: { slug: string; likes: number } | null
  recentActivity: {
    likesLast24h: number
    likesLast7d: number
    likesLast30d: number
  }
} {
  const likesData = readLikesData()
  const posts = Object.values(likesData)
  
  if (posts.length === 0) {
    return {
      totalPosts: 0,
      totalLikes: 0,
      averageLikes: 0,
      mostLikedPost: null,
      recentActivity: {
        likesLast24h: 0,
        likesLast7d: 0,
        likesLast30d: 0
      }
    }
  }
  
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0)
  const mostLikedPost = posts.reduce((max, post) => 
    post.likes > max.likes ? post : max
  )
  
  // 计算最近活动
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  const week = 7 * day
  const month = 30 * day
  
  let likesLast24h = 0
  let likesLast7d = 0
  let likesLast30d = 0
  
  posts.forEach(post => {
    post.likeHistory.forEach(record => {
      if (record.action === 'like') {
        const recordTime = new Date(record.timestamp).getTime()
        const timeDiff = now - recordTime
        
        if (timeDiff <= day) likesLast24h++
        if (timeDiff <= week) likesLast7d++
        if (timeDiff <= month) likesLast30d++
      }
    })
  })
  
  return {
    totalPosts: posts.length,
    totalLikes,
    averageLikes: Math.round(totalLikes / posts.length),
    mostLikedPost: {
      slug: mostLikedPost.slug,
      likes: mostLikedPost.likes
    },
    recentActivity: {
      likesLast24h,
      likesLast7d,
      likesLast30d
    }
  }
}

// 获取用户的所有点赞状态
export function getUserLikeHistory(ip: string): { [slug: string]: boolean } {
  const userIdentifier = generateUserIdentifier(ip)
  const userLikes = readUserLikesData()
  
  return userLikes[userIdentifier] || {}
}