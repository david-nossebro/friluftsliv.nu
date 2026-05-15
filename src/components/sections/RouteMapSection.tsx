'use client'

import { useId, useState, type ReactNode } from 'react'
import { LeafletMap, SWEDEN_CENTER } from '@/components/map/LeafletMap'
import { ElevationProfile } from '@/components/charts/ElevationProfile'
import { getActivityColor } from '@/lib/activityColor'
import { pointAtDistanceKm } from '@/lib/elevation'
import type { ActivityType, MapFeatureLayer, MapPosition } from '@/types'

export interface RouteMapSectionProps {
  title: string
  description?: string
  ariaLabel: string
  center?: MapPosition
  zoom?: number
  featureLayers?: MapFeatureLayer[]
  tracks?: MapPosition[][]
  /** Activity type — drives the polyline + chart line color. */
  activityType?: ActivityType
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
  activityType,
  actions,
}: RouteMapSectionProps) {
  const headingId = useId()
  const [cursorKm, setCursorKm] = useState<number | null>(null)

  const track = tracks?.[0]
  const hasElevation =
    !!track && track.length > 1 && track.every((p) => p.ele !== undefined)
  const cursorPosition =
    track && cursorKm !== null ? pointAtDistanceKm(track, cursorKm) : undefined

  const trackColor = getActivityColor(activityType)

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
        trackColor={trackColor}
        {...(featureLayers ? { featureLayers } : {})}
        {...(tracks ? { tracks } : {})}
        {...(cursorPosition ? { cursorPosition } : {})}
      />

      {hasElevation && track && (
        <ElevationProfile
          track={track}
          {...(activityType ? { activityType } : {})}
          onScrub={setCursorKm}
          ariaLabel={`Höjdprofil för ${title.toLowerCase()}`}
        />
      )}

      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </section>
  )
}
