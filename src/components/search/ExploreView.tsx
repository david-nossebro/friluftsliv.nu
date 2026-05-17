'use client'

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ExploreFilters } from './ExploreFilters'
import { AreaCardGrid } from '@/components/cards/AreaCardGrid'
import { CabinCardGrid } from '@/components/cards/CabinCardGrid'
import { LongHikeCardGrid } from '@/components/cards/LongHikeCardGrid'
import { RouteCardGrid } from '@/components/cards/RouteCardGrid'
import { SectionJumpNav } from '@/components/common/SectionJumpNav'
import type { Area, AreaListItem, Cabin, ExploreTab, LongHike, Route } from '@/types'

export interface ExploreViewProps {
  areas: AreaListItem[]
  routes: Route[]
  longHikes: LongHike[]
  cabins: Cabin[]
  initialQuery?: string
  initialTab?: ExploreTab
  className?: string
}

type RouteExploreTab = Extract<ExploreTab, 'kanot' | 'skidturer'>

const routeSectionTitles: Record<RouteExploreTab, string> = {
  kanot: 'Kanot',
  skidturer: 'Skidturer',
}

function matchesAreaQuery(area: Area, query: string) {
  if (!query) return true

  const q = query.toLowerCase()
  return [area.title, area.region, area.summary].some((value) => value.toLowerCase().includes(q))
}

function matchesRouteQuery(route: Route, query: string) {
  if (!query) return true

  const q = query.toLowerCase()
  return [route.title, route.region].some((value) => value.toLowerCase().includes(q))
}

function matchesLongHikeQuery(longHike: LongHike, query: string) {
  if (!query) return true

  const q = query.toLowerCase()
  return [longHike.title, longHike.region, longHike.summary].some((value) =>
    value.toLowerCase().includes(q),
  )
}

