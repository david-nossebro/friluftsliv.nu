'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  type FilterDimension,
  type FilterState,
} from '@/lib/exploreFilters'
import { DifficultyFilter } from './filters/DifficultyFilter'
import { HikeTypeFilter } from './filters/HikeTypeFilter'
import { RouteShapeFilter } from './filters/RouteShapeFilter'
import { DistanceFilter } from './filters/DistanceFilter'
import { DurationFilter } from './filters/DurationFilter'
import { SeasonFilter } from './filters/SeasonFilter'
import { NearMeFilter } from './filters/NearMeFilter'
import { LandskapPicker } from './filters/LandskapPicker'
import { BooleanToggleFilter } from './filters/BooleanToggleFilter'
import { CabinFacilitiesFilter } from './filters/CabinFacilitiesFilter'
import { CabinServiceTypeFilter } from './filters/CabinServiceTypeFilter'
import type { LatLng } from '@/lib/geo'
import { FILTER_LABEL_CLASS } from './filters/filterStyles'

export interface FilterPanelProps {
  state: FilterState
  patch: (partial: Partial<FilterState>) => void
  applicable: FilterDimension[]
  /** Receive geolocation coords from the Nära mig filter. */
  onCoordsChange?: ((coords: LatLng | null) => void) | undefined
  className?: string
}

/**
 * Advanced filter body organised into grouped blocks. Dense controls stay on
 * full-width rows so the sidebar remains easy to scan even without extra
 * section headings.
 */
const BOOLEAN_TOGGLE_DIMENSIONS = [
  'publicTransport',
  'dogsAllowed',
  'tentingAllowed',
  'hasCabinsAlong',
] as const satisfies readonly FilterDimension[]

const BOOLEAN_TOGGLE_LABELS: Record<(typeof BOOLEAN_TOGGLE_DIMENSIONS)[number], string> = {
  publicTransport: 'Kollektivtrafik',
  dogsAllowed: 'Hund välkommen',
  tentingAllowed: 'Tält tillåtet',
  hasCabinsAlong: 'Stugor längs leden',
}

