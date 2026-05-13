import { HomePageView } from '@/components/sections/HomePageView'
import { defaultSuggestions, getFeaturedRoutes, getFeaturedCabins } from '@/data'

export default function HomePage() {
  return (
    <HomePageView
      suggestions={defaultSuggestions}
      featuredRoutes={getFeaturedRoutes(8)}
      featuredCabins={getFeaturedCabins(4)}
    />
  )
}
