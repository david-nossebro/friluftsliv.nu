import Image from 'next/image'
import { Calendar, Route } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DifficultyBadge } from '@/components/common/DifficultyBadge'
import { StatItem } from '@/components/common/StatItem'
import { Badge } from '@/components/ui/badge'
import type { LongHike } from '@/types'

export interface LongHikeCardProps {
  longHike: LongHike
  className?: string
  priority?: boolean
}

export function LongHikeCard({
  longHike,
  className,
  priority = false,
}: LongHikeCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col w-full bg-white rounded-lg overflow-hidden',
        'border border-mist-dark shadow-card',
        'transition-all duration-[220ms] ease-out',
        className,
      )}
    >
      <div className="relative h-[148px] bg-mist shrink-0">
        {longHike.imageUrl ? (
          <Image
            src={longHike.imageUrl}
            alt={longHike.title}
            fill
            className="object-cover"
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 260px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-birch/40 to-pine/30" />
        )}
        <div className="absolute top-2 left-2 flex items-center gap-2 flex-wrap">
          <Badge variant="pine" size="sm">
            Långvandring
          </Badge>
          <Badge variant="pine" size="sm">
            {longHike.stageIds.length} etapper
          </Badge>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-display text-lg font-light text-pine leading-snug line-clamp-2">
          {longHike.title}
        </h3>
        <p className="text-xs text-stone font-body font-light">{longHike.region}</p>
        <p className="font-body text-sm text-ink leading-relaxed line-clamp-3">
          {longHike.summary}
        </p>

        <div className="flex items-center gap-3 mt-auto pt-2">
          <StatItem icon={Route} value={longHike.distance} unit=" km" label="Distans" />
          <StatItem icon={Calendar} value={longHike.estimatedDays} unit=" dagar" label="Dagar" />
          <DifficultyBadge difficulty={longHike.difficulty} className="ml-auto" />
        </div>
      </div>
    </article>
  )
}
