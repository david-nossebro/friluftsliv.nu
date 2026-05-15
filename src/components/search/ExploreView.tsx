'use client'

import * as React from 'react'
import { ExploreFilters } from './ExploreFilters'
import { allExploreSections } from './exploreTabs'
import { AreaCardGrid } from '@/components/cards/AreaCardGrid'
import { CabinCardGrid } from '@/components/cards/CabinCardGrid'
import { LongHikeCardGrid } from '@/components/cards/LongHikeCardGrid'
import { RouteCardGrid } from '@/components/cards/RouteCardGrid'
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

type RouteExploreTab = Extract<ExploreTab, 'vandring' | 'fjallvandring' | 'kanotleder' | 'skidturer'>

const routeSectionTitles: Record<RouteExploreTab, string> = {
  vandring: 'Vandring',
  fjallvandring: 'Fjällvandring',
  kanotleder: 'Kanotleder',
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

  React.useEffect(() => {
    setTab(initialTab)
  }, [initialTab])

  React.useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

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

  const allCount =
    filteredAreas.length + filteredRoutes.length + filteredLongHikes.length + filteredCabins.length

  let content: React.ReactNode

  if (tab === 'alla') {
    const allSections = allExploreSections.flatMap((section) => {
      if (section.value === 'langvandring') {
        return filteredLongHikes.length > 0
          ? [
              <LongHikeCardGrid
                key={section.value}
                title={section.label}
                longHikes={filteredLongHikes}
                className="py-10 bg-snow"
              />,
            ]
          : []
      }

      if (section.value === 'stugor') {
        return filteredCabins.length > 0
          ? [
              <CabinCardGrid
                key={section.value}
                title={section.label}
                cabins={filteredCabins}
                className="py-10 bg-mist"
              />,
            ]
          : []
      }

      if (section.value === 'nationalparker' || section.value === 'naturreservat') {
        const areaKind = section.value === 'nationalparker' ? 'nationalpark' : 'naturreservat'
        const areaResults = filteredAreas.filter(({ area }) => area.kind === areaKind)

        return areaResults.length > 0
          ? [
              <AreaCardGrid
                key={section.value}
                title={section.label}
                areas={areaResults}
                className="py-10"
              />,
            ]
          : []
      }

      const routeResults = filteredRoutes.filter((route) => route.exploreCategory === section.value)

      return routeResults.length > 0
        ? [
            <RouteCardGrid
              key={section.value}
              title={section.label}
              routes={routeResults}
              className="py-10 bg-snow"
            />,
          ]
        : []
    })

    content =
      allCount === 0 ? (
        <EmptyState message="Inget matchade din sökning. Försök med ett annat område eller ett kortare ord." />
      ) : (
        <>{allSections}</>
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
  } else if (tab === 'langvandring') {
    content =
      filteredLongHikes.length === 0 ? (
        <EmptyState message="Inga långvandringar matchade din sökning just nu." />
      ) : (
        <LongHikeCardGrid
          title="Långvandring"
          longHikes={filteredLongHikes}
          className="py-10 bg-snow"
        />
      )
  } else {
    const routeResults = filteredRoutes.filter((route) => route.exploreCategory === tab)

    content =
      routeResults.length === 0 ? (
        <EmptyState message={`Inga turer matchade kategorin ${routeSectionTitles[tab].toLowerCase()} just nu.`} />
      ) : (
        <RouteCardGrid title={routeSectionTitles[tab]} routes={routeResults} className="py-10 bg-snow" />
      )
  }

  return (
    <div className={className}>
      <ExploreFilters activeTab={tab} onTabChange={setTab} />
      {content}
    </div>
  )
}
