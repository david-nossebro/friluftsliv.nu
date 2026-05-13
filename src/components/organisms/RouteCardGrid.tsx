import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RouteCard } from '@/components/molecules/RouteCard'
import { Button } from '@/components/atoms/Button'
import type { Route } from '@/types'

export interface RouteCardGridProps {
  title?: string
  routes: Route[]
  showMoreHref?: string
  className?: string
}

export function RouteCardGrid({
  title = 'Populära rutter',
  routes,
  showMoreHref,
  className,
}: RouteCardGridProps) {
  return (
    <section className={cn('py-12 px-6 bg-snow', className)} aria-labelledby="routes-heading">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <h2 id="routes-heading" className="font-display text-2xl font-light text-pine">
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
        </div>
      </div>
    </section>
  )
}
