import type { ReactNode } from 'react'
import { Download, MapPin, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatSeason } from '@/lib/season'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DifficultyBadge } from '@/components/common/DifficultyBadge'
import { ImageGallery } from '@/components/sections/ImageGallery'
import { ContentBlock } from '@/components/sections/ContentBlock'
import { RouteStatGrid } from '@/components/sections/RouteStatGrid'
import { RouteDetailAccessSection } from './RouteDetailAccessSection'
import { RouteMapSection } from './RouteMapSection'
import { RouteDetailMobileBar } from './RouteDetailMobileBar'
import { buildRouteStats } from '@/lib/routeStats'
import type { MapFeatureLayer, RouteDetail } from '@/types'

const activityLabels: Record<RouteDetail['activityType'], string> = {
  vandring:  'Vandring',
  skidtur:   'Skidtur',
  topptur:   'Topptur',
  cykeltur:  'Cykeltur',
  paddeltur: 'Paddeltur',
  stugtur:   'Stugtur',
}

export interface RouteDetailPageProps {
  route: RouteDetail
  relatedRoutes?: ReactNode
  className?: string
}

export function RouteDetailPage({ route, relatedRoutes, className }: RouteDetailPageProps) {
  const featureLayers: MapFeatureLayer[] | undefined = route.coordinates
    ? [
        {
          type: 'start',
          label: route.region,
          color: '#2C4A3E',
          markers: [
            {
              id: route.id,
              position: route.coordinates,
              type: 'start',
              label: route.title,
              description: route.region,
            },
          ],
        },
      ]
    : undefined

  return (
    <article className={cn('bg-snow min-h-screen pb-24 md:pb-0', className)}>
      <ImageGallery
        src={route.imageUrl ?? null}
        alt={route.title}
        overlay={
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="pine" size="sm">
                {activityLabels[route.activityType]}
              </Badge>
              <DifficultyBadge difficulty={route.difficulty} />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-light text-snow leading-tight">
              {route.title}
            </h1>
            <p className="font-body text-sm text-snow/80 flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.5} aria-hidden="true" />
              {route.region}
            </p>
          </div>
        }
        {...(route.images ? { images: route.images } : {})}
      />

      <RouteStatGrid stats={buildRouteStats(route)} />

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-10">
        <ContentBlock heading="Om turen" body={route.description} />

        {route.startPoint && (
          <ContentBlock heading="Startpunkt & parkering" body={route.startPoint} />
        )}

        {route.season && (
          <ContentBlock heading="Säsong">
            <p className="font-body text-sm text-ink leading-relaxed">{formatSeason(route.season)}</p>
          </ContentBlock>
        )}

        {route.tips && route.tips.length > 0 && (
          <ContentBlock heading="Tips för turen">
            <ul className="list-disc marker:text-moss pl-5 flex flex-col gap-2 font-body text-sm text-ink leading-relaxed">
              {route.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </ContentBlock>
        )}

        <RouteDetailAccessSection
          {...(route.accessByCar ? { accessByCar: route.accessByCar } : {})}
          {...(route.accessByTransport ? { accessByTransport: route.accessByTransport } : {})}
        />

        <RouteMapSection
          title="Rutten på karta"
          description="Se var rutten går innan du packar — det gör det lättare att planera dagen."
          ariaLabel={`Karta för ${route.title}`}
          activityType={route.activityType}
          {...(route.coordinates ? { center: route.coordinates, zoom: 12 } : {})}
          {...(featureLayers ? { featureLayers } : {})}
          {...(route.gpxTrack ? { tracks: [route.gpxTrack] } : {})}
          actions={
            <>
              {route.gpxUrl && (
                <Button asChild variant="secondary" size="md">
                  <a href={route.gpxUrl} download>
                    <Download size={15} />
                    Ladda ned GPX
                  </a>
                </Button>
              )}
              <Button variant="ghost" size="md">
                <Share2 size={15} />
                Dela rutten
              </Button>
            </>
          }
        />
      </div>

      {relatedRoutes && (
        <div className="border-t border-mist-dark">{relatedRoutes}</div>
      )}

      <RouteDetailMobileBar
        title={route.title}
        {...(route.gpxUrl ? { gpxUrl: route.gpxUrl } : {})}
      />
    </article>
  )
}
