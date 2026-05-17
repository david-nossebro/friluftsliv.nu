import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { Cabin } from '@/types'

export interface CabinCardProps {
  cabin: Cabin
  className?: string
  onClick?: () => void
  /** Mark as LCP candidate — disables lazy loading on the image. */
  priority?: boolean
}

export function CabinCard({ cabin, className, onClick, priority = false }: CabinCardProps) {
  const content = (
    <>
      <div className="relative h-[168px] bg-mist shrink-0">
        {cabin.imageUrl ? (
          <Image
            src={cabin.imageUrl}
            alt={cabin.title}
            fill
            className="object-cover"
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-earth/15 to-pine/20" />
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-display text-lg font-light text-pine leading-snug line-clamp-2">
            {cabin.title}
          </h3>
          <p className="text-xs text-stone font-body font-light mt-0.5">{cabin.region}</p>
        </div>

        {cabin.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {cabin.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="mist" size="sm">{amenity}</Badge>
            ))}
            {cabin.amenities.length > 3 && (
              <Badge variant="outline" size="sm">+{cabin.amenities.length - 3}</Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 mt-auto border-t border-mist-dark">
          {cabin.pricePerNight != null ? (
            <p className="font-body">
              <span className="text-base font-medium text-pine">{cabin.pricePerNight} kr</span>
              <span className="text-xs text-stone ml-1">/ natt</span>
            </p>
          ) : (
            <span className="text-xs text-stone">Pris ej angivet</span>
          )}
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
          className
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
        className
      )}
    >
      {content}
    </article>
  )
}
