import Link from 'next/link'
import { ArrowLeft, ArrowRight, Lightbulb, MapPin, Sun } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DifficultyBadge } from '@/components/common/DifficultyBadge'
import { ImageGallery } from '@/components/sections/ImageGallery'
import { ContentBlock } from '@/components/sections/ContentBlock'
import { RouteDetailStatsBar } from '@/components/sections/RouteDetailStatsBar'
import { RouteDetailAccessSection } from '@/components/sections/RouteDetailAccessSection'
import { RouteDetailSidebar } from '@/components/sections/RouteDetailSidebar'
import { RouteDetailMobileBar } from '@/components/sections/RouteDetailMobileBar'
import type { Stage } from '@/types'
import type { StageDetail } from '@/types'

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
  return (
    <article className="bg-snow min-h-screen">
      <ImageGallery
        src={stage.imageUrl ?? ''}
        alt={stage.title}
        overlay={
          <div className="flex flex-col gap-2">
            <Link
              href={longHikeHref}
              className="self-start inline-flex items-center gap-1.5 font-body text-xs text-snow/80 hover:text-snow transition-colors"
            >
              <ArrowLeft size={12} aria-hidden="true" />
              Till {longHikeTitle}
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="mist" size="sm">
                Etapp {stage.stageNumber}
              </Badge>
              <Badge variant="moss" size="sm">
                Långvandring
              </Badge>
              <DifficultyBadge difficulty={stage.difficulty} />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-light text-snow leading-tight">
              {stage.title}
            </h1>
            <p className="font-body text-sm text-snow/75 flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.5} aria-hidden="true" />
              {stage.startLocation} till {stage.endLocation}
            </p>
            <p className="font-body text-sm text-snow/75 max-w-2xl">{stage.summary}</p>
          </div>
        }
        {...(stage.images ? { images: stage.images } : {})}
      />

      <RouteDetailStatsBar route={stage} />

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">
          <div className="flex flex-col gap-8">
            <ContentBlock heading="Om etappen" body={stage.description} />

            {stage.startPoint && (
              <ContentBlock heading="Start och riktning" icon={MapPin} body={stage.startPoint} />
            )}

            {stage.season && (
              <ContentBlock heading="Säsong" icon={Sun}>
                <p className="font-body text-sm text-ink leading-relaxed">{stage.season}</p>
              </ContentBlock>
            )}

            {stage.tips && stage.tips.length > 0 && (
              <ContentBlock heading="Tips för etappen" icon={Lightbulb}>
                <ul className="flex flex-col gap-2">
                  {stage.tips.map((tip) => (
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

            <RouteDetailAccessSection
              {...(stage.accessByCar ? { accessByCar: stage.accessByCar } : {})}
              {...(stage.accessByTransport ? { accessByTransport: stage.accessByTransport } : {})}
            />

            {(previousStage || nextStage) && (
              <section aria-labelledby="stage-nav-heading" className="flex flex-col gap-4">
                <h2
                  id="stage-nav-heading"
                  className="font-body font-medium text-xs text-stone uppercase tracking-wide"
                >
                  Fortsätt längs leden
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {previousStage ? (
                    <Link
                      href={`/etapper/${previousStage.id}`}
                      className="rounded-xl border border-mist-dark bg-white p-4 shadow-card transition-colors hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
                    >
                      <p className="font-body text-2xs uppercase tracking-wide text-stone">Föregående</p>
                      <p className="mt-2 font-display text-lg font-light text-pine">
                        {previousStage.title}
                      </p>
                    </Link>
                  ) : (
                    <div className="hidden md:block" aria-hidden="true" />
                  )}
                  {nextStage && (
                    <Link
                      href={`/etapper/${nextStage.id}`}
                      className="rounded-xl border border-mist-dark bg-white p-4 shadow-card transition-colors hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-body text-2xs uppercase tracking-wide text-stone">Nästa</p>
                          <p className="mt-2 font-display text-lg font-light text-pine">
                            {nextStage.title}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-pine shrink-0 mt-1" aria-hidden="true" />
                      </div>
                    </Link>
                  )}
                </div>
              </section>
            )}

            <Button asChild variant="ghost" size="sm" className="self-start">
              <Link href={longHikeHref}>
                Tillbaka till översikten
                <ArrowRight size={14} />
              </Link>
            </Button>
          </div>

          <RouteDetailSidebar route={stage} />
        </div>
      </div>

      <RouteDetailMobileBar title={stage.title} distance={stage.distance} duration={stage.duration} />
    </article>
  )
}
