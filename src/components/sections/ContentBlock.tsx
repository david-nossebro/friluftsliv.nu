import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ContentBlockProps {
  /** Section heading — rendered as an H2 in display type. */
  heading: string
  /** Small uppercase label rendered above the heading. */
  eyebrow?: string
  /** Body text — use either `body` or `children`. */
  body?: string
  children?: ReactNode
  className?: string
}

export function ContentBlock({ heading, eyebrow, body, children, className }: ContentBlockProps) {
  return (
    <section className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-col gap-1">
        {eyebrow && (
          <p className="font-body text-2xs uppercase tracking-wide text-stone">{eyebrow}</p>
        )}
        <h2 className="font-display text-2xl font-light text-pine leading-snug">{heading}</h2>
      </div>

      {body && <p className="font-body text-sm text-ink leading-relaxed">{body}</p>}
      {children}
    </section>
  )
}