function matchesCabinQuery(cabin: Cabin, query: string) {
  if (!query) return true

  const q = query.toLowerCase()
  return [cabin.title, cabin.region].some((value) => value.toLowerCase().includes(q))
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
  routes,
  longHikes,
  cabins,
  initialQuery = '',
  initialTab = 'alla',
  className,
}: ExploreViewProps) {
  const [tab, setTab] = React.useState<ExploreTab>(initialTab)
  const [query, setQuery] = React.useState(initialQuery)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  React.useEffect(() => {
    setTab(initialTab)
  }, [initialTab])

  React.useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleTabChange = React.useCallback(
    (nextTab: ExploreTab) => {
      if (nextTab === tab) return

      setTab(nextTab)

      const nextParams = new URLSearchParams(searchParams.toString())
      nextParams.set('tab', nextTab)

      const nextUrl = `${pathname}?${nextParams.toString()}`
      router.push(nextUrl, { scroll: false })
    },
    [pathname, router, searchParams, tab],
  )

  const filteredAreas = React.useMemo(
    () => areas.filter(({ area }) => matchesAreaQuery(area, query)),
    [areas, query],
  )
  const filteredRoutes = React.useMemo(
    () => routes.filter((route) => matchesRouteQuery(route, query)),
    [routes, query],
  )
  const filteredLongHikes = React.useMemo(
    () => longHikes.filter((longHike) => matchesLongHikeQuery(longHike, query)),
    [longHikes, query],
  )
  const filteredCabins = React.useMemo(
    () => cabins.filter((cabin) => matchesCabinQuery(cabin, query)),
    [cabins, query],
  )
  const hikingRoutes = React.useMemo(
    () => filteredRoutes.filter((route) => route.exploreCategory === 'vandring'),
    [filteredRoutes],
  )
  const mountainRoutes = React.useMemo(
    () => filteredRoutes.filter((route) => route.exploreCategory === 'fjallvandring'),
    [filteredRoutes],
  )
  const canoeRoutes = React.useMemo(
    () => filteredRoutes.filter((route) => route.exploreCategory === 'kanot'),
    [filteredRoutes],
  )
  const skiRoutes = React.useMemo(
    () => filteredRoutes.filter((route) => route.exploreCategory === 'skidturer'),
    [filteredRoutes],
  )

  const allCount =
    filteredAreas.length + filteredRoutes.length + filteredLongHikes.length + filteredCabins.length

  let content: React.ReactNode

  const hikingSections = [
    hikingRoutes.length > 0
      ? {
          id: 'vandring',
          label: 'Vandring',
          count: hikingRoutes.length,
          content: (
            <RouteCardGrid
              title="Vandring"
              routes={hikingRoutes}
              className="py-10 bg-snow"
            />
          ),
        }
      : null,
    mountainRoutes.length > 0
      ? {
          id: 'fjallvandring',
          label: 'Fjällvandring',
          count: mountainRoutes.length,
          content: (
            <RouteCardGrid
              title="Fjällvandring"
              routes={mountainRoutes}
              className="py-10 bg-mist"
            />
          ),
        }
      : null,
    filteredLongHikes.length > 0
      ? {
          id: 'langvandring',
          label: 'Långvandring',
          count: filteredLongHikes.length,
          content: (
            <LongHikeCardGrid
              title="Långvandring"
              longHikes={filteredLongHikes}
              className="py-10 bg-snow"
            />
          ),
        }
      : null,
  ].filter(
    (
      section,
    ): section is { id: string; label: string; count: number; content: React.ReactElement } =>
      section !== null,
  )
  const hikingJumpItems = hikingSections.map(({ id, label, count }) => ({
    href: `#${id}`,
    label,
    count,
  }))

  if (tab === 'alla') {
    content =
      allCount === 0 ? (
        <EmptyState message="Inget matchade din sökning. Försök med ett annat område eller ett kortare ord." />
      ) : (
        <>
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
          {filteredCabins.length > 0 && (
            <CabinCardGrid title="Stugor" cabins={filteredCabins} className="py-10 bg-mist" />
          )}
          {filteredAreas.filter(({ area }) => area.kind === 'nationalpark').length > 0 && (
            <AreaCardGrid
              title="Nationalparker"
              areas={filteredAreas.filter(({ area }) => area.kind === 'nationalpark')}
              className="py-10"
            />
          )}
          {filteredAreas.filter(({ area }) => area.kind === 'naturreservat').length > 0 && (
            <AreaCardGrid
              title="Naturreservat"
              areas={filteredAreas.filter(({ area }) => area.kind === 'naturreservat')}
              className="py-10"
            />
          )}
        </>
      )
  } else if (tab === 'vandring') {
    content =
      hikingSections.length === 0 ? (
        <EmptyState message="Inga vandringsturer matchade din sökning just nu." />
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
      filteredCabins.length === 0 ? (
        <EmptyState message="Inga stugor matchade din sökning just nu." />
      ) : (
        <CabinCardGrid title="Stugor" cabins={filteredCabins} className="py-10 bg-mist" />
      )
  } else if (tab === 'nationalparker' || tab === 'naturreservat') {
    const kind = tab === 'nationalparker' ? 'nationalpark' : 'naturreservat'
    const areaTitle = tab === 'nationalparker' ? 'Nationalparker' : 'Naturreservat'
    const areaResults = filteredAreas.filter(({ area }) => area.kind === kind)

    content =
      areaResults.length === 0 ? (
        <EmptyState message={`Inga ${areaTitle.toLowerCase()} matchade din sökning just nu.`} />
      ) : (
        <AreaCardGrid title={areaTitle} areas={areaResults} className="py-10" />
      )
  } else {
    const routeResults = tab === 'kanot' ? canoeRoutes : skiRoutes

    content =
      routeResults.length === 0 ? (
        <EmptyState message={`Inga turer matchade kategorin ${routeSectionTitles[tab].toLowerCase()} just nu.`} />
      ) : (
        <RouteCardGrid title={routeSectionTitles[tab]} routes={routeResults} className="py-10 bg-snow" />
      )
  }

  return (
    <div className={className}>
      <ExploreFilters activeTab={tab} onTabChange={handleTabChange} />
      {content}
    </div>
  )
}
