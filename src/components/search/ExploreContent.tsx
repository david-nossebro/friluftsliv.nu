'use client'

import * as React from 'react'
import { AreaCardGrid } from '@/components/cards/AreaCardGrid'
import { CabinCardGrid } from '@/components/cards/CabinCardGrid'
import { LongHikeCardGrid } from '@/components/cards/LongHikeCardGrid'
import { RouteCardGrid } from '@/components/cards/RouteCardGrid'
import { UtflyktCardGrid } from '@/components/cards/UtflyktCardGrid'
import { MixedHikeGrid } from '@/components/cards/MixedHikeGrid'
import { splitRoutesByCategory } from '@/lib/exploreFilters'
import type { ApplyFiltersOutput } from '@/lib/exploreFilters'
import type { ExploreTab } from '@/types'

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-20 px-6 text-center">
      <p className="font-body text-sm text-stone">{message}</p>
    </div>
  )
}

export interface ExploreContentProps {
  tab: ExploreTab
  filtered: ApplyFiltersOutput
}

export function ExploreContent({ tab, filtered }: ExploreContentProps) {
  const { hiking, mountain, canoe, ski } = React.useMemo(
    () => splitRoutesByCategory(filtered.routes),
    [filtered.routes],
  )
  const allHikingRoutes = React.useMemo(() => [...hiking, ...mountain], [hiking, mountain])

  if (tab === 'alla') {
    if (filtered.count === 0) {
      return (
        <EmptyState message="Inget matchade dina filter. Försök bredda eller rensa filtren." />
      )
    }

    const nationalparker = filtered.areas.filter(({ area }) => area.kind === 'nationalpark')
    const naturreservat = filtered.areas.filter(({ area }) => area.kind === 'naturreservat')

    return (
      <>
        {filtered.utflykter.length > 0 && (
          <UtflyktCardGrid
            title="Utflykter"
            description="Lugna dagsmål för dig som vill komma ut utan att göra en stor plan av det."
            utflykter={filtered.utflykter}
            className="py-10 bg-mist"
          />
        )}
        {hiking.length > 0 && (
          <div id="vandring" className="scroll-mt-24">
            <RouteCardGrid title="Vandring" routes={hiking} className="py-10 bg-snow" />
          </div>
        )}
        {mountain.length > 0 && (
          <div id="fjallvandring" className="scroll-mt-24">
            <RouteCardGrid title="Fjällvandring" routes={mountain} className="py-10 bg-mist" />
          </div>
        )}
        {filtered.longHikes.length > 0 && (
          <div id="langvandring" className="scroll-mt-24">
            <LongHikeCardGrid
              title="Långvandring"
              longHikes={filtered.longHikes}
              className="py-10 bg-snow"
            />
          </div>
        )}
        {canoe.length > 0 && (
          <RouteCardGrid title="Kanot" routes={canoe} className="py-10 bg-snow" />
        )}
        {ski.length > 0 && (
          <RouteCardGrid title="Skidturer" routes={ski} className="py-10 bg-mist" />
        )}
        {filtered.cabins.length > 0 && (
          <CabinCardGrid title="Stugor" cabins={filtered.cabins} className="py-10 bg-mist" />
        )}
        {nationalparker.length > 0 && (
          <AreaCardGrid title="Nationalparker" areas={nationalparker} className="py-10" />
        )}
        {naturreservat.length > 0 && (
          <AreaCardGrid title="Naturreservat" areas={naturreservat} className="py-10" />
        )}
      </>
    )
  }

  if (tab === 'utflykter') {
    if (filtered.utflykter.length === 0) {
      return <EmptyState message="Inga utflykter matchade dina filter." />
    }
    return (
      <UtflyktCardGrid
        title="Utflykter"
        description="Platser du kan välja för en halvdag eller heldag, med lättare planering och tydlig start."
        utflykter={filtered.utflykter}
        className="py-10 bg-mist"
      />
    )
  }

  if (tab === 'vandring') {
    const hasHikes = allHikingRoutes.length > 0 || filtered.longHikes.length > 0
    if (!hasHikes) {
      return <EmptyState message="Inga vandringsturer matchade dina filter." />
    }
    return (
      <MixedHikeGrid
        routes={allHikingRoutes}
        longHikes={filtered.longHikes}
        className="py-10 bg-snow"
      />
    )
  }

  if (tab === 'stugor') {
    if (filtered.cabins.length === 0) {
      return <EmptyState message="Inga stugor matchade dina filter." />
    }
    return <CabinCardGrid title="Stugor" cabins={filtered.cabins} className="py-10 bg-mist" />
  }

  if (tab === 'nationalparker' || tab === 'naturreservat') {
    const kind = tab === 'nationalparker' ? 'nationalpark' : 'naturreservat'
    const areaTitle = tab === 'nationalparker' ? 'Nationalparker' : 'Naturreservat'
    const areaResults = filtered.areas.filter(({ area }) => area.kind === kind)

    if (areaResults.length === 0) {
      return <EmptyState message={`Inga ${areaTitle.toLowerCase()} matchade dina filter.`} />
    }
    return <AreaCardGrid title={areaTitle} areas={areaResults} className="py-10" />
  }

  const routeResults = tab === 'kanot' ? canoe : ski
  const sectionTitle = tab === 'kanot' ? 'Kanot' : 'Skidturer'

  if (routeResults.length === 0) {
    return <EmptyState message={`Inga turer matchade kategorin ${sectionTitle.toLowerCase()}.`} />
  }
  return <RouteCardGrid title={sectionTitle} routes={routeResults} className="py-10 bg-snow" />
}