export function FilterPanel({
  state,
  patch,
  applicable,
  onCoordsChange,
  className,
}: FilterPanelProps) {
  const applicableSet = React.useMemo(() => new Set(applicable), [applicable])
  const can = (dim: FilterDimension) => applicableSet.has(dim)

  const showPlats = can('nearMe') || can('landskap')
  const showBooleanToggles = BOOLEAN_TOGGLE_DIMENSIONS.some(can)
  const showActivityFilters =
    can('difficulty') || can('hikeType') || can('routeShape') || can('distance') || can('duration') ||
    showBooleanToggles
  const showWhen = can('season') || can('utflyktDuration')
  const showCabin = can('cabinServiceType') || can('cabinFacilities')

  return (
    <div className={cn('flex flex-col divide-y divide-mist-dark', className)}>
      {showPlats && (
        <Block ariaLabel="Plats">
          {can('nearMe') && (
            <div className="min-w-0 basis-full">
              <NearMeFilter
                active={state.nearMe}
                radiusKm={state.nearMeRadiusKm}
                onActiveChange={(active) => patch({ nearMe: active })}
                onRadiusChange={(r) => patch({ nearMeRadiusKm: r })}
                onCoordsChange={onCoordsChange}
              />
            </div>
          )}
          {can('landskap') && (
            <div className="min-w-0 basis-full">
              <LandskapPicker
                value={state.landskap}
                onChange={(landskap) => patch({ landskap })}
                disabled={state.nearMe}
              />
            </div>
          )}
        </Block>
      )}

      {showActivityFilters && (
        <Block ariaLabel="Aktivitetsfilter">
          {can('difficulty') && (
            <div className="min-w-0 basis-full">
              <DifficultyFilter
                value={state.difficulty}
                onChange={(d) => patch({ difficulty: d })}
              />
            </div>
          )}
          {can('hikeType') && (
            <div className="min-w-0 basis-full">
              <HikeTypeFilter
                value={state.hikeType}
                onChange={(ht) => patch({ hikeType: ht })}
              />
            </div>
          )}
          {can('routeShape') && (
            <div className="min-w-0 basis-full">
              <RouteShapeFilter
                value={state.routeShape}
                onChange={(rs) => patch({ routeShape: rs })}
              />
            </div>
          )}
          {can('distance') && (
            <div className="min-w-0 basis-full">
              <DistanceFilter
                min={state.distanceMinKm}
                max={state.distanceMaxKm}
                onCommit={(min, max) => patch({ distanceMinKm: min, distanceMaxKm: max })}
              />
            </div>
          )}
          {can('duration') && (
            <div className="min-w-0 basis-full">
              <DurationFilter
                minHours={state.durationMin}
                maxHours={state.durationMax}
                onChange={(durationMin, durationMax) => patch({ durationMin, durationMax })}
              />
            </div>
          )}
          {showBooleanToggles && (
            <div className="min-w-0 basis-full">
              <fieldset className="flex flex-col gap-5">
                <legend className={FILTER_LABEL_CLASS}>Praktiskt</legend>
                <div className="flex flex-wrap gap-2">
                  {BOOLEAN_TOGGLE_DIMENSIONS.filter(can).map((dim) => (
                    <BooleanToggleFilter
                      key={dim}
                      variant="pill"
                      label={BOOLEAN_TOGGLE_LABELS[dim]}
                      value={state[dim] as boolean}
                      onChange={(v) => patch({ [dim]: v } as Partial<FilterState>)}
                    />
                  ))}
                </div>
              </fieldset>
            </div>
          )}
        </Block>
      )}

      {showWhen && (
        <Block ariaLabel="Säsongsfilter">
          {can('season') && (
            <div className="min-w-0 basis-full md:basis-[360px] grow">
              <SeasonFilter
                value={state.months}
                onChange={(months) => patch({ months })}
              />
            </div>
          )}
          {can('utflyktDuration') && (
            <div className="min-w-0 basis-full">
              <DurationFilter
                minHours={state.utflyktDurationMin}
                maxHours={state.utflyktDurationMax}
                onChange={(min, max) => patch({ utflyktDurationMin: min, utflyktDurationMax: max })}
                scale={[0, 1, 1.5, 2, 3, 4, 5, 6, 8]}
                label="Tid på plats"
                minLabel="0 tim"
                maxLabel="8+ tim"
              />
            </div>
          )}
        </Block>
      )}

      {showCabin && (
        <Block title="Stuga">
          {can('cabinServiceType') && (
            <div className="min-w-0 basis-full">
              <CabinServiceTypeFilter
                value={state.cabinServiceType}
                onChange={(t) => patch({ cabinServiceType: t })}
              />
            </div>
          )}
          {can('cabinFacilities') && (
            <div className="min-w-0 basis-full">
              <CabinFacilitiesFilter
                value={state.cabinFacilities}
                onChange={(f) => patch({ cabinFacilities: f })}
              />
            </div>
          )}
        </Block>
      )}
    </div>
  )
}

function Block({
  title,
  ariaLabel,
  children,
}: {
  title?: string
  ariaLabel?: string
  children: React.ReactNode
}) {
  const titleId = React.useId()
  const labelledBy = title ? titleId : undefined
  return (
    <section
      {...(labelledBy ? { 'aria-labelledby': labelledBy } : { 'aria-label': ariaLabel })}
      className="flex flex-col gap-5 first:pt-0 pt-6 first:pb-6 pb-6"
    >
      {title && (
        <h3
          id={titleId}
          className="font-display text-base font-light text-pine flex items-center gap-2"
        >
          <span aria-hidden="true" className="text-moss text-sm leading-none">◆</span>
          {title}
        </h3>
      )}
      <div className="flex flex-wrap gap-x-8 gap-y-7">{children}</div>
    </section>
  )
}


