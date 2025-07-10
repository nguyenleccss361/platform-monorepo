import * as React from 'react'

import { cn } from '@/lib/utils'

import { useFormField } from './form'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const { error } = useFormField()

    return (
      <textarea
        className={cn(
          'block w-full appearance-none rounded-md border border-secondary-600 px-3 py-2 text-black shadow-sm placeholder:text-secondary-700 focus:outline-2 focus:outline-outline focus:ring-outline disabled:cursor-not-allowed disabled:bg-secondary-500 disabled:opacity-70',
          className,
          {
            'border-primary focus:outline-primary': error != null,
          },
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
