import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AreaCard } from '@/components/cards/AreaCard'
import { Button } from '@/components/ui/button'
import type { AreaListItem } from '@/types'

export interface AreaCardGridProps {
  title?: string
  areas: AreaListItem[]
  showMoreHref?: string
  emptyMessage?: string
  className?: string
}

export function AreaCardGrid({
  title = 'Skyddade områden',
  areas,
  showMoreHref,
  emptyMessage = 'Det finns inga områden att visa just nu.',
  className,
}: AreaCardGridProps) {
  return (
    <section className={cn('py-12 px-6 bg-mist', className)} aria-labelledby="areas-heading">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-baseline justify-between mb-8 gap-4">
          <h2 id="areas-heading" className="font-display text-2xl font-light text-pine">
            {title}
          </h2>
          {showMoreHref && (
            <Button asChild variant="ghost" size="sm">
              <Link href={showMoreHref}>
                Visa alla
                <ArrowRight size={14} />
              </Link>
            </Button>
          )}
        </div>

        {areas.length === 0 ? (
          <p className="font-body text-sm text-stone">{emptyMessage}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {areas.map(({ area, routeCount, cabinCount }, index) => (
              <Link
                key={area.id}
                href={`/omraden/${area.id}`}
                aria-label={`Visa ${area.title}`}
                className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
              >
                <AreaCard
                  area={area}
                  routeCount={routeCount}
                  cabinCount={cabinCount}
                  priority={index === 0}
                  className="h-full hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
