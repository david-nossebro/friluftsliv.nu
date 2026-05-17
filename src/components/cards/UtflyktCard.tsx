import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { Utflykt } from '@/types'

export interface UtflyktCardProps {
  utflykt: Utflykt
  className?: string
  onClick?: () => void
  priority?: boolean
}

export function UtflyktCard({
  utflykt,
  className,
  onClick,
  priority = false,
}: UtflyktCardProps) {
  const content = (
    <>
      <div className="relative h-[168px] bg-mist shrink-0">
        {utflykt.imageUrl ? (
          <Image
            src={utflykt.imageUrl}
            alt={utflykt.title}
            fill
            className="object-cover"
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-birch/40 to-moss/20" />
        )}
        <span className="absolute top-2 left-2">
          <Badge variant="birch" size="sm">
            Utflykt
          </Badge>
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-lg font-light text-pine leading-snug line-clamp-2">
            {utflykt.title}
          </h3>
          <p className="text-xs text-stone font-body font-light">{utflykt.region}</p>
          <p className="font-body text-sm text-ink leading-relaxed line-clamp-3">
            {utflykt.summary}
          </p>
        </div>

        {utflykt.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {utflykt.highlights.slice(0, 3).map((highlight) => (
              <Badge key={highlight} variant="mist" size="sm">
                {highlight}
              </Badge>
            ))}
            {utflykt.highlights.length > 3 && (
              <Badge variant="outline" size="sm">
                +{utflykt.highlights.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2 mt-auto border-t border-mist-dark">
          <div>
            <p className="font-body text-2xs uppercase tracking-wide text-stone">Resa</p>
            <p className="mt-1 font-body text-sm text-pine">{utflykt.travelTime}</p>
          </div>
          <div>
            <p className="font-body text-2xs uppercase tracking-wide text-stone">Tid på plats</p>
            <p className="mt-1 font-body text-sm text-pine">{utflykt.visitDuration}</p>
          </div>
        </div>
      </div>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex flex-col w-full bg-white rounded-lg overflow-hidden text-left',
          'border border-mist-dark shadow-card',
          'transition-all duration-[220ms] ease-out',
          'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-1',
          className,
        )}
      >
        {content}
      </button>
    )
  }

  return (
    <article
      className={cn(
        'flex flex-col w-full bg-white rounded-lg overflow-hidden',
        'border border-mist-dark shadow-card',
        'transition-all duration-[220ms] ease-out',
        className,
      )}
    >
      {content}
    </article>
  )
}
