import type {
  Route,
  RouteDetail,
  RouteExploreCategory,
  Utflykt,
  UtflyktDetail,
  LongHike,
  Stage,
  StageDetail,
  Cabin,
  CabinDetail,
  Area,
  AreaListItem,
  MapFeatureLayer,
  MapMarker,
  MapPosition,
  ProtectedAreaKind,
} from '@/types'
import { routes } from './routes'
import { longHikes } from './longHikes'
import { stages } from './stages'
import { cabins } from './cabins'
import { areas } from './areas'
import { utflykter } from './utflykter'
import { defaultSuggestions } from './suggestions'

export { routes, longHikes, stages, cabins, areas, utflykter, defaultSuggestions }

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

function hasSharedAreaIds(left?: string[], right?: string[]) {
  if (!left || !right) return false
  return left.some((id) => right.includes(id))
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

export function getUtflyktById(id: string): UtflyktDetail | undefined {
  return utflykter.find((utflykt) => utflykt.id === id)
}

export function getLongHikeById(id: string): LongHike | undefined {
  return longHikes.find((trail) => trail.id === id)
}

export function getStageById(id: string): StageDetail | undefined {
  return stages.find((stage) => stage.id === id)
}

export function getCabinById(id: string): CabinDetail | undefined {
  return cabins.find((c) => c.id === id)
}

export function getAreaById(id: string): Area | undefined {
  return areas.find((a) => a.id === id)
}

export function getRoutesByExploreCategory(category: RouteExploreCategory): Route[] {
  return routes.filter((route) => route.exploreCategory === category)
}

export function getStagesForLongHike(longHikeId: string): Stage[] {
  return stages
    .filter((stage) => stage.longHikeId === longHikeId)
    .sort((a, b) => a.stageNumber - b.stageNumber)
}

export function getLongHikeForStage(stageId: string): LongHike | undefined {
  const stage = getStageById(stageId)
  if (!stage) return undefined
  return getLongHikeById(stage.longHikeId)
}

export function getAdjacentStages(stageId: string): {
  previousStage?: Stage
  nextStage?: Stage
} {
  const stage = getStageById(stageId)
  if (!stage) return {}

  const orderedStages = getStagesForLongHike(stage.longHikeId)
  const stageIndex = orderedStages.findIndex((candidate) => candidate.id === stageId)

  return {
    ...(stageIndex > 0 ? { previousStage: orderedStages[stageIndex - 1] } : {}),
    ...(stageIndex >= 0 && stageIndex < orderedStages.length - 1
      ? { nextStage: orderedStages[stageIndex + 1] }
      : {}),
  }
}

export function getRoutesForAreaId(areaId: string): Route[] {
  return routes.filter((route) => route.areaIds?.includes(areaId))
}

export function getUtflykterForAreaId(areaId: string): Utflykt[] {
  return utflykter.filter((utflykt) => utflykt.areaIds?.includes(areaId))
}

export function getCabinsForAreaId(areaId: string): Cabin[] {
  return cabins.filter((cabin) => cabin.areaIds?.includes(areaId))
}

function toAreaListItem(area: Area): AreaListItem {
  return {
    area,
    routeCount: getRoutesForAreaId(area.id).length,
    cabinCount: getCabinsForAreaId(area.id).length,
  }
}

export function getAreaListItems(): AreaListItem[] {
  return areas.map(toAreaListItem)
}

export function getAreaListItemsByKind(kind: ProtectedAreaKind): AreaListItem[] {
  return areas.filter((area) => area.kind === kind).map(toAreaListItem)
}

export function getAreaRoutesByCategory(areaId: string, category: RouteExploreCategory): Route[] {
  return getRoutesForAreaId(areaId).filter((route) => route.exploreCategory === category)
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

export function getRelatedUtflykter(utflykt: UtflyktDetail, n = 3): Utflykt[] {
  const sharedArea = utflykter.filter((candidate) => {
    return candidate.id !== utflykt.id && hasSharedAreaIds(candidate.areaIds, utflykt.areaIds)
  })

  if (sharedArea.length >= n) return sharedArea.slice(0, n)

  const sameRegion = utflykter.filter((candidate) => {
    return (
      candidate.id !== utflykt.id &&
      !sharedArea.includes(candidate) &&
      isSamePrimaryRegion(candidate, utflykt.region)
    )
  })

  if (sharedArea.length + sameRegion.length >= n) {
    return [...sharedArea, ...sameRegion].slice(0, n)
  }

  const others = utflykter.filter(
    (candidate) => candidate.id !== utflykt.id && !sharedArea.includes(candidate) && !sameRegion.includes(candidate),
  )

  return [...sharedArea, ...sameRegion, ...others].slice(0, n)
}

export function getRelatedCabins(cabin: CabinDetail, n = 3): Cabin[] {
  const sameRegion = cabins.filter((candidate) => {
    return candidate.id !== cabin.id && isSamePrimaryRegion(candidate, cabin.region)
  })

  if (sameRegion.length >= n) return sameRegion.slice(0, n)

  const others = cabins.filter((candidate) => candidate.id !== cabin.id && !sameRegion.includes(candidate))
  return [...sameRegion, ...others].slice(0, n)
}

export function getMapFeatureLayers(): MapFeatureLayer[] {
  const utflyktMarkers = utflykter
    .filter(hasCoordinates)
    .map((utflykt) => toMapMarker(utflykt, 'utflykt'))

  const routeMarkers = routes
    .filter(hasCoordinates)
    .map((route) => toMapMarker(route, 'route'))

  const cabinMarkers = cabins
    .filter(hasCoordinates)
    .map((cabin) => toMapMarker(cabin, 'cabin'))

  return [
    {
      type: 'utflykt',
      label: 'Utflykter',
      icon: '🌿',
      color: '#4A7C59',
      markers: utflyktMarkers,
    },
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
