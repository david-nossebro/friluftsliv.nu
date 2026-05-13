import type {
  Route,
  RouteDetail,
  Cabin,
  CabinDetail,
  Area,
  MapFeatureLayer,
  MapMarker,
  MapPosition,
} from '@/types'
import type { ExploreItem } from '@/components/search/ExploreGrid'
import { routes } from './routes'
import { cabins } from './cabins'
import { areas } from './areas'
import { defaultSuggestions } from './suggestions'

export { routes, cabins, areas, defaultSuggestions }

type WithRegion = {
  id: string
  region: string
}

type WithCoordinates = {
  id: string
  title: string
  region: string
  coordinates?: MapPosition
}

function getPrimaryRegion(region: string) {
  return region.split(',')[0]?.trim() ?? region.trim()
}

function isSamePrimaryRegion(item: WithRegion, region: string) {
  return getPrimaryRegion(item.region) === getPrimaryRegion(region)
}

function toRouteExploreItem(data: Route): ExploreItem {
  return {
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
      ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
    },
  }
}

function toCabinExploreItem(data: Cabin): ExploreItem {
  return {
    kind: 'cabin',
    data: {
      id: data.id,
      title: data.title,
      region: data.region,
      amenities: data.amenities,
      available: data.available,
      ...(data.pricePerNight != null ? { pricePerNight: data.pricePerNight } : {}),
      ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
    },
  }
}

function hasCoordinates<T extends WithCoordinates>(
  item: T,
): item is T & { coordinates: MapPosition } {
  return item.coordinates != null
}

function toMapMarker(
  item: WithCoordinates & { coordinates: MapPosition },
  type: MapMarker['type'],
): MapMarker {
  return {
    id: item.id,
    position: item.coordinates,
    type,
    label: item.title,
    description: item.region,
  }
}

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
  const sameRegion = routes.filter((candidate) => {
    return candidate.id !== route.id && isSamePrimaryRegion(candidate, route.region)
  })

  if (sameRegion.length >= n) return sameRegion.slice(0, n)

  const others = routes.filter((candidate) => candidate.id !== route.id && !sameRegion.includes(candidate))
  return [...sameRegion, ...others].slice(0, n)
}

export function getRelatedCabins(cabin: CabinDetail, n = 3): Cabin[] {
  const sameRegion = cabins.filter((candidate) => {
    return candidate.id !== cabin.id && isSamePrimaryRegion(candidate, cabin.region)
  })

  if (sameRegion.length >= n) return sameRegion.slice(0, n)

  const others = cabins.filter((candidate) => candidate.id !== cabin.id && !sameRegion.includes(candidate))
  return [...sameRegion, ...others].slice(0, n)
}

export function getAllExploreItems(): ExploreItem[] {
  return [
    ...areas.map<ExploreItem>((data) => ({ kind: 'area', data })),
    ...routes.map(toRouteExploreItem),
    ...cabins.map(toCabinExploreItem),
  ]
}

export function getMapFeatureLayers(): MapFeatureLayer[] {
  const routeMarkers = routes
    .filter(hasCoordinates)
    .map((route) => toMapMarker(route, 'route'))

  const cabinMarkers = cabins
    .filter(hasCoordinates)
    .map((cabin) => toMapMarker(cabin, 'cabin'))

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
