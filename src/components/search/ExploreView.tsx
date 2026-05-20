'use client'

import * as React from 'react'
import { ExploreFilters } from './ExploreFilters'
import { AreaCardGrid } from '@/components/cards/AreaCardGrid'
import { CabinCardGrid } from '@/components/cards/CabinCardGrid'
import { LongHikeCardGrid } from '@/components/cards/LongHikeCardGrid'
import { RouteCardGrid } from '@/components/cards/RouteCardGrid'
import { UtflyktCardGrid } from '@/components/cards/UtflyktCardGrid'
import { MixedHikeGrid } from '@/components/cards/MixedHikeGrid'
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-20 px-6 text-center">
      <p className="font-body text-sm text-stone">{message}</p>
    </div>
  )
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
  const { state, patch } = useExploreFilters(initialState ?? defaultFilterState)
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

  const { canoeRoutes, skiRoutes, hikingSections, allHikingRoutes } = React.useMemo(() => {
    const { hiking, mountain, canoe, ski } = splitRoutesByCategory(filtered.routes)
    const sections = [
      hiking.length > 0 && {
        id: 'vandring',
        label: 'Vandring',
        count: hiking.length,
        content: <RouteCardGrid title="Vandring" routes={hiking} className="py-10 bg-snow" />,
      },
      mountain.length > 0 && {
        id: 'fjallvandring',
        label: 'Fjällvandring',
        count: mountain.length,
        content: <RouteCardGrid title="Fjällvandring" routes={mountain} className="py-10 bg-mist" />,
      },
      filtered.longHikes.length > 0 && {
        id: 'langvandring',
        label: 'Långvandring',
        count: filtered.longHikes.length,
        content: (
          <LongHikeCardGrid
            title="Långvandring"
            longHikes={filtered.longHikes}
            className="py-10 bg-snow"
          />
        ),
      },
    ].filter(
      (s): s is { id: string; label: string; count: number; content: React.ReactElement } =>
        Boolean(s),
    )
    return {
      canoeRoutes: canoe,
      skiRoutes: ski,
      hikingSections: sections,
      allHikingRoutes: [...hiking, ...mountain],
    }
  }, [filtered.routes, filtered.longHikes])

  const { tab } = state
  let content: React.ReactNode

  if (tab === 'alla') {
    content =
      filtered.count === 0 ? (
        <EmptyState message="Inget matchade dina filter. Försök bredda eller rensa filtren." />
      ) : (
        <>
          {filtered.utflykter.length > 0 && (
            <UtflyktCardGrid
              title="Utflykter"
              description="Lugna dagsmål för dig som vill komma ut utan att göra en stor plan av det."
              utflykter={filtered.utflykter}
              className="py-10 bg-mist"
            />
          )}
          {hikingSections.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-24">
              {section.content}
            </div>
          ))}
          {canoeRoutes.length > 0 && (
            <RouteCardGrid title="Kanot" routes={canoeRoutes} className="py-10 bg-snow" />
          )}
          {skiRoutes.length > 0 && (
            <RouteCardGrid title="Skidturer" routes={skiRoutes} className="py-10 bg-mist" />
          )}
          {filtered.cabins.length > 0 && (
            <CabinCardGrid title="Stugor" cabins={filtered.cabins} className="py-10 bg-mist" />
          )}
          {filtered.areas.filter(({ area }) => area.kind === 'nationalpark').length > 0 && (
            <AreaCardGrid
              title="Nationalparker"
              areas={filtered.areas.filter(({ area }) => area.kind === 'nationalpark')}
              className="py-10"
            />
          )}
          {filtered.areas.filter(({ area }) => area.kind === 'naturreservat').length > 0 && (
            <AreaCardGrid
              title="Naturreservat"
              areas={filtered.areas.filter(({ area }) => area.kind === 'naturreservat')}
              className="py-10"
            />
          )}
        </>
      )
  } else if (tab === 'utflykter') {
    content =
      filtered.utflykter.length === 0 ? (
        <EmptyState message="Inga utflykter matchade dina filter." />
      ) : (
        <UtflyktCardGrid
          title="Utflykter"
          description="Platser du kan välja för en halvdag eller heldag, med lättare planering och tydlig start."
          utflykter={filtered.utflykter}
          className="py-10 bg-mist"
        />
      )
  } else if (tab === 'vandring') {
    const hasHikes = allHikingRoutes.length > 0 || filtered.longHikes.length > 0
    content = !hasHikes ? (
      <EmptyState message="Inga vandringsturer matchade dina filter." />
    ) : (
      <MixedHikeGrid
        routes={allHikingRoutes}
        longHikes={filtered.longHikes}
        className="py-10 bg-snow"
      />
    )
  } else if (tab === 'stugor') {
    content =
      filtered.cabins.length === 0 ? (
        <EmptyState message="Inga stugor matchade dina filter." />
      ) : (
        <CabinCardGrid title="Stugor" cabins={filtered.cabins} className="py-10 bg-mist" />
      )
  } else if (tab === 'nationalparker' || tab === 'naturreservat') {
    const kind = tab === 'nationalparker' ? 'nationalpark' : 'naturreservat'
    const areaTitle = tab === 'nationalparker' ? 'Nationalparker' : 'Naturreservat'
    const areaResults = filtered.areas.filter(({ area }) => area.kind === kind)

    content =
      areaResults.length === 0 ? (
        <EmptyState message={`Inga ${areaTitle.toLowerCase()} matchade dina filter.`} />
      ) : (
        <AreaCardGrid title={areaTitle} areas={areaResults} className="py-10" />
      )
  } else {
    const routeResults = tab === 'kanot' ? canoeRoutes : skiRoutes
    const sectionTitle = tab === 'kanot' ? 'Kanot' : 'Skidturer'

    content =
      routeResults.length === 0 ? (
        <EmptyState message={`Inga turer matchade kategorin ${sectionTitle.toLowerCase()}.`} />
      ) : (
        <RouteCardGrid title={sectionTitle} routes={routeResults} className="py-10 bg-snow" />
      )
  }

  return (
    <div className={className}>
      <ExploreFilters
        activeTab={tab}
        onTabChange={(next: ExploreTab) => patch({ tab: next })}
      />

      <div className="bg-snow border-b border-mist-dark lg:hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <FilterToolbar
            state={state}
            patch={patch}
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
          {content}
        </div>
      </div>
    </div>
  )
}
