import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ContentBlock } from '@/components/sections/ContentBlock'
import { DetailPageAnchors } from '@/components/sections/DetailPageAnchors'
import { ImageGallery } from '@/components/sections/ImageGallery'
import { RouteDetailAccessSection } from '@/components/sections/RouteDetailAccessSection'
import { RouteMapSection } from '@/components/sections/RouteMapSection'
import { RouteStatGrid } from '@/components/sections/RouteStatGrid'
import { UtflyktCardGrid } from '@/components/cards/UtflyktCardGrid'
import { buildUtflyktStats } from '@/lib/routeStats'
import type { MapFeatureLayer, Utflykt, UtflyktDetail } from '@/types'

export interface UtflyktDetailPageProps {
  utflykt: UtflyktDetail
  relatedUtflykter?: Utflykt[]
}

export function UtflyktDetailPage({
  utflykt,
  relatedUtflykter = [],
}: UtflyktDetailPageProps) {
  const featureLayers: MapFeatureLayer[] | undefined = utflykt.coordinates
    ? [
        {
          type: 'utflykt',
          label: utflykt.region,
          color: '#4A7C59',
          markers: [
            {
              id: utflykt.id,
              position: utflykt.coordinates,
              type: 'utflykt',
              label: utflykt.title,
              description: utflykt.region,
            },
          ],
        },
      ]
    : undefined

  const anchors = [
    { id: 'om-utflykten', label: 'Om utflykten' },
    { id: 'tillgang', label: 'Så tar du dig dit' },
    ...(utflykt.facilities?.length || utflykt.tips?.length ? [{ id: 'bra-att-veta', label: 'Bra att veta' }] : []),
    ...(utflykt.suitableFor?.length ? [{ id: 'for-vem', label: 'Passar dig som' }] : []),
    { id: 'karta', label: 'Karta' },
  ]

  return (
    <article className="bg-snow min-h-screen">
      <ImageGallery
        src={utflykt.imageUrl ?? ''}
        alt={utflykt.title}
        overlay={
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="birch" size="sm">
                Utflykt
              </Badge>
              {utflykt.highlights.slice(0, 2).map((highlight) => (
                <Badge key={highlight} variant="outline" size="sm">
                  {highlight}
                </Badge>
              ))}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-light text-snow leading-tight">
              {utflykt.title}
            </h1>
            <p className="font-body text-sm text-snow/85 flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.5} aria-hidden="true" />
              {utflykt.region}
            </p>
            <p className="font-body text-sm text-snow/80 max-w-2xl">{utflykt.summary}</p>
          </div>
        }
        {...(utflykt.images ? { images: utflykt.images } : {})}
      />

      <RouteStatGrid
        stats={buildUtflyktStats(utflykt)}
        ariaLabel={`Översikt för ${utflykt.title}`}
      />

      <DetailPageAnchors anchors={anchors} />

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-10">
        <section id="om-utflykten" className="scroll-mt-24">
          <ContentBlock heading="Om utflykten" body={utflykt.description} />
        </section>

        <div id="tillgang" className="scroll-mt-24">
          <RouteDetailAccessSection
            {...(utflykt.accessByCar ? { accessByCar: utflykt.accessByCar } : {})}
            {...(utflykt.accessByTransport ? { accessByTransport: utflykt.accessByTransport } : {})}
          />
        </div>

        {(utflykt.facilities?.length || utflykt.tips?.length) && (
          <section id="bra-att-veta" className="scroll-mt-24 flex flex-col gap-6">
            <ContentBlock heading="Bra att veta">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {utflykt.facilities && utflykt.facilities.length > 0 && (
                  <div className="rounded-xl border border-mist-dark bg-white p-5">
                    <p className="font-body text-2xs uppercase tracking-wide text-stone">Det finns här</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {utflykt.facilities.map((facility) => (
                        <Badge key={facility} variant="mist" size="sm">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {utflykt.tips && utflykt.tips.length > 0 && (
                  <div className="rounded-xl border border-mist-dark bg-white p-5">
                    <p className="font-body text-2xs uppercase tracking-wide text-stone">Tänk på det här</p>
                    <ul className="mt-3 list-disc marker:text-moss pl-5 flex flex-col gap-2 font-body text-sm text-ink leading-relaxed">
                      {utflykt.tips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ContentBlock>
          </section>
        )}

        {utflykt.suitableFor && utflykt.suitableFor.length > 0 && (
          <section id="for-vem" className="scroll-mt-24">
            <ContentBlock heading="Passar dig som">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {utflykt.suitableFor.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-mist-dark bg-white px-4 py-3 font-body text-sm text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </ContentBlock>
          </section>
        )}

        <div id="karta" className="scroll-mt-24">
          <RouteMapSection
            title="Platsen på karta"
            description="Se var utflykten ligger innan du ger dig av. Det gör det lättare att planera dagen i lugn och ro."
            ariaLabel={`Karta för ${utflykt.title}`}
            activityType="vandring"
            {...(utflykt.coordinates ? { center: utflykt.coordinates, zoom: 11 } : {})}
            {...(featureLayers ? { featureLayers } : {})}
          />
        </div>
      </div>

      {relatedUtflykter.length > 0 && (
        <div className="border-t border-mist-dark">
          <UtflyktCardGrid
            title="Liknande utflykter"
            description="Några andra platser som passar när du vill komma ut över dagen utan stor planering."
            utflykter={relatedUtflykter}
            mobileLayout="scroll"
          />
        </div>
      )}
    </article>
  )
}
