import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LongHikeCard } from '@/components/cards/LongHikeCard'
import { Button } from '@/components/ui/button'
import type { LongHike } from '@/types'

export interface LongHikeCardGridProps {
  title?: string
  longHikes: LongHike[]
  showMoreHref?: string
  className?: string
}

export function LongHikeCardGrid({
  title = 'Långvandringar',
  longHikes,
  showMoreHref,
  className,
}: LongHikeCardGridProps) {
  return (
    <section className={cn('py-12 px-6 bg-snow', className)} aria-labelledby="longhikes-heading">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <h2 id="longhikes-heading" className="font-display text-2xl font-light text-pine">
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
