import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RouteCard } from '@/components/cards/RouteCard'
import { Button } from '@/components/ui/button'
import type { Route } from '@/types'

export interface RouteCardGridProps {
  title?: string
  /** Optional one-line description shown under the heading. */
  description?: string
  routes: Route[]
  showMoreHref?: string
  /**
   * When `'scroll'`, mobile lays out as a horizontal-scroll snap row instead of
   * a vertical stack. Useful as a "related routes" footer where a long stack
   * would otherwise dominate the page.
   */
  mobileLayout?: 'stack' | 'scroll'
  className?: string
}

export function RouteCardGrid({
  title = 'Populära rutter',
  description,
  routes,
  showMoreHref,
  mobileLayout = 'stack',
  className,
}: RouteCardGridProps) {
  const isScroll = mobileLayout === 'scroll'

  return (
    <section className={cn('py-12 px-6 bg-snow', className)} aria-labelledby="routes-heading">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div className="flex flex-col gap-1">
            <h2 id="routes-heading" className="font-display text-2xl font-light text-pine leading-snug">
              {title}
            </h2>
            {description && (
              <p className="font-body text-sm text-stone max-w-xl">{description}</p>
            )}
          </div>
          {showMoreHref && (
            <Button asChild variant="ghost" size="sm">
              <Link href={showMoreHref}>
                Visa alla
                <ArrowRight size={14} />
              </Link>
            </Button>
          )}
        </div>

        <div
          className={cn(
            isScroll
              ? 'flex sm:grid gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none -mx-6 px-6 sm:mx-0 sm:px-0 scrollbar-none'
              : 'grid gap-4',
            'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          )}
        >
          {routes.map((route) => (
            <Link
              key={route.id}
              href={`/turer/${route.id}`}
              aria-label={`Visa ${route.title}`}
              className={cn(
                'rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2',
                isScroll && 'shrink-0 w-[78%] sm:w-auto snap-start',
              )}
            >
              <RouteCard route={route} className="h-full hover:-translate-y-0.5 hover:shadow-lg cursor-pointer" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
