import Image from 'next/image'
import { Home, Route } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { Area } from '@/types'

export interface AreaCardProps {
  area: Area
  routeCount?: number
  cabinCount?: number
  className?: string
  onClick?: () => void
  /** Mark as LCP candidate — disables lazy loading on the image. */
  priority?: boolean
}

const areaKindLabels: Record<Area['kind'], string> = {
  nationalpark: 'Nationalpark',
  naturreservat: 'Naturreservat',
}

export function AreaCard({
  area,
  routeCount = 0,
  cabinCount = 0,
  className,
  onClick,
  priority = false,
}: AreaCardProps) {
  const content = (
    <>
      {area.imageUrl ? (
        <Image
          src={area.imageUrl}
          alt={area.title}
          fill
          className="object-cover"
          priority={priority}
          sizes="(max-width: 768px) 100vw, 280px"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-moss/20 to-pine/40" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-pine/80 via-pine/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <Badge variant="mist" size="sm" className="mb-2">
          {areaKindLabels[area.kind]}
        </Badge>
        <h3 className="font-display text-xl font-light text-snow leading-tight">{area.title}</h3>
        <p className="mt-1 text-xs text-snow/75 font-body font-light line-clamp-2">{area.summary}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-birch font-body">
          <span className="flex items-center gap-1">
            <Route size={11} strokeWidth={1.5} aria-hidden="true" />
            {routeCount} rutter
          </span>
          <span className="flex items-center gap-1">
            <Home size={11} strokeWidth={1.5} aria-hidden="true" />
            {cabinCount} stugor
          </span>
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
          'relative w-full overflow-hidden rounded-lg aspect-[4/3] bg-mist text-left',
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
        'relative w-full overflow-hidden rounded-lg aspect-[4/3] bg-mist',
        'border border-mist-dark shadow-card',
        'transition-all duration-[220ms] ease-out',
        className
      )}
    >
      {content}
    </article>
  )
}
