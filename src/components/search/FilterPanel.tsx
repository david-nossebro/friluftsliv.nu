'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  type FilterDimension,
  type FilterState,
} from '@/lib/exploreFilters'
import { DifficultyFilter } from './filters/DifficultyFilter'
import { RouteShapeFilter } from './filters/RouteShapeFilter'
import { DistanceFilter } from './filters/DistanceFilter'
import { DurationFilter } from './filters/DurationFilter'
import { LocationFilter } from './filters/LocationFilter'
import { SeasonFilter } from './filters/SeasonFilter'
import { PublicTransportFilter } from './filters/PublicTransportFilter'
import { NearMeFilter } from './filters/NearMeFilter'
import { BooleanToggleFilter } from './filters/BooleanToggleFilter'
import { CabinFacilitiesFilter } from './filters/CabinFacilitiesFilter'
import { CabinServiceTypeFilter } from './filters/CabinServiceTypeFilter'
import type { LatLng } from '@/lib/geo'

export interface FilterPanelProps {
  state: FilterState
  patch: (partial: Partial<FilterState>) => void
  applicable: FilterDimension[]
  /** Receive geolocation coords from the Nära mig filter. */
  onCoordsChange?: (coords: LatLng | null) => void
  className?: string
}

/**
 * Filter body, organised into named macro-blocks (Var / Hur lång och svår /
 * När och resa / Praktiskt / Stuga). Each block packs related sub-filters in
 * a flex-wrap row. Soft border-t separators between blocks give the panel a
 * clear vertical rhythm.
 */
export function FilterPanel({
  state,
  patch,
  applicable,
  onCoordsChange,
  className,
}: FilterPanelProps) {
  const can = (dim: FilterDimension) => applicable.includes(dim)

  const showVar = can('landskap') || can('nearMe')
  const showSize =
    can('distance') || can('duration') || can('difficulty') || can('routeShape')
  const showWhen = can('season') || can('publicTransport')
  const showPraktiskt =
    can('dogsAllowed') || can('tentingAllowed') || can('hasCabinsAlong')
  const showCabin = can('cabinServiceType') || can('cabinFacilities')

  return (
    <div className={cn('flex flex-col divide-y divide-mist-dark', className)}>
      {showVar && (
        <Block title="Var">
          {can('nearMe') && (
            <SubSection className="basis-full">
              <NearMeFilter
                active={state.nearMe}
                radiusKm={state.nearMeRadiusKm}
                onActiveChange={(active) => patch({ nearMe: active })}
                onRadiusChange={(r) => patch({ nearMeRadiusKm: r })}
                {...(onCoordsChange ? { onCoordsChange } : {})}
              />
            </SubSection>
          )}
          {can('landskap') && (
            <SubSection className="basis-full">
              <LocationFilter
                landskap={state.landskap}
                selectedKommun={state.selectedKommun}
                onChange={(landskap, selectedKommun) => patch({ landskap, selectedKommun })}
              />
            </SubSection>
          )}
        </Block>
      )}

      {showSize && (
        <Block title="Hur lång och svår">
          {can('distance') && (
            <SubSection className="basis-full md:basis-[280px] grow">
              <DistanceFilter
                min={state.distanceMinKm}
                max={state.distanceMaxKm}
                onCommit={(min, max) => patch({ distanceMinKm: min, distanceMaxKm: max })}
              />
            </SubSection>
          )}
          {can('duration') && (
            <SubSection className="basis-full md:basis-[280px] grow">
              <DurationFilter
                unit={state.durationUnit}
                max={state.durationMax}
                onChange={(unit, max) => patch({ durationUnit: unit, durationMax: max })}
              />
            </SubSection>
          )}
          {can('difficulty') && (
            <SubSection className="basis-full md:basis-[240px] grow">
              <DifficultyFilter
                value={state.difficulty}
                onChange={(d) => patch({ difficulty: d })}
              />
            </SubSection>
          )}
          {can('routeShape') && (
            <SubSection className="basis-full md:basis-[320px] grow">
              <RouteShapeFilter
                value={state.routeShape}
                onChange={(rs) => patch({ routeShape: rs })}
              />
            </SubSection>
          )}
        </Block>
      )}

      {showWhen && (
        <Block title="När och resa">
          {can('season') && (
            <SubSection className="basis-full md:basis-[360px] grow">
              <SeasonFilter
                value={state.months}
                onChange={(months) => patch({ months })}
              />
            </SubSection>
          )}
          {can('publicTransport') && (
            <SubSection className="basis-full md:basis-[280px] grow">
              <PublicTransportFilter
                value={state.publicTransport}
                onChange={(pt) => patch({ publicTransport: pt })}
              />
            </SubSection>
          )}
        </Block>
      )}

      {showPraktiskt && (
        <Block title="Praktiskt">
          <SubSection className="basis-full">
            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">Praktiskt</legend>
              <div className="flex flex-wrap gap-2">
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

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  const titleId = React.useId()
  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-4 first:pt-0 pt-5 first:pb-5 pb-5"
    >
      <h3
        id={titleId}
        className="font-display text-base font-light text-pine flex items-center gap-2"
      >
        <span aria-hidden="true" className="text-moss text-sm leading-none">◆</span>
        {title}
      </h3>
      <div className="flex flex-wrap gap-x-8 gap-y-5">{children}</div>
    </section>
  )
}

function SubSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('min-w-0', className)}>{children}</div>
}
