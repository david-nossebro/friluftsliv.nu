import type { Metadata } from 'next'
import { PageLayout } from '@/components/layout/PageLayout'
import { ExploreView } from '@/components/search/ExploreView'
import { cabins, getAreaListItems, longHikes, routes } from '@/data'
import type { ExploreTab } from '@/types'

export const metadata: Metadata = {
  title: 'Naturområden',
  description: 'Hitta nationalparker och naturreservat med relaterade turer och stugor.',
}

const validTabs: ExploreTab[] = ['alla', 'nationalparker', 'naturreservat']

export default async function AreasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tab?: string }>
}) {
  const params = await searchParams
  const initialQuery = params.q ?? ''
  const initialTab: ExploreTab = validTabs.includes(params.tab as ExploreTab)
    ? (params.tab as ExploreTab)
    : 'alla'

  return (
    <PageLayout currentPath="/utforska">
      <ExploreView
        areas={getAreaListItems()}
        routes={routes}
        longHikes={longHikes}
        cabins={cabins}
        initialQuery={initialQuery}
        initialTab={initialTab}
      />
    </PageLayout>
  )
}
