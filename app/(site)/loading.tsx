import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container py-8 space-y-8">
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-16 w-96 mx-auto" />
          <Skeleton className="h-8 w-[600px] mx-auto" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </section>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4 p-6 border rounded-lg">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">加载中...</span>
      </div>
    </div>
  )
}