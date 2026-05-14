'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Home, MapPin, Route as RouteIcon, Trees, Waves } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { FilterChip } from '@/components/ui/filter-chip'
import { CabinCard } from '@/components/cards/CabinCard'
import { RouteCard } from '@/components/cards/RouteCard'
import { ImageGallery } from '@/components/sections/ImageGallery'
import { ContentBlock } from '@/components/sections/ContentBlock'
import type { Area, Cabin, Route } from '@/types'

type AreaContentTab = 'stugor' | 'vandring' | 'fjallvandring' | 'kanotleder'

const areaKindLabels: Record<Area['kind'], string> = {
  nationalpark: 'Nationalpark',
  naturreservat: 'Naturreservat',
}

const contentTabs: { value: AreaContentTab; label: string }[] = [
  { value: 'stugor', label: 'Stugor' },
  { value: 'vandring', label: 'Vandring' },
  { value: 'fjallvandring', label: 'Fjällvandring' },
  { value: 'kanotleder', label: 'Kanotleder' },
]

export interface AreaDetailPageProps {
  area: Area
  cabins?: Cabin[]
  hikingRoutes?: Route[]
  mountainRoutes?: Route[]
  canoeRoutes?: Route[]
  className?: string
}

type CardGridProps =
  | { kind: 'cabin'; items: Cabin[] }
  | { kind: 'route'; items: Route[] }

function CardGrid({ items, kind }: CardGridProps) {
  if (items.length === 0) {
    return (
      <p className="font-body text-sm text-stone">
        Det finns inget innehåll i den här kategorin än.
      </p>
    )
  }

  if (kind === 'cabin') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <Link
            key={item.id}
            href={`/stugor/${item.id}`}
            aria-label={`Visa ${item.title}`}
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
          >
            <CabinCard
              cabin={item}
              priority={index === 0}
              className="h-full hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
            />
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => (
          <Link
            key={item.id}
            href={`/turer/${item.id}`}
            aria-label={`Visa ${item.title}`}
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
          >
            <RouteCard
              route={item}
              priority={index === 0}
              className="h-full hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
            />
          </Link>
        ))}
    </div>
  )
}

export function AreaDetailPage({
  area,
  cabins = [],
  hikingRoutes = [],
  mountainRoutes = [],
  canoeRoutes = [],
  className,
}: AreaDetailPageProps) {
  const [activeTab, setActiveTab] = useState<AreaContentTab>('stugor')

  const routeCount = hikingRoutes.length + mountainRoutes.length + canoeRoutes.length
  const galleryImages = area.images?.filter(
    (image, index, images) => image !== area.imageUrl && images.indexOf(image) === index,
  )

  return (
    <article className={cn('bg-snow min-h-screen', className)}>
      <ImageGallery
        src={area.imageUrl ?? ''}
        alt={area.title}
        overlay={
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="mist" size="sm">
                {areaKindLabels[area.kind]}
              </Badge>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-light text-snow leading-tight">
              {area.title}
            </h1>
            <p className="font-body text-sm text-snow/80 flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.5} aria-hidden="true" />
              {area.region}
            </p>
            <p className="font-body text-sm text-snow/75 max-w-2xl">{area.summary}</p>
          </div>
        }
        {...(galleryImages && galleryImages.length > 0 ? { images: galleryImages } : {})}
      />

      <div className="border-b border-mist-dark bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-mist-dark bg-snow p-4">
            <p className="font-body text-xs uppercase tracking-wide text-stone">Områdestyp</p>
            <p className="mt-1 font-display text-lg text-pine">{areaKindLabels[area.kind]}</p>
          </div>
          <div className="rounded-lg border border-mist-dark bg-snow p-4">
            <p className="font-body text-xs uppercase tracking-wide text-stone">Region</p>
            <p className="mt-1 font-display text-lg text-pine">{area.region}</p>
          </div>
          <div className="rounded-lg border border-mist-dark bg-snow p-4">
            <p className="font-body text-xs uppercase tracking-wide text-stone">Rutter</p>
            <p className="mt-1 font-display text-lg text-pine">{routeCount}</p>
          </div>
          <div className="rounded-lg border border-mist-dark bg-snow p-4">
            <p className="font-body text-xs uppercase tracking-wide text-stone">Stugor</p>
            <p className="mt-1 font-display text-lg text-pine">{cabins.length}</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-8">
        <ContentBlock heading="Om området" icon={Trees} body={area.description} />

        <ContentBlock heading="Utforska i området" icon={activeTab === 'kanotleder' ? Waves : activeTab === 'stugor' ? Home : RouteIcon}>
          <div className="flex flex-wrap gap-2 mb-6">
            {contentTabs.map((tab) => (
              <FilterChip
                key={tab.value}
                label={tab.label}
                active={activeTab === tab.value}
                onClick={() => setActiveTab(tab.value)}
              />
            ))}
          </div>

          {activeTab === 'stugor' && <CardGrid items={cabins} kind="cabin" />}
          {activeTab === 'vandring' && <CardGrid items={hikingRoutes} kind="route" />}
          {activeTab === 'fjallvandring' && <CardGrid items={mountainRoutes} kind="route" />}
          {activeTab === 'kanotleder' && <CardGrid items={canoeRoutes} kind="route" />}
        </ContentBlock>
      </div>
    </article>
  )
}
