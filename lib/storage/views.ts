import fs from 'fs'
import path from 'path'

// 浏览数据类型
interface ViewData {
  slug: string
  views: number
  uniqueViews: number
  lastViewedAt: string
  firstViewedAt: string
  viewHistory: ViewRecord[]
}

interface ViewRecord {
  timestamp: string
  ip: string
  userAgent?: string | undefined
  referrer?: string|undefined
}

interface ViewsDatabase {
  [slug: string]: ViewData
}

// 访问记录类型（用于防刷）
interface VisitRecord {
  ip: string
  timestamp: number
  slug: string
}

// 数据存储路径
const DATA_DIR = path.join(process.cwd(), 'data')
const VIEWS_FILE = path.join(DATA_DIR, 'views.json')
const VISITS_FILE = path.join(DATA_DIR, 'visits.json')

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// 读取浏览数据
function readViewsData(): ViewsDatabase {
  ensureDataDir()
  
  try {
    if (fs.existsSync(VIEWS_FILE)) {
      const data = fs.readFileSync(VIEWS_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading views data:', error)
  }
  
  return {}
}

// 写入浏览数据
function writeViewsData(data: ViewsDatabase) {
  ensureDataDir()
  
  try {
    fs.writeFileSync(VIEWS_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing views data:', error)
    throw new Error('无法保存浏览数据')
  }
}

// 读取访问记录（防刷用）
function readVisitsData(): VisitRecord[] {
  ensureDataDir()
  
  try {
    if (fs.existsSync(VISITS_FILE)) {
      const data = fs.readFileSync(VISITS_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading visits data:', error)
  }
  
  return []
}

// 写入访问记录
function writeVisitsData(data: VisitRecord[]) {
  ensureDataDir()
  
  try {
    // 只保留最近24小时的记录
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    const recentVisits = data.filter(visit => visit.timestamp > oneDayAgo)
    
    fs.writeFileSync(VISITS_FILE, JSON.stringify(recentVisits, null, 2))
  } catch (error) {
    console.error('Error writing visits data:', error)
  }
}

// 检查是否为有效访问（防刷逻辑）
export function isValidView(ip: string, slug: string): boolean {
  const visits = readVisitsData()
  const now = Date.now()
  const fifteenMinutesAgo = now - 15 * 60 * 1000 // 15分钟冷却时间
  
  // 检查同一IP在15分钟内是否已经访问过同一篇文章
  const recentVisit = visits.find(
    visit => visit.ip === ip && 
             visit.slug === slug && 
             visit.timestamp > fifteenMinutesAgo
  )
  
  return !recentVisit
}

// 记录访问
export function recordVisit(ip: string, slug: string) {
  const visits = readVisitsData()
  
  visits.push({
    ip,
    slug,
    timestamp: Date.now()
  })
  
  writeVisitsData(visits)
}

// 增加浏览量
export function incrementViews(
  slug: string, 
  ip: string, 
  userAgent?: string|undefined, 
  referrer?: string|undefined
): ViewData {
  const viewsData = readViewsData()
  const now = new Date().toISOString()
  
  if (!viewsData[slug]) {
    viewsData[slug] = {
      slug,
      views: 0,
      uniqueViews: 0,
      lastViewedAt: now,
      firstViewedAt: now,
      viewHistory: []
    }
  }
  
  const postData = viewsData[slug]
  
  // 检查是否为新的独立访问者
  const isUniqueView = !postData.viewHistory.some(
    record => record.ip === ip
  )
  
  // 更新数据
  postData.views += 1
  if (isUniqueView) {
    postData.uniqueViews += 1
  }
  postData.lastViewedAt = now
  
  // 添加访问记录（只保留最近100条）
  postData.viewHistory.push({
    timestamp: now,
    ip,
    userAgent,
    referrer
  })
  
  if (postData.viewHistory.length > 100) {
    postData.viewHistory = postData.viewHistory.slice(-100)
  }
  
  writeViewsData(viewsData)
  recordVisit(ip, slug)
  
  return postData
}

// 获取单篇文章浏览数据
export function getPostViews(slug: string): ViewData | null {
  const viewsData = readViewsData()
  return viewsData[slug] || null
}

// 获取所有文章浏览数据
export function getAllViews(): ViewsDatabase {
  return readViewsData()
}

// 获取热门文章（按浏览量排序）
export function getPopularPosts(limit: number = 10): Array<{ slug: string; views: number; uniqueViews: number }> {
  const viewsData = readViewsData()
  
  return Object.values(viewsData)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
    .map(post => ({
      slug: post.slug,
      views: post.views,
      uniqueViews: post.uniqueViews
    }))
}

// 获取统计摘要
export function getViewsStats(): {
  totalPosts: number
  totalViews: number
  totalUniqueViews: number
  averageViews: number
  mostViewedPost: { slug: string; views: number } | null
} {
  const viewsData = readViewsData()
  const posts = Object.values(viewsData)
  
  if (posts.length === 0) {
    return {
      totalPosts: 0,
      totalViews: 0,
      totalUniqueViews: 0,
      averageViews: 0,
      mostViewedPost: null
    }
  }
  
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0)
  const totalUniqueViews = posts.reduce((sum, post) => sum + post.uniqueViews, 0)
  const mostViewedPost = posts.reduce((max, post) => 
    post.views > max.views ? post : max
  )
  
  return {
    totalPosts: posts.length,
    totalViews,
    totalUniqueViews,
    averageViews: Math.round(totalViews / posts.length),
    mostViewedPost: {
      slug: mostViewedPost.slug,
      views: mostViewedPost.views
    }
  }
}