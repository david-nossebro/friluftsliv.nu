'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface ImageGalleryProps {
  /** Main hero image URL, or null when no image is available. */
  src: string | null
  alt: string
  /** Additional images shown as a thumbnail strip overlaying the hero. */
  images?: string[]
  /** Overlay content (title, badges, etc.) rendered over the hero image. */
  overlay?: React.ReactNode
  className?: string
}

export function ImageGallery({ src, alt, images = [], overlay, className }: ImageGalleryProps) {
  const all = React.useMemo(() => (src ? [src, ...images] : images), [src, images])
  const [active, setActive] = React.useState<string | null>(src ?? images[0] ?? null)
  const activeIndex = Math.max(0, active ? all.indexOf(active) : 0)

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="relative w-full h-[56vw] min-h-[260px] max-h-[520px] bg-pine/20 overflow-hidden">
        {active && (
          <Image
            src={active}
            alt={alt}
            fill
            priority
            quality={70}
            className="object-cover transition-opacity duration-300"
            sizes="100vw"
          />
        )}

        {/* Top scrim — keeps breadcrumb/badges legible on bright photos. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[28%] bg-gradient-to-b from-ink/45 to-transparent"
          aria-hidden="true"
        />
        {/* Bottom scrim — anchors the title block. */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent"
          aria-hidden="true"
        />

        {overlay && (
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">{overlay}</div>
        )}

        {all.length > 1 && (
          <>
            {/* Mobile: simple counter chip, bottom-right. */}
            <div
              className="md:hidden absolute right-3 top-3 rounded-full bg-ink/55 backdrop-blur-sm px-2.5 py-1 font-body text-2xs text-snow"
              aria-hidden="true"
            >
              {activeIndex + 1} / {all.length}
            </div>

            {/* Tablet/desktop: thumbnail row inside hero, top-right. */}
            <div
              role="group"
              aria-label="Bildgalleri"
              className="hidden md:flex absolute right-4 top-4 gap-2"
            >
              {all.map((imgSrc, i) => (
                <button
                  key={imgSrc}
                  type="button"
                  aria-label={`Visa bild ${i + 1}`}
                  aria-pressed={active === imgSrc}
                  onClick={() => setActive(imgSrc)}
                  className={cn(
                    'relative shrink-0 w-14 h-14 rounded-md overflow-hidden',
                    'transition-all duration-[120ms]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-ink/50',
                    active === imgSrc
                      ? 'ring-2 ring-snow ring-offset-2 ring-offset-ink/40 opacity-100'
                      : 'opacity-70 hover:opacity-100',
                  )}
                >
                  <Image
                    src={imgSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
