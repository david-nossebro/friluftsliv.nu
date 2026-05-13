import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CabinCard } from '@/components/molecules/CabinCard'
import { Button } from '@/components/atoms/Button'
import type { Cabin } from '@/types'

export interface CabinCardGridProps {
  title?: string
  cabins: Cabin[]
  showMoreHref?: string
  className?: string
}

export function CabinCardGrid({
  title = 'Stugor och fjällstationer',
  cabins,
  showMoreHref,
  className,
}: CabinCardGridProps) {
  return (
    <section className={cn('py-12 px-6 bg-mist', className)} aria-labelledby="cabins-heading">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <h2 id="cabins-heading" className="font-display text-2xl font-light text-pine">
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
          {cabins.map((cabin) => (
            <Link
              key={cabin.id}
              href={`/stugor/${cabin.id}`}
              aria-label={`Visa ${cabin.title}`}
              className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
            >
              <CabinCard cabin={cabin} className="h-full hover:-translate-y-0.5 hover:shadow-lg cursor-pointer" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
