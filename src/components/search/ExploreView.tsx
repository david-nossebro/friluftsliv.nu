'use client'

import * as React from 'react'
import { ExploreFilters } from './ExploreFilters'
import { AreaCardGrid } from '@/components/cards/AreaCardGrid'
import { CabinCardGrid } from '@/components/cards/CabinCardGrid'
import { LongHikeCardGrid } from '@/components/cards/LongHikeCardGrid'
import { RouteCardGrid } from '@/components/cards/RouteCardGrid'
import { UtflyktCardGrid } from '@/components/cards/UtflyktCardGrid'
import { SectionJumpNav } from '@/components/common/SectionJumpNav'
import { FilterPanel } from './FilterPanel'
import { FilterDrawer } from './FilterDrawer'
import { FilterToolbar } from './FilterToolbar'
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
  const [panelOpen, setPanelOpen] = React.useState(false)
  const panelId = React.useId()

  const applicable = React.useMemo(() => getApplicableFilters(state.tab), [state.tab])

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

  // Collapse the inline panel with Escape when it's open and focus is inside.
  React.useEffect(() => {
    if (!panelOpen) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanelOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [panelOpen])

  const hikingRoutes = filtered.routes.filter((r) => r.exploreCategory === 'vandring')
  const mountainRoutes = filtered.routes.filter((r) => r.exploreCategory === 'fjallvandring')
  const canoeRoutes = filtered.routes.filter((r) => r.exploreCategory === 'kanot')
  const skiRoutes = filtered.routes.filter((r) => r.exploreCategory === 'skidturer')

  let content: React.ReactNode

  const hikingSections = [
    hikingRoutes.length > 0 && {
      id: 'vandring',
      label: 'Vandring',
      count: hikingRoutes.length,
      content: <RouteCardGrid title="Vandring" routes={hikingRoutes} className="py-10 bg-snow" />,
    },
    mountainRoutes.length > 0 && {
      id: 'fjallvandring',
      label: 'Fjällvandring',
      count: mountainRoutes.length,
      content: <RouteCardGrid title="Fjällvandring" routes={mountainRoutes} className="py-10 bg-mist" />,
    },
    filtered.longHikes.length > 0 && {
      id: 'langvandring',
      label: 'Långvandring',
      count: filtered.longHikes.length,
      content: <LongHikeCardGrid title="Långvandring" longHikes={filtered.longHikes} className="py-10 bg-snow" />,
    },
  ].filter(
    (s): s is { id: string; label: string; count: number; content: React.ReactElement } => Boolean(s),
  )

  const hikingJumpItems = hikingSections.map(({ id, label, count }) => ({
    href: `#${id}`,
    label,
    count,
  }))

  const { tab } = state

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
    content =
      hikingSections.length === 0 ? (
        <EmptyState message="Inga vandringsturer matchade dina filter." />
      ) : (
        <>
          {hikingJumpItems.length > 1 && (
            <div className="px-6 pt-8">
              <div className="mx-auto max-w-[1200px]">
                <SectionJumpNav
                  description="Hoppa direkt till den typ av vandring du vill utforska."
                  ariaLabel="Hoppa mellan vandringstyper"
                  items={hikingJumpItems}
                />
              </div>
            </div>
          )}
          {hikingSections.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-24">
              {section.content}
            </div>
          ))}
        </>
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

      <div className="bg-snow border-b border-mist-dark">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <FilterToolbar
            state={state}
            patch={patch}
            count={filtered.count}
            isOpen={panelOpen}
            onToggle={() => setPanelOpen((v) => !v)}
            panelId={panelId}
            mobileTrigger={
              <FilterDrawer
                state={state}
                patch={patch}
                applicable={applicable}
                resultCount={filtered.count}
                onCoordsChange={setOrigin}
              />
            }
          />

          {/* Inline expandable panel — desktop only. CSS-grid row trick for
              accessible height animation (0fr ↔ 1fr) with overflow:hidden on
              the inner cell. `inert` removes the collapsed subtree from focus +
              AT order without unmounting (avoiding open-flash on remount). */}
          <div
            id={panelId}
            role="region"
            aria-label="Filter"
            aria-hidden={!panelOpen}
            {...(!panelOpen ? { inert: '' as unknown as boolean } : {})}
            className="hidden lg:grid mt-3 transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
            style={{ gridTemplateRows: panelOpen ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="rounded-xl border border-mist-dark bg-white shadow-card p-5">
                <FilterPanel
                  state={state}
                  patch={patch}
                  applicable={applicable}
                  onCoordsChange={setOrigin}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-6">{content}</div>
    </div>
  )
}
