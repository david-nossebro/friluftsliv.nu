import type { ReactNode } from 'react'
import {
  ArrowRight,
  MapPin,
  Lightbulb,
  Sun,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DifficultyBadge } from '@/components/common/DifficultyBadge'
import { ImageGallery } from '@/components/sections/ImageGallery'
import { ContentBlock } from '@/components/sections/ContentBlock'
import { RouteDetailStatsBar } from './RouteDetailStatsBar'
import { RouteDetailAccessSection } from './RouteDetailAccessSection'
import { RouteDetailSidebar } from './RouteDetailSidebar'
import { RouteDetailMobileBar } from './RouteDetailMobileBar'
import type { RouteDetail } from '@/types'

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
  onBack?: () => void
  className?: string
}

export function RouteDetailPage({ route, relatedRoutes, onBack, className }: RouteDetailPageProps) {
  return (
    <article className={cn('bg-snow min-h-screen', className)}>
      {/* ── Hero ─────────────────────────────────── */}
      <ImageGallery
        src={route.imageUrl ?? ''}
        alt={route.title}
        images={route.images}
        overlay={
          <div className="flex flex-col gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="self-start flex items-center gap-1.5 mb-1 font-body text-xs text-snow/80 hover:text-snow transition-colors"
                aria-label="Tillbaka"
              >
                <ArrowRight size={12} className="rotate-180" aria-hidden="true" />
                Tillbaka
              </button>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="pine" size="sm">{activityLabels[route.activityType]}</Badge>
              <DifficultyBadge difficulty={route.difficulty} />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-light text-snow leading-tight">
              {route.title}
            </h1>
            <p className="font-body text-sm text-snow/75 flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.5} aria-hidden="true" />
              {route.region}
            </p>
          </div>
        }
      />

      {/* ── Stat bar ─────────────────────────────── */}
      <RouteDetailStatsBar route={route} />

      {/* ── Main content ─────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">

          {/* Left — content */}
          <div className="flex flex-col gap-8">
            {/* Description */}
            <ContentBlock heading="Om turen" body={route.description} />

            {/* Start point */}
            {route.startPoint && (
              <ContentBlock heading="Startpunkt & parkering" icon={MapPin} body={route.startPoint} />
            )}

            {/* Season */}
            {route.season && (
              <ContentBlock heading="Säsong" icon={Sun}>
                <p className="font-body text-sm text-ink leading-relaxed">{route.season}</p>
              </ContentBlock>
            )}

            {/* Tips */}
            {route.tips && route.tips.length > 0 && (
              <ContentBlock heading="Tips för turen" icon={Lightbulb}>
                <ul className="flex flex-col gap-2">
                  {route.tips.map((tip) => (
                    <li key={tip} className="flex gap-2.5 font-body text-sm text-ink leading-relaxed">
                      <span className="text-moss mt-0.5 shrink-0 font-medium" aria-hidden="true">·</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </ContentBlock>
            )}

            {/* Access */}
            <RouteDetailAccessSection
              accessByCar={route.accessByCar}
              accessByTransport={route.accessByTransport}
            />
          </div>

          {/* Right sidebar */}
          <RouteDetailSidebar route={route} />
        </div>
      </div>

      {/* ── Related routes ────────────────────────── */}
      {relatedRoutes && (
        <div className="border-t border-mist-dark">{relatedRoutes}</div>
      )}

      {/* ── Mobile sticky CTA ─────────────────────── */}
      <RouteDetailMobileBar
        title={route.title}
        distance={route.distance}
        duration={route.duration}
      />
    </article>
  )
}
