import Link from 'next/link'
import { cn } from '@/lib/utils'
import { RouteCard } from '@/components/cards/RouteCard'
import { LongHikeCard } from '@/components/cards/LongHikeCard'
import type { LongHike, Route } from '@/types'

export interface MixedHikeGridProps {
  routes: Route[]
  longHikes: LongHike[]
  className?: string
}

export function MixedHikeGrid({ routes, longHikes, className }: MixedHikeGridProps) {
  return (
    <section className={cn('py-12 px-6 bg-snow', className)} aria-labelledby="hikes-heading">
      <div className="max-w-[1200px] mx-auto">
        <h2 id="hikes-heading" className="font-display text-2xl font-light text-pine leading-snug mb-8">
          Vandring
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {routes.map((route) => (
            <Link
              key={route.id}
              href={`/turer/${route.id}`}
              aria-label={`Visa ${route.title}`}
              className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
            >
              <RouteCard route={route} className="h-full hover:-translate-y-0.5 hover:shadow-lg cursor-pointer" />
            </Link>
          ))}
          {longHikes.map((longHike, index) => (
            <Link
              key={longHike.id}
              href={`/langvandringar/${longHike.id}`}
              aria-label={`Visa ${longHike.title}`}
              className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
            >
              <LongHikeCard
                longHike={longHike}
                priority={index === 0}
                className="h-full hover:-translate-y-0.5 hover:shadow-lg"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
