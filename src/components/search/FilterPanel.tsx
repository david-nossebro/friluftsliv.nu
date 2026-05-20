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
  onCoordsChange?: (coords: LatLng | null) => void
  className?: string
}

/**
 * Advanced filter body organised into grouped blocks. Dense controls stay on
 * full-width rows so the sidebar remains easy to scan even without extra
 * section headings.
 */
export function FilterPanel({
  state,
  patch,
  applicable,
  onCoordsChange,
  className,
}: FilterPanelProps) {
  const can = (dim: FilterDimension) => applicable.includes(dim)

  const showPlats = can('nearMe') || can('landskap')
  const showVad =
    can('difficulty') || can('hikeType') || can('routeShape') || can('distance') || can('duration') ||
    can('publicTransport') || can('dogsAllowed') || can('tentingAllowed') ||
    can('hasCabinsAlong')
  const showWhen = can('season')
  const showCabin = can('cabinServiceType') || can('cabinFacilities')

  const handleNearMeChange = (active: boolean) => {
    // Keep landskap selection intact — the matcher (passesShared) gives
    // Nära mig precedence, so the user's choice is preserved for when they
    // turn Nära mig off again.
    patch({ nearMe: active })
  }

  return (
    <div className={cn('flex flex-col divide-y divide-mist-dark', className)}>
      {showPlats && (
        <Block ariaLabel="Plats">
          {can('nearMe') && (
            <SubSection className="basis-full">
              <NearMeFilter
                active={state.nearMe}
                radiusKm={state.nearMeRadiusKm}
                onActiveChange={handleNearMeChange}
                onRadiusChange={(r) => patch({ nearMeRadiusKm: r })}
                {...(onCoordsChange ? { onCoordsChange } : {})}
              />
            </SubSection>
          )}
          {can('landskap') && (
            <SubSection className="basis-full">
              <LandskapPicker
                value={state.landskap}
                onChange={(landskap) => patch({ landskap })}
                disabled={state.nearMe}
              />
            </SubSection>
          )}
        </Block>
      )}

      {showVad && (
        <Block ariaLabel="Aktivitetsfilter">
          {can('difficulty') && (
            <SubSection className="basis-full">
              <DifficultyFilter
                value={state.difficulty}
                onChange={(d) => patch({ difficulty: d })}
              />
            </SubSection>
          )}
          {can('hikeType') && (
            <SubSection className="basis-full">
              <HikeTypeFilter
                value={state.hikeType}
                onChange={(ht) => patch({ hikeType: ht })}
              />
            </SubSection>
          )}
          {can('routeShape') && (
            <SubSection className="basis-full">
              <RouteShapeFilter
                value={state.routeShape}
                onChange={(rs) => patch({ routeShape: rs })}
              />
            </SubSection>
          )}
          {can('distance') && (
            <SubSection className="basis-full">
              <DistanceFilter
                min={state.distanceMinKm}
                max={state.distanceMaxKm}
                onCommit={(min, max) => patch({ distanceMinKm: min, distanceMaxKm: max })}
              />
            </SubSection>
          )}
          {can('duration') && (
            <SubSection className="basis-full">
              <DurationFilter
                minHours={state.durationMin}
                maxHours={state.durationMax}
                onChange={(durationMin, durationMax) => patch({ durationMin, durationMax })}
              />
            </SubSection>
          )}
          {(can('publicTransport') || can('dogsAllowed') || can('tentingAllowed') || can('hasCabinsAlong')) && (
            <SubSection className="basis-full">
              <fieldset className="flex flex-col gap-5">
                <legend className={FILTER_LABEL_CLASS}>Praktiskt</legend>
                <div className="flex flex-wrap gap-2">
                  {can('publicTransport') && (
                    <BooleanToggleFilter
                      variant="pill"
                      label="Kollektivtrafik"
                      value={state.publicTransport}
                      onChange={(v) => patch({ publicTransport: v })}
                    />
                  )}
                  {can('dogsAllowed') && (
                    <BooleanToggleFilter
                      variant="pill"
                      label="Hund välkommen"
                      value={state.dogsAllowed}
                      onChange={(v) => patch({ dogsAllowed: v })}
                    />
                  )}
                  {can('tentingAllowed') && (
                    <BooleanToggleFilter
                      variant="pill"
                      label="Tält tillåtet"
                      value={state.tentingAllowed}
                      onChange={(v) => patch({ tentingAllowed: v })}
                    />
                  )}
                  {can('hasCabinsAlong') && (
                    <BooleanToggleFilter
                      variant="pill"
                      label="Stugor längs leden"
                      value={state.hasCabinsAlong}
                      onChange={(v) => patch({ hasCabinsAlong: v })}
                    />
                  )}
                </div>
              </fieldset>
            </SubSection>
          )}
        </Block>
      )}

      {showWhen && (
        <Block ariaLabel="Säsongsfilter">
          {can('season') && (
            <SubSection className="basis-full md:basis-[360px] grow">
              <SeasonFilter
                value={state.months}
                onChange={(months) => patch({ months })}
              />
            </SubSection>
          )}
        </Block>
      )}

      {showCabin && (
        <Block title="Stuga">
          {can('cabinServiceType') && (
            <SubSection className="basis-full">
              <CabinServiceTypeFilter
                value={state.cabinServiceType}
                onChange={(t) => patch({ cabinServiceType: t })}
              />
            </SubSection>
          )}
          {can('cabinFacilities') && (
            <SubSection className="basis-full">
              <CabinFacilitiesFilter
                value={state.cabinFacilities}
                onChange={(f) => patch({ cabinFacilities: f })}
              />
            </SubSection>
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

function SubSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('min-w-0', className)}>{children}</div>
}
