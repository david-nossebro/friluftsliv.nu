import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface AboutHeroSectionProps {
  title?: string
  description?: string
  imageUrl?: string
  className?: string
}

export function AboutHeroSection({
  title = 'Vi hjälper dig hitta vägen ut',
  description = 'friluftsliv.nu är en plats för dig som vill ge dig ut i naturen — för en eftermiddag, en helg eller en hel vecka. Vi samlar rutter, stugor och naturområden från hela Sverige på ett ställe.',
  imageUrl = 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&q=70&auto=format',
  className,
}: AboutHeroSectionProps) {
  return (
    <section className={cn('relative bg-pine text-snow', className)}>
      <div className="absolute inset-0 opacity-30">
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          priority
          quality={70}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-pine/60" />
      </div>
      <div className="relative max-w-[860px] mx-auto px-6 py-16 md:py-24 text-center">
        <h1 className="font-display text-3xl md:text-4xl font-light leading-tight mb-4">
          {title}
        </h1>
        <p className="font-body text-base md:text-lg font-light text-snow/85 max-w-[640px] mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  )
}
