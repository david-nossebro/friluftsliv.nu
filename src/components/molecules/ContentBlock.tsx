import type { ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ContentBlockProps {
  /** Section heading */
  heading: string
  /** Optional Lucide icon beside the heading */
  icon?: LucideIcon
  /** Body text — use either `body` or `children` */
  body?: string
  children?: ReactNode
  className?: string
}

export function ContentBlock({ heading, icon: IconComponent, body, children, className }: ContentBlockProps) {
  return (
    <section className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-2">
        {IconComponent && (
          <IconComponent
            size={16}
            strokeWidth={1.5}
            className="text-moss shrink-0"
            aria-hidden="true"
          />
        )}
        <h2 className="font-body font-medium text-xs text-stone uppercase tracking-wide">
          {heading}
        </h2>
      </div>

      {body && (
        <p className="font-body text-sm text-ink leading-relaxed">{body}</p>
      )}
      {children}
    </section>
  )
}
