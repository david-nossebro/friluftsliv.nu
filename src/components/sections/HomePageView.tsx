import { PageLayout } from '@/components/layout/PageLayout'
import { HomeHero } from '@/components/sections/HomeHero'
import { ActivityShortcuts } from '@/components/search/ActivityShortcuts'
import { RouteCardGrid } from '@/components/cards/RouteCardGrid'
import { CabinCardGrid } from '@/components/cards/CabinCardGrid'
import { MapPromo } from '@/components/map/MapPromo'
import type { HeroImageOption } from '@/components/search/HeroSearch'
import type { Cabin, Route, SearchSuggestion } from '@/types'

const DEFAULT_HERO_IMAGES: HeroImageOption[] = [
  { url: '/hero-home-tiveden-urskog.jpg', label: 'Tiveden urskog' },
  { url: '/hero-home-dawn-lake.jpg', label: 'Spegelblank skogssjö vid gryning' },
  { url: '/hero-home-kungsleden-fjall.jpg', label: 'Kungsleden i kvällsljus' },
  { url: '/hero-home-skansk-bokskog.jpg', label: 'Skånsk bokskog i vårljus' },
]

export interface HomePageViewProps {
  suggestions: SearchSuggestion[]
  featuredRoutes: Route[]
  featuredCabins: Cabin[]
  heroHeadline?: string
  heroImages?: HeroImageOption[]
}

export function HomePageView({
  suggestions,
  featuredRoutes,
  featuredCabins,
  heroHeadline = 'Välkommen till den svenska naturen.',
  heroImages = DEFAULT_HERO_IMAGES,
}: HomePageViewProps) {
  return (
    <PageLayout currentPath="/">
      <HomeHero
        headline={heroHeadline}
        images={heroImages}
        suggestions={suggestions}
      />
      <ActivityShortcuts title="Vad vill du göra?" />
      <RouteCardGrid
        title="Populära rutter"
        routes={featuredRoutes}
        showMoreHref="/utforska"
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
