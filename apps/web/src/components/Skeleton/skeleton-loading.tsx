import { Skeleton } from '@/components/ui/skeleton'
import { SkeletonCard } from './skeleton-card'
import { cn } from '@/lib/utils'

export function SkeletonLoading({ type, className }: { type: 'form' | 'full' | 'one-line' | 'avatar' | 'chart', className?: string }) {
  switch (type) {
    case 'full':
      return (
        <div className="my-10 flex flex-col gap-y-10">
          <div className="flex gap-10">
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
          </div>
          <div className="flex gap-x-10">
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
          </div>
          <div className="flex gap-x-10">
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
          </div>
          <div className="flex gap-x-10">
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
          </div>
        </div>
      )
    case 'chart':
      return (
        <div className="ml-6 flex flex-col gap-y-10">
          <div className="flex gap-10">
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
            <SkeletonCard className={className} />
          </div>
        </div>
      )
    case 'avatar':
      return (
        <div className="flex items-center space-x-4">
          <Skeleton className={cn('size-12 rounded-full', className)} />
          <div className="space-y-2">
            <Skeleton className={cn('h-4 w-36', className)} />
            <Skeleton className={cn('h-4 w-24', className)} />
          </div>
        </div>
      )
    case 'one-line':
      return <Skeleton className={cn('h-4 w-[250px]', className)} />
    default:
      return (
        <div className="flex items-center space-x-4">
          <Skeleton className={cn('h-[125px] w-[250px] rounded-xl', className)} />
          <div className="space-y-2">
            <Skeleton className={cn('h-4 w-[250px]', className)} />
            <Skeleton className={cn('h-4 w-[200px]', className)} />
          </div>
        </div>
      )
  }
}
