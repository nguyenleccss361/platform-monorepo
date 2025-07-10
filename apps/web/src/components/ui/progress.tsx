import * as ProgressPrimitive from '@radix-ui/react-progress'
import * as React from 'react'

import { cn } from '@/lib/utils'

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    isLoading?: boolean
    isTable?: boolean
  }
>(({ className, value, isLoading, isTable, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'absolute h-[2px] w-full overflow-hidden bg-secondary',
      className,
      {
        'animate-loading-bar bg-primary': isLoading,
      },
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn('size-full flex-1 bg-primary transition-all', {
        'bg-secondary': isTable && !isLoading,
        'bg-primary': isTable && isLoading,
      })}
      style={{
        transform: value
          ? `translateX(-${100 - (value || 0)}%)`
          : isLoading
            ? 'translate-x-0'
            : 'translate-x-full',
      }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
