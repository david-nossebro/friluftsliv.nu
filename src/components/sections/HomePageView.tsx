import { PageLayout } from '@/components/layout/PageLayout'
import { HomeHero } from '@/components/sections/HomeHero'
import { ActivityShortcuts } from '@/components/search/ActivityShortcuts'
import { RouteCardGrid } from '@/components/cards/RouteCardGrid'
import { CabinCardGrid } from '@/components/cards/CabinCardGrid'
import { MapPromo } from '@/components/map/MapPromo'
import type { Cabin, Route, SearchSuggestion } from '@/types'

export interface HomePageViewProps {
  suggestions: SearchSuggestion[]
  featuredRoutes: Route[]
  featuredCabins: Cabin[]
  heroHeadline?: string
  heroImageUrl?: string
}

export function HomePageView({
  suggestions,
  featuredRoutes,
  featuredCabins,
  heroHeadline = 'Välkommen till den svenska naturen.',
  heroImageUrl = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=70&auto=format',
}: HomePageViewProps) {
  return (
    <PageLayout currentPath="/">
      <HomeHero
        headline={heroHeadline}
        imageUrl={heroImageUrl}
        suggestions={suggestions}
      />
      <ActivityShortcuts title="Vad vill du göra?" />
      <RouteCardGrid
        title="Populära rutter"
        routes={featuredRoutes}
        showMoreHref="/utforska?tab=rutter"
      />
      <CabinCardGrid
        title="Stugor och fjällstationer"
        cabins={featuredCabins}
        showMoreHref="/utforska?tab=stugor"
      />
      <MapPromo href="/karta" />
    </PageLayout>
  )
}