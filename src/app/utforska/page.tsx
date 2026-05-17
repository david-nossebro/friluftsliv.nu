import type { Metadata } from 'next'
import { PageLayout } from '@/components/layout/PageLayout'
import { ExploreView } from '@/components/search/ExploreView'
import { normalizeExploreTab } from '@/components/search/exploreTabs'
import { defaultFilterState, parseFilters } from '@/lib/exploreFilters'
import { cabins, getAreaListItems, longHikes, routes, utflykter } from '@/data'

export const metadata: Metadata = {
  title: 'Utforska',
  description: 'Bläddra bland utflykter, rutter, stugor och naturområden i hela Sverige.',
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const urlParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') urlParams.set(key, value)
    else if (Array.isArray(value) && value.length > 0) urlParams.set(key, value[0] ?? '')
  }

  const parsed = parseFilters(urlParams)
  // Normalize legacy tab values (e.g. ?tab=kanotleder → 'kanot').
  const normalizedTab = normalizeExploreTab(parsed.tab) ?? 'alla'
  const initialState = { ...defaultFilterState, ...parsed, tab: normalizedTab }

  return (
    <PageLayout currentPath="/utforska">
      <ExploreView
        areas={getAreaListItems()}
        utflykter={utflykter}
        routes={routes}
        longHikes={longHikes}
        cabins={cabins}
        initialState={initialState}
      />
    </PageLayout>
  )
}
