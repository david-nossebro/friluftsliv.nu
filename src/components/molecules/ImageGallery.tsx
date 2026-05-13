'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface ImageGalleryProps {
  /** Main hero image URL */
  src: string
  alt: string
  /** Additional images shown as a scrollable thumbnail strip */
  images?: string[]
  /** Overlay content (title, badges, etc.) rendered over the hero image */
  overlay?: React.ReactNode
  className?: string
}

export function ImageGallery({ src, alt, images = [], overlay, className }: ImageGalleryProps) {
  const [active, setActive] = React.useState(src)

  const all = [src, ...images]

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Hero image */}
      <div className="relative w-full h-[56vw] min-h-[260px] max-h-[520px] bg-pine/20 overflow-hidden">
        <Image
          src={active}
          alt={alt}
          fill
          priority
          quality={70}
          className="object-cover transition-opacity duration-300"
          sizes="100vw"
        />
        {/* Bottom gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

        {overlay && (
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">{overlay}</div>
        )}
      </div>

      {/* Thumbnail strip — only shown when there are additional images */}
      {all.length > 1 && (
        <div
          role="group"
          aria-label="Bildgalleri"
          className="flex gap-2 overflow-x-auto px-4 md:px-6 py-3 bg-white border-b border-mist-dark scrollbar-none"
        >
          {all.map((imgSrc, i) => (
            <button
              key={imgSrc}
              type="button"
              aria-label={`Visa bild ${i + 1}`}
              aria-pressed={active === imgSrc}
              onClick={() => setActive(imgSrc)}
              className={cn(
                'relative shrink-0 w-14 h-14 md:w-16 md:h-16 rounded overflow-hidden',
                'transition-all duration-[120ms]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-1',
                active === imgSrc
                  ? 'ring-2 ring-pine ring-offset-1 opacity-100'
                  : 'opacity-60 hover:opacity-90'
              )}
            >
              <Image
                src={imgSrc}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
