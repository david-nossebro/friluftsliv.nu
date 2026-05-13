import Image from 'next/image'
import { Route, TrendingUp, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DifficultyBadge } from './DifficultyBadge'
import { StatItem } from './StatItem'
import { Badge } from '@/components/atoms/Badge'
import type { Route as RouteType } from '@/types'

const activityLabels: Record<RouteType['activityType'], string> = {
  vandring:  'Vandring',
  skidtur:   'Skidtur',
  topptur:   'Topptur',
  cykeltur:  'Cykeltur',
  paddeltur: 'Paddeltur',
  stugtur:   'Stugtur',
}

export interface RouteCardProps {
  route: RouteType
  className?: string
  onClick?: () => void
  /** Mark as LCP candidate — disables lazy loading on the image. */
  priority?: boolean
}

export function RouteCard({ route, className, onClick, priority = false }: RouteCardProps) {
  const content = (
    <>
      <div className="relative h-[148px] bg-mist shrink-0">
        {route.imageUrl ? (
          <Image
            src={route.imageUrl}
            alt={route.title}
            fill
            className="object-cover"
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 260px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-moss/20 to-pine/30" />
        )}
        <span className="absolute top-2 left-2">
          <Badge variant="pine" size="sm">{activityLabels[route.activityType]}</Badge>
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-display text-lg font-light text-pine leading-snug line-clamp-2">
          {route.title}
        </h3>
        <p className="text-xs text-stone font-body font-light">{route.region}</p>

        <div className="flex items-center gap-3 mt-auto pt-2">
          <StatItem icon={Route} value={route.distance} unit=" km" label="Distans" />
          <StatItem icon={TrendingUp} value={route.elevation} unit=" m" label="Höjdmeter" />
          <StatItem icon={Clock} value={`${Math.floor(route.duration / 60)}h`} label="Tid" />
          <DifficultyBadge difficulty={route.difficulty} className="ml-auto" />
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
