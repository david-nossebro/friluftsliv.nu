'use client'

import * as React from 'react'
import { ExploreTabBar } from './ExploreTabBar'
import { ExploreContent } from './ExploreContent'
import { FilterDrawer } from './FilterDrawer'
import { FilterToolbar } from './FilterToolbar'
import { ResultsHeader } from './ResultsHeader'
import { useExploreFilters } from '@/lib/useExploreFilters'
import {
  type FilterState,
  applyFilters,
  defaultFilterState,
  getApplicableFilters,
  splitRoutesByCategory,
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

  const { canoeRoutes, skiRoutes, hikingData, allHikingRoutes } = React.useMemo(() => {
    const { hiking, mountain, canoe, ski } = splitRoutesByCategory(filtered.routes)
    return {
      canoeRoutes: canoe,
      skiRoutes: ski,
      hikingData: {
        hikingRoutes: hiking,
        mountainRoutes: mountain,
        longHikes: filtered.longHikes,
      },
      allHikingRoutes: [...hiking, ...mountain],
    }
  }, [filtered.routes, filtered.longHikes])

  const { tab } = state

  return (
    <div className={className}>
      <ExploreTabBar
        activeTab={tab}
        onTabChange={(next: ExploreTab) => patch({ tab: next })}
      />

      <div className="bg-snow border-b border-mist-dark lg:hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <FilterToolbar
            state={state}
            patch={patch}
            reset={reset}
            applicable={applicable}
            count={filtered.count}
            showCount={false}
            mobileTrigger={
              hasAnyFilters && state.tab !== 'alla' ? (
                <FilterDrawer
                  state={state}
                  patch={patch}
                  applicable={applicable}
                  resultCount={filtered.count}
                  onCoordsChange={setOrigin}
                />
              ) : undefined
            }
          />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <div className="min-w-0">
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
                  resultCount={filtered.count}
                  onCoordsChange={setOrigin}
                />
              </div>
            )}
          </div>
          <ExploreContent
            tab={tab}
            filtered={filtered}
            canoeRoutes={canoeRoutes}
            skiRoutes={skiRoutes}
            hikingData={hikingData}
            allHikingRoutes={allHikingRoutes}
          />
        </div>
      </div>
    </div>
  )
}
