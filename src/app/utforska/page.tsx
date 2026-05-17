import type { Metadata } from 'next'
import { PageLayout } from '@/components/layout/PageLayout'
import { ExploreView } from '@/components/search/ExploreView'
import { normalizeExploreTab } from '@/components/search/exploreTabs'
import type { ExploreTab } from '@/types'
import { cabins, getAreaListItems, longHikes, routes, utflykter } from '@/data'

export const metadata: Metadata = {
  title: 'Utforska',
  description: 'Bläddra bland utflykter, rutter, stugor och naturområden i hela Sverige.',
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tab?: string }>
}) {
  const params = await searchParams
  const initialQuery = params.q ?? ''
  const initialTab: ExploreTab = normalizeExploreTab(params.tab) ?? 'alla'

  return (
    <PageLayout currentPath="/utforska">
      <ExploreView
        areas={getAreaListItems()}
        utflykter={utflykter}
        routes={routes}
        longHikes={longHikes}
        cabins={cabins}
        initialQuery={initialQuery}
        initialTab={initialTab}
      />
    </PageLayout>
  )
}
