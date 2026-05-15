import { useId, type ReactNode } from 'react'
import { LeafletMap, SWEDEN_CENTER } from '@/components/map/LeafletMap'
import type { MapFeatureLayer, MapPosition } from '@/types'

export interface RouteMapSectionProps {
  title: string
  description?: string
  ariaLabel: string
  center?: MapPosition
  zoom?: number
  featureLayers?: MapFeatureLayer[]
  tracks?: MapPosition[][]
  /** Slot for buttons rendered below the map (e.g. GPX download, share). */
  actions?: ReactNode
}

export function RouteMapSection({
  title,
  description,
  ariaLabel,
  center,
  zoom,
  featureLayers,
  tracks,
  actions,
}: RouteMapSectionProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <div>
        <h2 id={headingId} className="font-display text-2xl font-light text-pine">
          {title}
        </h2>
        {description && (
          <p className="mt-2 font-body text-sm text-stone max-w-2xl">{description}</p>
        )}
      </div>

      <LeafletMap
        center={center ?? SWEDEN_CENTER}
        zoom={zoom ?? (center ? 10 : 5)}
        height="420px"
        aria-label={ariaLabel}
        {...(featureLayers ? { featureLayers } : {})}
        {...(tracks ? { tracks } : {})}
      />

      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </section>
  )
}
