// Contentlayer 配置暂时注释掉，使用自定义 MDX 处理
// 由于版本兼容性问题，我们使用 lib/mdx/mdx.ts 中的自定义处理

// export const Post = defineDocumentType(() => ({
//   name: 'Post',
//   filePathPattern: `**/*.mdx`,
//   contentType: 'mdx',
//   // ... 配置内容
// }))

// export default makeSource({
//   contentDirPath: 'content/posts',
//   documentTypes: [Post],
// })

// 导出空配置以避免构建错误
export const Post = null
export default null