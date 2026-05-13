import Link from 'next/link'
import { cn } from '@/lib/utils'
import { AreaCard } from '@/components/molecules/AreaCard'
import { RouteCard } from '@/components/molecules/RouteCard'
import { CabinCard } from '@/components/molecules/CabinCard'
import type { Area, Route, Cabin } from '@/types'

export type ExploreItem =
  | { kind: 'area'; data: Area }
  | { kind: 'route'; data: Route }
  | { kind: 'cabin'; data: Cabin }

export interface ExploreGridProps {
  items: ExploreItem[]
  className?: string
}

export function ExploreGrid({ items, className }: ExploreGridProps) {
  if (items.length === 0) {
    return (
      <div className={cn('py-20 text-center', className)}>
        <p className="font-body text-stone text-sm">Inga resultat hittades.</p>
      </div>
    )
  }

  return (
    <section
      className={cn('py-10 px-6', className)}
      aria-label="Utforska innehåll"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => {
            const linkBase =
              'rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2'
            const cardHover = 'h-full hover:-translate-y-0.5 hover:shadow-lg cursor-pointer'
            if (item.kind === 'area') {
              return (
                <Link
                  key={item.data.id}
                  href={`/utforska?q=${encodeURIComponent(item.data.title)}`}
                  aria-label={`Filtrera på ${item.data.title}`}
                  className={linkBase}
                >
                  <AreaCard area={item.data} className={cardHover} />
                </Link>
              )
            }
            if (item.kind === 'route') {
              return (
                <Link
                  key={item.data.id}
                  href={`/turer/${item.data.id}`}
                  aria-label={`Visa ${item.data.title}`}
                  className={linkBase}
                >
                  <RouteCard route={item.data} className={cardHover} />
                </Link>
              )
            }
            return (
              <Link
                key={item.data.id}
                href={`/stugor/${item.data.id}`}
                aria-label={`Visa ${item.data.title}`}
                className={linkBase}
              >
                <CabinCard cabin={item.data} className={cardHover} />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
