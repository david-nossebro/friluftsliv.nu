import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UtflyktCard } from '@/components/cards/UtflyktCard'
import { Button } from '@/components/ui/button'
import type { Utflykt } from '@/types'

export interface UtflyktCardGridProps {
  title?: string
  description?: string
  utflykter: Utflykt[]
  showMoreHref?: string
  mobileLayout?: 'stack' | 'scroll'
  className?: string
}

export function UtflyktCardGrid({
  title = 'Utflykter',
  description,
  utflykter,
  showMoreHref,
  mobileLayout = 'stack',
  className,
}: UtflyktCardGridProps) {
  const isScroll = mobileLayout === 'scroll'

  return (
    <section className={cn('py-12 px-6 bg-mist', className)} aria-labelledby="utflykter-heading">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div className="flex flex-col gap-1">
            <h2 id="utflykter-heading" className="font-display text-2xl font-light text-pine leading-snug">
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

        {utflykter.length === 0 ? (
          <p className="font-body text-sm text-stone">Det finns inga utflykter att visa just nu.</p>
        ) : (
          <div
            className={cn(
              isScroll
                ? 'flex sm:grid gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none -mx-6 px-6 sm:mx-0 sm:px-0 scrollbar-none'
                : 'grid gap-4',
              'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            )}
          >
            {utflykter.map((utflykt, index) => (
              <Link
                key={utflykt.id}
                href={`/utflykter/${utflykt.id}`}
                aria-label={`Visa ${utflykt.title}`}
                className={cn(
                  'rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2',
                  isScroll && 'shrink-0 w-[78%] sm:w-auto snap-start',
                )}
              >
                <UtflyktCard
                  utflykt={utflykt}
                  className="h-full hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                  priority={index === 0}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
