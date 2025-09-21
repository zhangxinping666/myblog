import { HTMLAttributes } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

// MDX 组件映射
export const MDXComponents = {
  // 标题
  h1: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn('text-4xl font-bold mt-8 mb-4', className)} {...props} />
  ),
  h2: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn('text-3xl font-semibold mt-6 mb-3', className)} {...props} />
  ),
  h3: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn('text-2xl font-semibold mt-4 mb-2', className)} {...props} />
  ),
  
  // 段落和文本
  p: ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('leading-7 mb-4', className)} {...props} />
  ),
  
  // 链接
  a: ({ href, children, ...props }: any) => {
    const isExternal = href?.startsWith('http')
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
          {...props}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className="text-primary hover:underline" {...props}>
        {children}
      </Link>
    )
  },
  
  // 列表
  ul: ({ className, ...props }: HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('list-disc list-inside mb-4 space-y-1', className)} {...props} />
  ),
  ol: ({ className, ...props }: HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn('list-decimal list-inside mb-4 space-y-1', className)} {...props} />
  ),
  
  // 代码块
  code: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        'mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4',
        className
      )}
      {...props}
    />
  ),
  
  // 引用
  blockquote: ({ className, ...props }: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        'mt-6 border-l-4 border-primary pl-4 italic text-muted-foreground',
        className
      )}
      {...props}
    />
  ),
  
  // 分隔线
  hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,
  
  // 表格
  table: ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
    <div className="mb-4 overflow-x-auto">
      <table className={cn('w-full border-collapse', className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        'border border-border px-4 py-2 text-left font-bold',
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn('border border-border px-4 py-2', className)}
      {...props}
    />
  ),
}

export default MDXComponents
