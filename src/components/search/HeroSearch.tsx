'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SearchBar } from '@/components/search/SearchBar'
import type { SearchSuggestion } from '@/types'

export interface HeroImageOption {
  url: string
  label: string
}

export interface HeroSearchProps {
  headline?: string
  subheadline?: string
  imageUrl?: string
  images?: HeroImageOption[]
  suggestions?: SearchSuggestion[]
  onSubmit?: (query: string) => void
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void
  className?: string
}

export function HeroSearch({
  headline = 'Välkommen till den svenska naturen.',
  subheadline,
  imageUrl,
  images,
  suggestions = [],
  onSubmit,
  onSuggestionSelect,
  className,
}: HeroSearchProps) {
  const gallery = images && images.length > 0 ? images : null
  const firstUrl = gallery?.[0]?.url
  const [activeUrl, setActiveUrl] = React.useState<string | undefined>(
    firstUrl ?? imageUrl,
  )

  const resolvedUrl = gallery
    ? (gallery.find((img) => img.url === activeUrl)?.url ?? firstUrl)
    : imageUrl

  return (
    <section
      className={cn(
        'relative flex items-center justify-center min-h-[520px] md:min-h-[600px]',
        'overflow-hidden bg-pine',
        className
      )}
      aria-label="Sök friluftsliv"
    >
      {/* Background image */}
      {resolvedUrl && (
        <>
          <Image
            key={resolvedUrl}
            src={resolvedUrl}
            alt=""
            fill
            className="object-cover transition-opacity duration-300"
            priority
            quality={70}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-pine/55" />
        </>
      )}
      {!resolvedUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-pine-dark via-pine to-moss/60" />
      )}

      {/* Image selector (desktop/tablet only) */}
      {gallery && gallery.length > 1 && (
        <div
          role="group"
          aria-label="Välj bakgrundsbild"
          className="hidden md:flex absolute right-4 top-4 gap-2 z-20"
        >
          {gallery.map((img) => {
            const isActive = resolvedUrl === img.url
            return (
              <button
                key={img.url}
                type="button"
                aria-label={`Visa bakgrund: ${img.label}`}
                aria-pressed={isActive}
                onClick={() => setActiveUrl(img.url)}
                title={img.label}
                className={cn(
                  'relative shrink-0 w-14 h-14 rounded-md overflow-hidden',
                  'transition-all duration-[120ms]',
                  'focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-moss focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-ink/50',
                  isActive
                    ? 'ring-2 ring-snow ring-offset-2 ring-offset-ink/40 opacity-100'
                    : 'opacity-70 hover:opacity-100',
                )}
              >
                <Image src={img.url} alt="" fill className="object-cover" sizes="56px" />
              </button>
            )
          })}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-[720px] mx-auto px-6 py-16 flex flex-col items-center text-center gap-8">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-snow leading-[1.15] max-w-[580px]">
          {headline}
        </h1>
        {subheadline && (
          <p className="font-body text-base font-light text-snow/75 max-w-[440px]">
            {subheadline}
          </p>
        )}
        <div className="w-full max-w-[560px]">
          <SearchBar
            label="Sök friluftsliv"
            size="lg"
            placeholder="Var vill du ge dig ut?"
            suggestions={suggestions}
            {...(onSubmit ? { onSubmit } : {})}
            {...(onSuggestionSelect ? { onSuggestionSelect } : {})}
          />
        </div>
      </div>
    </section>
  )
}
