import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { useFormField } from './form'

type IconProps = {
  startIcon?: React.ReactElement
  endIcon?: React.ReactElement
  endText?: string
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps & IconProps>(
  (
    {
      className,
      type = 'text',
      startIcon,
      endIcon,
      endText,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const { error } = useFormField()
    const { t } = useTranslation()

    return (
      <div className="relative">
        {startIcon}
        <input
          type={type}
          className={cn(
            'block w-full appearance-none rounded-md border border-secondary-600 px-3 py-2 text-black shadow-sm placeholder:text-secondary-700 focus:outline-2 focus:outline-outline focus:ring-outline disabled:cursor-not-allowed disabled:bg-secondary-500 disabled:opacity-70',
            {
              'pl-10': startIcon,
              'pr-10': endIcon,
              'border-primary focus:outline-primary': error != null,
            },
            className,
          )}
          maxLength={256}
          ref={ref}
          placeholder={placeholder ?? t('placeholder:input_text')}
          {...props}
        />
        {endIcon}
        {endText && (
          <span className="ml-2 text-xs font-medium text-black">{endText}</span>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
