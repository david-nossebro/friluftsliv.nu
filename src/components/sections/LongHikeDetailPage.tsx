import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DifficultyBadge } from '@/components/common/DifficultyBadge'
import { ImageGallery } from '@/components/sections/ImageGallery'
import { ContentBlock } from '@/components/sections/ContentBlock'
import { LongHikeStageList } from '@/components/sections/LongHikeStageList'
import { RouteStatGrid } from '@/components/sections/RouteStatGrid'
import { RouteDetailAccessSection } from '@/components/sections/RouteDetailAccessSection'
import { RouteMapSection } from '@/components/sections/RouteMapSection'
import { DetailPageAnchors } from '@/components/sections/DetailPageAnchors'
import { buildLongHikeStats } from '@/lib/routeStats'
import type { LongHike, Stage } from '@/types'

export interface LongHikeDetailPageProps {
  longHike: LongHike
  stages: Stage[]
}

export function LongHikeDetailPage({
  longHike,
  stages,
}: LongHikeDetailPageProps) {
  const featureLayers = longHike.coordinates
    ? [
        {
          type: 'start',
          label: 'Start',
          color: '#2C4A3E',
          markers: [
            {
              id: `${longHike.id}-start`,
              position: longHike.coordinates,
              type: 'start',
              label: longHike.startPoint ?? 'Start',
              description: longHike.region,
            },
          ],
        },
        ...(longHike.endCoordinates
          ? [
              {
                type: 'finish',
                label: 'Mål',
                color: '#D97B4F',
                markers: [
                  {
                    id: `${longHike.id}-finish`,
                    position: longHike.endCoordinates,
                    type: 'finish',
                    label: longHike.endPoint ?? 'Mål',
                    description: longHike.region,
                  },
                ],
              },
            ]
          : []),
      ]
    : undefined

  const anchors = [
    { id: 'om-leden', label: 'Om leden' },
    { id: 'tillgang', label: 'Hur du tar dig dit' },
    ...(longHike.tips && longHike.tips.length > 0
      ? [{ id: 'bra-att-veta', label: 'Bra att veta' }]
      : []),
    { id: 'karta', label: 'Karta' },
    { id: 'etapper', label: 'Etapper' },
  ]

  return (
    <article className="bg-snow min-h-screen">
      <ImageGallery
        src={longHike.imageUrl ?? ''}
        alt={longHike.title}
        overlay={
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="moss" size="sm">
                Långvandring
              </Badge>
              <Badge variant="outline" size="sm">
                {stages.length} etapper
              </Badge>
              <DifficultyBadge difficulty={longHike.difficulty} />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-light text-snow leading-tight">
              {longHike.title}
            </h1>
            <p className="font-body text-sm text-snow/85 flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.5} aria-hidden="true" />
              {longHike.region}
            </p>
            <p className="font-body text-sm text-snow/80 max-w-2xl">{longHike.summary}</p>
          </div>
        }
        {...(longHike.images ? { images: longHike.images } : {})}
      />

      <RouteStatGrid
        stats={buildLongHikeStats(longHike, stages.length)}
        ariaLabel={`Översikt för ${longHike.title}`}
      />

      <DetailPageAnchors anchors={anchors} />

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-10">
        <section id="om-leden" className="scroll-mt-24 flex flex-col gap-10">
          <ContentBlock heading="Om leden" body={longHike.description} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {longHike.terrain && (
              <ContentBlock heading="Det här möter dig" body={longHike.terrain} />
            )}
            {longHike.overnight && (
              <ContentBlock heading="Bo och dela upp turen" body={longHike.overnight} />
            )}
            {longHike.waymarking && (
              <ContentBlock heading="Markering och planering" body={longHike.waymarking} />
            )}
          </div>
        </section>

        <div id="tillgang" className="scroll-mt-24">
          <RouteDetailAccessSection
            {...(longHike.accessByCar ? { accessByCar: longHike.accessByCar } : {})}
            {...(longHike.accessByTransport ? { accessByTransport: longHike.accessByTransport } : {})}
          />
        </div>

        {longHike.tips && longHike.tips.length > 0 && (
          <div id="bra-att-veta" className="scroll-mt-24">
            <ContentBlock heading="Bra att veta innan du går">
              <ul className="list-disc marker:text-moss pl-5 flex flex-col gap-2 font-body text-sm text-ink leading-relaxed">
                {longHike.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </ContentBlock>
          </div>
        )}

        <div id="karta" className="scroll-mt-24">
          <RouteMapSection
            title="Översikt på karta"
            description="Se hela sträckan först. Det gör det lättare att förstå hur etapperna hänger ihop."
            ariaLabel={`Karta för ${longHike.title}`}
            activityType="vandring"
            {...(longHike.coordinates ? { center: longHike.coordinates, zoom: 8 } : {})}
            {...(featureLayers ? { featureLayers } : {})}
            {...(longHike.gpxTrack ? { tracks: [longHike.gpxTrack] } : {})}
          />
        </div>

        <div id="etapper" className="scroll-mt-24">
          <LongHikeStageList stages={stages} />
        </div>
      </div>
    </article>
  )
}
