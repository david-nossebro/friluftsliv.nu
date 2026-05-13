import Link from 'next/link'
import { Map } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/atoms/Button'

export interface MapPromoProps {
  title?: string
  description?: string
  href?: string
  className?: string
}

export function MapPromo({
  title = 'Utforska hela Sverige på kartan',
  description = 'Se rutter, stugor, naturreservat och höjdkurvor i ett interaktivt kartläge. Planera turen direkt.',
  href = '/karta',
  className,
}: MapPromoProps) {
  return (
    <section
      className={cn(
        'py-16 px-6',
        'bg-gradient-to-br from-pine via-pine to-moss/80',
        className
      )}
      aria-labelledby="map-promo-heading"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
        {/* Icon */}
        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-snow/10 flex items-center justify-center">
          <Map size={36} strokeWidth={1} className="text-birch" />
        </div>

        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <h2
            id="map-promo-heading"
            className="font-display text-2xl md:text-3xl font-light text-snow mb-3"
          >
            {title}
          </h2>
          <p className="font-body font-light text-snow/70 text-base max-w-lg leading-relaxed">
            {description}
          </p>
        </div>

        {/* CTA */}
        <Button asChild variant="secondary" size="lg" className="shrink-0">
          <Link href={href}>Gå till kartan</Link>
        </Button>
      </div>
    </section>
  )
}
