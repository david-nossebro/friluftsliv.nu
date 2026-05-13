'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-medium',
    'transition-all duration-[120ms] ease-out active:translate-y-px',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-pine text-snow shadow-sm hover:bg-pine-dark hover:shadow-md',
        secondary: [
          'bg-white text-pine',
          'ring-1 ring-inset ring-birch',
          'hover:bg-mist hover:ring-moss',
        ],
        ghost: 'bg-transparent text-pine hover:bg-pine/10',
        accent: 'bg-ember text-white shadow-sm hover:bg-ember-dark hover:shadow-md',
        icon: [
          'bg-white text-pine',
          'ring-1 ring-inset ring-birch',
          'hover:bg-mist hover:ring-moss',
        ],
      },
      size: {
        sm: 'text-2xs px-4 py-2 rounded-md',
        md: 'text-sm px-[22px] py-[11px] rounded-md',
        lg: 'text-base px-7 py-[14px] rounded-lg',
        xl: 'text-lg px-9 py-[18px] rounded-lg',
      },
      pill: {
        true: '!rounded-full',
      },
    },
    compoundVariants: [
      { variant: 'icon', size: 'sm', class: 'p-2' },
      { variant: 'icon', size: 'md', class: 'p-[11px]' },
      { variant: 'icon', size: 'lg', class: 'p-[14px]' },
      { variant: 'icon', size: 'xl', class: 'p-[18px]' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, pill, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, pill, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
