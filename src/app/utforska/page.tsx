import type { Metadata } from 'next'
import { PageLayout } from '@/components/layout/PageLayout'
import { ExploreView } from '@/components/organisms/ExploreView'
import type { ExploreTab } from '@/components/organisms/ExploreFilters'
import { getAllExploreItems } from '@/data'

export const metadata: Metadata = {
  title: 'Utforska',
  description: 'Bläddra bland rutter, stugor och naturområden i hela Sverige.',
}

const validTabs: ExploreTab[] = ['alla', 'rutter', 'stugor', 'omraden']

export default async function ExplorePage({
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
        items={getAllExploreItems()}
        initialQuery={initialQuery}
        initialTab={initialTab}
      />
    </PageLayout>
  )
}
