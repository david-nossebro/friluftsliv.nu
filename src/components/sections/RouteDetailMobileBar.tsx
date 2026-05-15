'use client'

import * as React from 'react'
import { Download, Share2 } from 'lucide-react'

export interface RouteDetailMobileBarProps {
  /** Route or stage title — shown collapsed once the hero is out of view. */
  title: string
  /** Optional GPX download URL; omitted hides the GPX button. */
  gpxUrl?: string
}

/**
 * Sticky context bar shown on mobile only, and only once the hero has
 * scrolled out of view. Reinforces page identity and surfaces the two real
 * actions (GPX, Share) as equal-weight icon buttons — no accent CTA.
 */
export function RouteDetailMobileBar({ title, gpxUrl }: RouteDetailMobileBarProps) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    // The bar appears once the user has scrolled roughly past the hero.
    // Using a single scroll listener (vs. IntersectionObserver on a sentinel)
    // keeps the bar agnostic of the parent page's exact composition.
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 320)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden={!visible}
      className={[
        'md:hidden fixed inset-x-0 bottom-0 z-30',
        'bg-white border-t border-mist-dark px-4 py-3',
        'flex items-center gap-3',
        'transition-transform duration-200 ease-out',
        visible ? 'translate-y-0' : 'translate-y-full',
      ].join(' ')}
    >
      <p className="flex-1 min-w-0 font-body font-medium text-sm text-pine truncate">
        {title}
      </p>
      {gpxUrl && (
        <a
          href={gpxUrl}
          download
          aria-label="Ladda ned GPX"
          className="inline-flex items-center justify-center w-11 h-11 rounded-full text-pine hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
        >
          <Download size={18} aria-hidden="true" />
        </a>
      )}
      <button
        type="button"
        aria-label="Dela"
        className="inline-flex items-center justify-center w-11 h-11 rounded-full text-pine hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
      >
        <Share2 size={18} aria-hidden="true" />
      </button>
    </div>
  )
}
