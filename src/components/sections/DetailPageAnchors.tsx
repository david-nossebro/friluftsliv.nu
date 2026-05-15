'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DetailPageAnchor {
  /** Element id of the target section. */
  id: string
  /** Visible label. */
  label: string
}

export interface DetailPageAnchorsProps {
  anchors: DetailPageAnchor[]
  className?: string
}

/**
 * Sticky in-page navigation chip row. Used at the top of long detail pages
 * (e.g. /langvandringar) to give users a glanceable map of the page.
 * Updates the active chip as the matching section enters the viewport.
 */
export function DetailPageAnchors({ anchors, className }: DetailPageAnchorsProps) {
  const [activeId, setActiveId] = React.useState<string | null>(
    anchors[0]?.id ?? null,
  )

  React.useEffect(() => {
    if (anchors.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    )
    for (const { id } of anchors) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [anchors])

  if (anchors.length === 0) return null

  return (
    <nav
      aria-label="På sidan"
      className={cn(
        'sticky top-0 z-20 bg-snow/90 backdrop-blur border-b border-mist-dark',
        className,
      )}
    >
      <ul className="max-w-[1200px] mx-auto px-4 md:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
        {anchors.map(({ id, label }) => {
          const active = id === activeId
          return (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'inline-block px-3 py-1.5 rounded-full font-body text-xs',
                  'transition-colors duration-[120ms]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-snow',
                  active
                    ? 'bg-pine text-snow'
                    : 'bg-mist text-ink-soft hover:bg-mist-dark',
                )}
              >
                {label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
