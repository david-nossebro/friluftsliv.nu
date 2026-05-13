import type { ReactNode } from 'react'
import {
  Trees,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ImageGallery } from '@/components/sections/ImageGallery'
import { ContentBlock } from '@/components/sections/ContentBlock'
import { FacilityGrid, type FacilityItem } from '@/components/common/FacilityGrid'
import { LeafletMap, SWEDEN_CENTER } from '@/components/map/LeafletMap'
import { CabinDetailInfoBar } from './CabinDetailInfoBar'
import { CabinDetailAccessSection } from './CabinDetailAccessSection'
import { CabinBookingCard } from '@/components/cards/CabinBookingCard'
import { CabinDetailMobileBar } from './CabinDetailMobileBar'
import type { CabinDetail, CabinServiceType } from '@/types'

const serviceTypeLabels: Record<CabinServiceType, string> = {
  obetjänad:   'Obetjänad',
  betjänad:    'Betjänad',
  självhushåll: 'Självhushåll',
}

export interface CabinDetailPageProps {
  cabin: CabinDetail
  /** Pre-built facility items for the FacilityGrid (icons cannot be data-driven) */
  facilityItems?: FacilityItem[]
  /** Pre-built "suitable for" items */
  suitableForItems?: FacilityItem[]
  relatedCabins?: ReactNode
  onBack?: () => void
  className?: string
}

export function CabinDetailPage({
  cabin,
  facilityItems = [],
  suitableForItems = [],
  relatedCabins,
  onBack,
  className,
}: CabinDetailPageProps) {
  const availabilityVariant = cabin.available ? 'moss' : 'ember'
  const availabilityLabel  = cabin.available ? 'Tillgänglig' : 'Bokad'

  return (
    <article className={cn('bg-snow min-h-screen', className)}>
      {/* ── Hero ─────────────────────────────────── */}
      <ImageGallery
        src={cabin.imageUrl ?? ''}
        alt={cabin.title}
        images={cabin.images}
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
              <Badge variant="mist" size="sm">{serviceTypeLabels[cabin.serviceType]}</Badge>
              <Badge variant={availabilityVariant} size="sm">{availabilityLabel}</Badge>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-light text-snow leading-tight">
              {cabin.title}
            </h1>
            <p className="font-body text-sm text-snow/75 flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.5} aria-hidden="true" />
              {cabin.region}
            </p>
          </div>
        }
      />

      {/* ── Key info bar ─────────────────────────── */}
      <CabinDetailInfoBar cabin={cabin} />

      {/* ── Main content ─────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">

          {/* Left — content */}
          <div className="flex flex-col gap-8">
            {/* Description */}
            <ContentBlock heading="Om stugan" body={cabin.description} />

            {/* Amenities as a tag list (from the existing Cabin.amenities) */}
            {cabin.amenities.length > 0 && (
              <ContentBlock heading="Utrustning & bekvämligheter">
                <div className="flex flex-wrap gap-2">
                  {cabin.amenities.map((item) => (
                    <Badge key={item} variant="mist">{item}</Badge>
                  ))}
                </div>
              </ContentBlock>
            )}

            {/* Activities */}
            {cabin.activities && (
              <ContentBlock heading="Aktiviteter i området" icon={Trees} body={cabin.activities} />
            )}

            {/* Access */}
            <CabinDetailAccessSection
              accessSummer={cabin.accessSummer}
              accessWinter={cabin.accessWinter}
            />

            {/* Facilities */}
            {facilityItems.length > 0 && (
              <ContentBlock heading="Faciliteter">
                <FacilityGrid items={facilityItems} />
              </ContentBlock>
            )}

            {/* Suitable for */}
            {suitableForItems.length > 0 && (
              <ContentBlock heading="Passar för">
                <FacilityGrid items={suitableForItems} />
              </ContentBlock>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-[76px]" aria-label="Karta och bokning">
            <LeafletMap
              center={cabin.coordinates ?? SWEDEN_CENTER}
              zoom={cabin.coordinates ? 13 : 5}
              featureLayers={cabin.coordinates ? [{
                type: 'stuga',
                label: cabin.title,
                color: '#2C4A3E',
                markers: [{
                  id: cabin.id,
                  position: cabin.coordinates,
                  type: 'stuga',
                  label: cabin.title,
                  description: cabin.region,
                }],
              }] : undefined}
              height="220px"
              aria-label={`Karta för ${cabin.title}`}
            />

            {/* Booking CTA */}
            <CabinBookingCard
              pricePerNight={cabin.pricePerNight}
              bookingUrl={cabin.bookingUrl}
            />
          </aside>
        </div>
      </div>

      {/* ── Related cabins ────────────────────────── */}
      {relatedCabins && (
        <div className="border-t border-mist-dark">{relatedCabins}</div>
      )}

      {/* ── Mobile sticky CTA ─────────────────────── */}
      <CabinDetailMobileBar
        title={cabin.title}
        beds={cabin.beds}
        pricePerNight={cabin.pricePerNight}
        openPeriod={cabin.openPeriod}
        bookingUrl={cabin.bookingUrl}
      />
    </article>
  )
}
