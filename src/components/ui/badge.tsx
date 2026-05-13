import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-body font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        pine:    'bg-pine text-snow',
        moss:    'bg-moss/15 text-pine',
        sky:     'bg-sky/20 text-sky-dark',
        earth:   'bg-earth/15 text-earth',
        ember:   'bg-ember/15 text-ember-deep',
        outline: 'bg-transparent ring-1 ring-inset ring-birch text-ink-soft',
        mist:    'bg-mist text-ink-soft',
      },
      size: {
        sm: 'text-2xs px-2 py-0.5 rounded-full',
        md: 'text-xs px-3 py-1 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'mist',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size, className }))} {...props} />
}
