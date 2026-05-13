import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SearchBar } from '@/components/search/SearchBar'
import type { SearchSuggestion } from '@/types'

export interface HeroSearchProps {
  headline?: string
  subheadline?: string
  imageUrl?: string
  suggestions?: SearchSuggestion[]
  onSubmit?: (query: string) => void
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void
  className?: string
}

export function HeroSearch({
  headline = 'Hitta din tur bland tusentals förslag och stugor i hela Sverige',
  subheadline,
  imageUrl,
  suggestions = [],
  onSubmit,
  onSuggestionSelect,
  className,
}: HeroSearchProps) {
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
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            priority
            quality={70}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-pine/55" />
        </>
      )}
      {!imageUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-pine-dark via-pine to-moss/60" />
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
