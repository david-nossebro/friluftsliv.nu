import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface AboutCtaSectionProps {
  title?: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  className?: string
}

export function AboutCtaSection({
  title = 'Naturen väntar.\nVi visar vägen.',
  description = 'Börja med att utforska — eller hitta en stuga för helgen.',
  primaryLabel = 'Utforska turer',
  primaryHref = '/utforska',
  secondaryLabel = 'Öppna kartan',
  secondaryHref = '/karta',
  className,
}: AboutCtaSectionProps) {
  return (
    <section className={cn('bg-pine py-14 text-snow md:py-20', className)}>
      <div className="mx-auto flex max-w-[600px] flex-col items-center gap-6 px-6 text-center">
        <h2 className="font-display text-2xl font-light leading-tight whitespace-pre-line text-snow md:text-3xl">
          {title}
        </h2>
        <p className="font-body text-base font-light text-snow/80 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="accent" size="lg">
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
