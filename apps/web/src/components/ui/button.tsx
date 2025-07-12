import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { useSpinDelay } from 'spin-delay'

import { cn } from '@/lib/utils'

import { Spinner } from '../spinner'

const buttonVariants = cva(
  'h-9 flex cursor-pointer items-center justify-center rounded-md font-medium gap-x-2 border border-btn shadow-xs focus:outline-hidden disabled:cursor-not-allowed disabled:bg-secondary-500 disabled:opacity-70',
  {
    variants: {
      variant: {
        primary: 'min-w-24 bg-primary! text-white!',
        secondary: 'bg-secondary-600', // hover:bg-secondary/80
        secondaryLight: 'min-w-24 bg-secondary-500 border-none',
        danger: 'min-w-24 bg-primary-200! text-primary border-none',
        trans: 'bg-transparent border-none',
        muted: 'bg-white',
        outline:
          'border-input bg-background hover:bg-accent hover:text-accent-foreground',
        none: 'bg-transparent shadow-none border-none',
        full: 'block w-full bg-white border-secondary-600',
        pagination: 'min-w-9 bg-white! p-2!',
        search: 'bg-search border-none p-2!',
        disable:
          'min-w-24 bg-secondary-500 text-secondary-700 border-none cursor-not-allowed opacity-70',
        downloadFile: 'bg-green-100 text-green-500 border-none',
      },
      size: {
        sm: 'py-2 px-3',
        md: 'py-2 px-6',
        lg: 'py-3 px-8',
        square: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export type IconProps =
  | { startIcon: React.ReactElement, endIcon?: never }
  | { endIcon: React.ReactElement, startIcon?: never }
  | { endIcon?: undefined, startIcon?: undefined }

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isLoading?: boolean
    labelClassName?: string;
  } & IconProps

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      startIcon,
      endIcon,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild
      ? Slot
      : 'button'
    const showSpinner = useSpinDelay(isLoading, {
      delay: 150,
      minDuration: 300,
    })

    return (
      <Comp
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={showSpinner}
        {...props}
      >
        {showSpinner && (
          <Spinner size="sm" variant="primary" className="text-current" />
        )}
        <span className={cn("flex items-center gap-x-2", props.labelClassName)}>
          {!showSpinner && startIcon}
          {props.children}
          {!showSpinner && endIcon}
        </span>
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
