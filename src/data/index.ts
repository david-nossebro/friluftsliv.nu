import type {
  Route,
  RouteDetail,
  Cabin,
  CabinDetail,
  Area,
  MapFeatureLayer,
} from '@/types'
import type { ExploreItem } from '@/components/search/ExploreGrid'
import { routes } from './routes'
import { cabins } from './cabins'
import { areas } from './areas'
import { defaultSuggestions } from './suggestions'

export { routes, cabins, areas, defaultSuggestions }

export function getRouteById(id: string): RouteDetail | undefined {
  return routes.find((r) => r.id === id)
}

export function getCabinById(id: string): CabinDetail | undefined {
  return cabins.find((c) => c.id === id)
}

export function getAreaById(id: string): Area | undefined {
  return areas.find((a) => a.id === id)
}

export function getFeaturedRoutes(n = 6): Route[] {
  return routes.slice(0, n)
}

export function getFeaturedCabins(n = 4): Cabin[] {
  return cabins.slice(0, n)
}

export function getRelatedRoutes(route: RouteDetail, n = 3): Route[] {
  const sameRegion = routes.filter(
    (r) => r.id !== route.id && r.region.split(',')[0] === route.region.split(',')[0],
  )
  if (sameRegion.length >= n) return sameRegion.slice(0, n)
  const others = routes.filter((r) => r.id !== route.id && !sameRegion.includes(r))
  return [...sameRegion, ...others].slice(0, n)
}

export function getRelatedCabins(cabin: CabinDetail, n = 3): Cabin[] {
  const sameRegion = cabins.filter(
    (c) => c.id !== cabin.id && c.region.split(',')[0] === cabin.region.split(',')[0],
  )
  if (sameRegion.length >= n) return sameRegion.slice(0, n)
  const others = cabins.filter((c) => c.id !== cabin.id && !sameRegion.includes(c))
  return [...sameRegion, ...others].slice(0, n)
}

export function getAllExploreItems(): ExploreItem[] {
  return [
    ...areas.map<ExploreItem>((data) => ({ kind: 'area', data })),
    ...routes.map<ExploreItem>((data) => ({
      kind: 'route',
      data: {
        id: data.id,
        title: data.title,
        region: data.region,
        activityType: data.activityType,
        distance: data.distance,
        elevation: data.elevation,
        duration: data.duration,
        difficulty: data.difficulty,
        imageUrl: data.imageUrl,
      },
    })),
    ...cabins.map<ExploreItem>((data) => ({
      kind: 'cabin',
      data: {
        id: data.id,
        title: data.title,
        region: data.region,
        amenities: data.amenities,
        pricePerNight: data.pricePerNight,
        available: data.available,
        imageUrl: data.imageUrl,
      },
    })),
  ]
}

export function getMapFeatureLayers(): MapFeatureLayer[] {
  const routeMarkers = routes
    .filter((r) => r.coordinates)
    .map((r) => ({
      id: r.id,
      position: r.coordinates!,
      type: 'route',
      label: r.title,
      description: r.region,
    }))

  const cabinMarkers = cabins
    .filter((c) => c.coordinates)
    .map((c) => ({
      id: c.id,
      position: c.coordinates!,
      type: 'cabin',
      label: c.title,
      description: c.region,
    }))

  return [
    {
      type: 'route',
      label: 'Rutter',
      icon: '⛰',
      color: '#2C4A3E',
      markers: routeMarkers,
    },
    {
      type: 'cabin',
      label: 'Stugor',
      icon: '🏠',
      color: '#D97B4F',
      markers: cabinMarkers,
    },
  ]
}
