import { cn } from '@/lib/utils'
import { type ReactElement } from 'react'

export function TitleBar({
  title,
  className,
}: {
  title: string | ReactElement
  className?: string | Record<string, boolean>
}) {
  return (
    <h2 className={cn('flex items-center text-2xl font-[600]', className)}>
      {title}
    </h2>
  )
}
