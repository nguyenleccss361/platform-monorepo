import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className={cn('h-[125px] w-[250px] rounded-xl', className)} />
      <div className="space-y-2">
        <Skeleton className={cn('h-4 w-[250px]', className)} />
        <Skeleton className={cn('h-4 w-[200px]', className)} />
      </div>
    </div>
  )
}
