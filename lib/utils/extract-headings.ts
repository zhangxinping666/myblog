// 服务端标题提取工具
export interface HeadingItem {
  id: string
  title: string
  level: number
}

// 从Markdown内容中提取标题 - 服务端版本
export function extractHeadingsFromContent(content: string): HeadingItem[] {
  const lines = content.split('\n')
  const headings: HeadingItem[] = []
  const usedIds = new Set<string>() // 跟踪已使用的ID

  lines.forEach((line) => {
    const match = line.match(/^(#{1,6})\s+(.+)/)
    if (match) {
      const level = match[1].length
      const title = match[2].trim()
      let id = generateIdFromText(title)
      
      // 如果ID已存在，添加数字后缀使其唯一
      let counter = 1
      const originalId = id
      while (usedIds.has(id)) {
        id = `${originalId}-${counter}`
        counter++
      }
      
      usedIds.add(id)
      
      headings.push({
        id,
        title,
        level,
      })
    }
  })

  return headings
}

// 从文本生成ID - 服务端版本
function generateIdFromText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // 保留中文、英文、数字、空格、连字符
    .replace(/\s+/g, '-') // 将空格替换为连字符
    .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
}