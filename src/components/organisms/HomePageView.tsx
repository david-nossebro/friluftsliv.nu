import { PageLayout } from '@/components/layout/PageLayout'
import { HomeHero } from '@/components/organisms/HomeHero'
import { ActivityShortcuts } from '@/components/organisms/ActivityShortcuts'
import { RouteCardGrid } from '@/components/organisms/RouteCardGrid'
import { CabinCardGrid } from '@/components/organisms/CabinCardGrid'
import { MapPromo } from '@/components/organisms/MapPromo'
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
  heroHeadline = 'Hitta din tur — från Skåne till Lappland',
  heroImageUrl = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80',
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
        title="Stugor att upptäcka"
        cabins={featuredCabins}
        showMoreHref="/utforska?tab=stugor"
      />
      <MapPromo href="/karta" />
    </PageLayout>
  )
}