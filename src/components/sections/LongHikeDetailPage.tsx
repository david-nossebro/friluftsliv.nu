import { Lightbulb, MapPin, Route as RouteIcon, Trees } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DifficultyBadge } from '@/components/common/DifficultyBadge'
import { ImageGallery } from '@/components/sections/ImageGallery'
import { ContentBlock } from '@/components/sections/ContentBlock'
import { LongHikeStageList } from '@/components/sections/LongHikeStageList'
import { RouteDetailAccessSection } from '@/components/sections/RouteDetailAccessSection'
import { LeafletMap, SWEDEN_CENTER } from '@/components/map/LeafletMap'
import type { LongHike, Stage } from '@/types'

function formatWalkingTime(minutes: number) {
  const hours = Math.floor(minutes / 60)
  return `${hours} h`
}

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
            <p className="font-body text-sm text-snow/80 flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.5} aria-hidden="true" />
              {longHike.region}
            </p>
            <p className="font-body text-sm text-snow/75 max-w-2xl">{longHike.summary}</p>
          </div>
        }
        {...(longHike.images ? { images: longHike.images } : {})}
      />

      <div className="border-b border-mist-dark bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-mist-dark bg-snow p-4">
            <p className="font-body text-xs uppercase tracking-wide text-stone">Distans</p>
            <p className="mt-1 font-display text-lg text-pine">{longHike.distance} km</p>
          </div>
          <div className="rounded-lg border border-mist-dark bg-snow p-4">
            <p className="font-body text-xs uppercase tracking-wide text-stone">Tid</p>
            <p className="mt-1 font-display text-lg text-pine">{longHike.estimatedDays} dagar</p>
            <p className="font-body text-xs text-stone mt-1">{formatWalkingTime(longHike.duration)} gångtid</p>
          </div>
          <div className="rounded-lg border border-mist-dark bg-snow p-4">
            <p className="font-body text-xs uppercase tracking-wide text-stone">Etapper</p>
            <p className="mt-1 font-display text-lg text-pine">{stages.length}</p>
          </div>
          <div className="rounded-lg border border-mist-dark bg-snow p-4">
            <p className="font-body text-xs uppercase tracking-wide text-stone">Säsong</p>
            <p className="mt-1 font-display text-lg text-pine">{longHike.season ? 'Sommar' : 'Se info'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-10">
        <ContentBlock heading="Om leden" body={longHike.description} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {longHike.terrain && (
            <ContentBlock heading="Det här möter dig" icon={Trees} body={longHike.terrain} />
          )}
          {longHike.overnight && (
            <ContentBlock heading="Bo och dela upp turen" icon={RouteIcon} body={longHike.overnight} />
          )}
          {longHike.waymarking && (
            <ContentBlock heading="Markering och planering" icon={MapPin} body={longHike.waymarking} />
          )}
        </div>

        <section aria-labelledby="longhike-map-heading" className="flex flex-col gap-4">
          <div>
            <h2 id="longhike-map-heading" className="font-display text-2xl font-light text-pine">
              Översikt på karta
            </h2>
            <p className="mt-2 font-body text-sm text-stone max-w-2xl">
              Se hela sträckan först. Det gör det lättare att förstå hur etapperna hänger ihop.
            </p>
          </div>
          <LeafletMap
            center={longHike.coordinates ?? SWEDEN_CENTER}
            zoom={longHike.coordinates ? 8 : 5}
            height="420px"
            aria-label={`Karta för ${longHike.title}`}
            {...(featureLayers ? { featureLayers } : {})}
            {...(longHike.gpxTrack ? { tracks: [longHike.gpxTrack] } : {})}
          />
        </section>

        <LongHikeStageList stages={stages} />

        <RouteDetailAccessSection
          {...(longHike.accessByCar ? { accessByCar: longHike.accessByCar } : {})}
          {...(longHike.accessByTransport ? { accessByTransport: longHike.accessByTransport } : {})}
        />

        {longHike.tips && longHike.tips.length > 0 && (
          <ContentBlock heading="Bra att veta innan du går" icon={Lightbulb}>
            <ul className="flex flex-col gap-2">
              {longHike.tips.map((tip) => (
                <li key={tip} className="flex gap-2.5 font-body text-sm text-ink leading-relaxed">
                  <span className="text-moss mt-0.5 shrink-0 font-medium" aria-hidden="true">
                    ·
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </ContentBlock>
        )}
      </div>
    </article>
  )
}
