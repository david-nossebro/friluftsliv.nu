import Link from 'next/link'
import { ArrowLeft, ArrowRight, Download, LayoutGrid, MapPin, Share2 } from 'lucide-react'
import { formatSeason } from '@/lib/season'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DifficultyBadge } from '@/components/common/DifficultyBadge'
import { ImageGallery } from '@/components/sections/ImageGallery'
import { ContentBlock } from '@/components/sections/ContentBlock'
import { RouteStatGrid } from '@/components/sections/RouteStatGrid'
import { RouteDetailAccessSection } from '@/components/sections/RouteDetailAccessSection'
import { RouteMapSection } from '@/components/sections/RouteMapSection'
import { RouteDetailMobileBar } from '@/components/sections/RouteDetailMobileBar'
import { buildRouteStats } from '@/lib/routeStats'
import type { MapFeatureLayer, Stage, StageDetail } from '@/types'

export interface StageDetailPageProps {
  stage: StageDetail
  longHikeTitle: string
  longHikeHref: string
  previousStage?: Stage
  nextStage?: Stage
}

export function StageDetailPage({
  stage,
  longHikeTitle,
  longHikeHref,
  previousStage,
  nextStage,
}: StageDetailPageProps) {
  const featureLayers: MapFeatureLayer[] | undefined = stage.coordinates
    ? [
        {
          type: 'start',
          label: 'Start',
          color: '#2C4A3E',
          markers: [
            {
              id: `${stage.id}-start`,
              position: stage.coordinates,
              type: 'start',
              label: stage.startLocation,
              description: stage.region,
            },
          ],
        },
        ...(stage.endCoordinates
          ? [
              {
                type: 'finish',
                label: 'Mål',
                color: '#D97B4F',
                markers: [
                  {
                    id: `${stage.id}-finish`,
                    position: stage.endCoordinates,
                    type: 'finish',
                    label: stage.endLocation,
                    description: stage.region,
                  },
                ],
              },
            ]
          : []),
      ]
    : undefined

  return (
    <article className="bg-snow min-h-screen pb-24 md:pb-0">
      <ImageGallery
        src={stage.imageUrl ?? ''}
        alt={stage.title}
        overlay={
          <div className="flex flex-col gap-2">
            <Link
              href={longHikeHref}
              className="self-start inline-flex items-center gap-1.5 rounded-full bg-ink/40 backdrop-blur-sm px-3 py-1 font-body text-xs text-snow hover:bg-ink/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-snow/70 transition-colors"
            >
              <ArrowLeft size={12} aria-hidden="true" />
              Till {longHikeTitle}
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="mist" size="sm">
                Etapp {stage.stageNumber}
              </Badge>
              <Badge variant="pine" size="sm">
                Långvandring
              </Badge>
              <DifficultyBadge difficulty={stage.difficulty} />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-light text-snow leading-tight">
              {stage.title}
            </h1>
            <p className="font-body text-sm text-snow/85 flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.5} aria-hidden="true" />
              {stage.startLocation} till {stage.endLocation}
            </p>
            <p className="font-body text-sm text-snow/80 max-w-2xl">{stage.summary}</p>
          </div>
        }
        {...(stage.images ? { images: stage.images } : {})}
      />

      <RouteStatGrid stats={buildRouteStats(stage)} ariaLabel={`Etappstatistik för ${stage.title}`} />

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-10">
        <ContentBlock heading="Om etappen" body={stage.description} />

        {stage.startPoint && (
          <ContentBlock heading="Start och riktning" body={stage.startPoint} />
        )}

        {stage.season && (
          <ContentBlock heading="Säsong">
            <p className="font-body text-sm text-ink leading-relaxed">{formatSeason(stage.season)}</p>
          </ContentBlock>
        )}

        {stage.tips && stage.tips.length > 0 && (
          <ContentBlock heading="Tips för etappen">
            <ul className="list-disc marker:text-moss pl-5 flex flex-col gap-2 font-body text-sm text-ink leading-relaxed">
              {stage.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </ContentBlock>
        )}

        <RouteDetailAccessSection
          {...(stage.accessByCar ? { accessByCar: stage.accessByCar } : {})}
          {...(stage.accessByTransport ? { accessByTransport: stage.accessByTransport } : {})}
        />

        <RouteMapSection
          title="Etappen på karta"
          description={`Sträckan från ${stage.startLocation} till ${stage.endLocation}.`}
          ariaLabel={`Karta för ${stage.title}`}
          activityType={stage.activityType}
          {...(stage.coordinates ? { center: stage.coordinates, zoom: 11 } : {})}
          {...(featureLayers ? { featureLayers } : {})}
          {...(stage.gpxTrack ? { tracks: [stage.gpxTrack] } : {})}
          actions={
            <>
              {stage.gpxUrl && (
                <Button asChild variant="secondary" size="md">
                  <a href={stage.gpxUrl} download>
                    <Download size={15} />
                    Ladda ned GPX
                  </a>
                </Button>
              )}
              <Button variant="ghost" size="md">
                <Share2 size={15} />
                Dela etappen
              </Button>
            </>
          }
        />

        <section aria-labelledby="stage-nav-heading" className="flex flex-col gap-4">
          <h2
            id="stage-nav-heading"
            className="font-display text-2xl font-light text-pine leading-snug"
          >
            Fortsätt längs leden
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {previousStage ? (
              <Link
                href={`/etapper/${previousStage.id}`}
                className="rounded-xl border border-mist-dark bg-white p-4 shadow-card transition-colors hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
              >
                <p className="font-body text-2xs uppercase tracking-wide text-stone flex items-center gap-1">
                  <ArrowLeft size={12} aria-hidden="true" />
                  Föregående
                </p>
                <p className="mt-2 font-display text-lg font-light text-pine leading-snug">
                  {previousStage.title}
                </p>
              </Link>
            ) : (
              <div
                className="rounded-xl border border-dashed border-mist-dark bg-snow p-4 flex flex-col justify-center"
                aria-hidden="true"
              >
                <p className="font-body text-2xs uppercase tracking-wide text-stone">Föregående</p>
                <p className="mt-2 font-body text-sm text-stone">Det här är första etappen.</p>
              </div>
            )}

            <Link
              href={longHikeHref}
              className="rounded-xl border border-mist-dark bg-mist p-4 shadow-card transition-colors hover:bg-mist-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
            >
              <p className="font-body text-2xs uppercase tracking-wide text-stone flex items-center gap-1">
                <LayoutGrid size={12} aria-hidden="true" />
                Översikt
              </p>
              <p className="mt-2 font-display text-lg font-light text-pine leading-snug">
                {longHikeTitle}
              </p>
            </Link>

            {nextStage ? (
              <Link
                href={`/etapper/${nextStage.id}`}
                className="rounded-xl border border-mist-dark bg-white p-4 shadow-card transition-colors hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-body text-2xs uppercase tracking-wide text-stone">Nästa</p>
                    <p className="mt-2 font-display text-lg font-light text-pine leading-snug">
                      {nextStage.title}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-pine shrink-0 mt-1" aria-hidden="true" />
                </div>
              </Link>
            ) : (
              <div
                className="rounded-xl border border-dashed border-mist-dark bg-snow p-4 flex flex-col justify-center"
                aria-hidden="true"
              >
                <p className="font-body text-2xs uppercase tracking-wide text-stone">Nästa</p>
                <p className="mt-2 font-body text-sm text-stone">Du har nått sista etappen.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <RouteDetailMobileBar
        title={stage.title}
        {...(stage.gpxUrl ? { gpxUrl: stage.gpxUrl } : {})}
      />
    </article>
  )
}
