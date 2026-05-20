'use client'

import * as React from 'react'
import { ExploreTabBar } from './ExploreTabBar'
import { ExploreContent } from './ExploreContent'
import { FilterDrawer } from './FilterDrawer'
import { ResultsHeader } from './ResultsHeader'
import { useExploreFilters } from '@/lib/useExploreFilters'
import {
  type FilterState,
  applyFilters,
  defaultFilterState,
  getApplicableFilters,
} from '@/lib/exploreFilters'
import type { LatLng } from '@/lib/geo'
import type { AreaListItem, Cabin, ExploreTab, LongHike, Route, Utflykt } from '@/types'

export interface ExploreViewProps {
  areas: AreaListItem[]
  utflykter: Utflykt[]
  routes: Route[]
  longHikes: LongHike[]
  cabins: Cabin[]
  initialState?: FilterState
  className?: string
}

function getVisibleCount(tab: ExploreTab, filtered: ReturnType<typeof applyFilters>): number {
  switch (tab) {
    case 'alla':
      return filtered.count
    case 'utflykter':
      return filtered.utflykter.length
    case 'vandring': {
      const hikingRoutes = filtered.routes.filter(
        (r) => r.exploreCategory === 'vandring' || r.exploreCategory === 'fjallvandring',
      )
      return hikingRoutes.length + filtered.longHikes.length
    }
    case 'kanot':
      return filtered.routes.filter((r) => r.exploreCategory === 'kanot').length
    case 'skidturer':
      return filtered.routes.filter((r) => r.exploreCategory === 'skidturer').length
    case 'stugor':
      return filtered.cabins.length
    case 'nationalparker':
      return filtered.areas.filter(({ area }) => area.kind === 'nationalpark').length
    case 'naturreservat':
      return filtered.areas.filter(({ area }) => area.kind === 'naturreservat').length
  }
}

export function ExploreView({
  areas,
  utflykter,
  routes,
  longHikes,
  cabins,
  initialState,
  className,
}: ExploreViewProps) {
  const { state, patch, reset } = useExploreFilters(initialState ?? defaultFilterState)
  const [origin, setOrigin] = React.useState<LatLng | null>(null)

  const applicable = React.useMemo(() => getApplicableFilters(state.tab), [state.tab])
  const hasAnyFilters = applicable.length > 0

  const filtered = React.useMemo(
    () =>
      applyFilters({
        state,
        origin: state.nearMe ? origin : null,
        areas,
        utflykter,
        routes,
        longHikes,
        cabins,
      }),
    [state, origin, areas, utflykter, routes, longHikes, cabins],
  )

  const visibleCount = React.useMemo(
    () => getVisibleCount(state.tab, filtered),
    [state.tab, filtered],
  )

  const { tab } = state

  return (
    <div className={className}>
      <ExploreTabBar
        activeTab={tab}
        onTabChange={(next: ExploreTab) => patch({ tab: next })}
      />

      {/* Mobile filter toolbar */}
      <div className="bg-snow border-b border-mist-dark lg:hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <ResultsHeader
              state={state}
              patch={patch}
              reset={reset}
              applicable={applicable}
              count={filtered.count}
              showCount={false}
              className="flex-1 min-w-0"
            />
            <div className="flex items-center gap-2 shrink-0">
              {hasAnyFilters && state.tab !== 'alla' && (
                <FilterDrawer
                  state={state}
                  patch={patch}
                  applicable={applicable}
                  resultCount={visibleCount}
                  onCoordsChange={setOrigin}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <div className="min-w-0">
          {/* Desktop results header + filter drawer */}
          <div className="mb-6 hidden lg:flex items-start justify-between gap-4">
            <ResultsHeader
              state={state}
              patch={patch}
              reset={reset}
              applicable={applicable}
              count={filtered.count}
              showCount={false}
              className="min-w-0 flex-1"
            />
            {hasAnyFilters && state.tab !== 'alla' && (
              <div className="relative z-[60] flex shrink-0 items-center gap-3">
                <FilterDrawer
                  variant="desktop"
                  state={state}
                  patch={patch}
                  applicable={applicable}
                  resultCount={visibleCount}
                  onCoordsChange={setOrigin}
                />
              </div>
            )}
          </div>
          <ExploreContent tab={tab} filtered={filtered} />
        </div>
      </div>
    </div>
  )
}
