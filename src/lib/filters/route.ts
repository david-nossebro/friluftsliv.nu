import type { FilterState } from './types'
import type { LongHike, Route, HikeType } from '@/types'
import type { LatLng } from '../geo'
import {
  matchesQuery,
  matchesLandskap,
  matchesDistance,
  matchesDurationMinutes,
  matchesDurationDays,
  matchesPublicTransport,
  matchesNearMe,
  matchesSeason,
  normalizeSelectedLandskap,
  DEFAULT_DISTANCE_MIN,
  DEFAULT_DURATION_MIN,
  formatDurationFilterLabel,
} from './shared'

// ─── Dimensions ──────────────────────────────────────────────────────────────

export const ROUTE_FILTER_DIMENSIONS = [
  'difficulty',
  'hikeType',
  'routeShape',
  'distance',
  'duration',
  'season',
  'landskap',
  'publicTransport',
  'nearMe',
  'dogsAllowed',
  'tentingAllowed',
  'hasCabinsAlong',
] as const

export type RouteFilterDimension = (typeof ROUTE_FILTER_DIMENSIONS)[number]

// ─── Apply ───────────────────────────────────────────────────────────────────

function passesSharedBase(
  item: { landskap?: string[]; coordinates?: LatLng },
  state: FilterState,
  origin: LatLng | null,
): boolean {
  if (state.nearMe) {
    return matchesNearMe(item.coordinates, origin, state.nearMeRadiusKm)
  }
  if (!matchesLandskap(item.landskap as import('@/types').Landskap[], state.landskap)) return false
  return true
}

export function applyRouteFilters(
  routes: Route[],
  state: FilterState,
  origin: LatLng | null,
): Route[] {
  return routes.filter((route) => {
    if (!matchesQuery([route.title, route.region], state.query)) return false
    if (!passesSharedBase(route, state, origin)) return false
    if (state.difficulty.length > 0 && !state.difficulty.includes(route.difficulty)) return false
    if (state.routeShape && route.routeShape && route.routeShape !== state.routeShape) return false
    if (state.routeShape && !route.routeShape) return false
    if (!matchesDistance(route.distance, state.distanceMinKm, state.distanceMaxKm)) return false
    if (!matchesDurationMinutes(route.duration, state.durationMin, state.durationMax)) return false
    if (state.months.length > 0 && !matchesSeason(route, state.months)) return false
    if (!matchesPublicTransport(route.publicTransport, state.publicTransport)) return false
    if (state.dogsAllowed && route.dogsAllowed !== true) return false
    if (state.tentingAllowed && route.tentingAllowed !== true) return false
    if (state.hasCabinsAlong && (!route.cabinIds || route.cabinIds.length === 0)) return false
    if (state.hikeType.length > 0) {
      const routeHikeType = route.exploreCategory ?? 'vandring'
      if (!state.hikeType.includes(routeHikeType as HikeType)) return false
    }
    return true
  })
}

export function applyLongHikeFilters(
  longHikes: LongHike[],
  state: FilterState,
  origin: LatLng | null,
): LongHike[] {
  return longHikes.filter((lh) => {
    if (!matchesQuery([lh.title, lh.region, lh.summary], state.query)) return false
    if (!passesSharedBase(lh, state, origin)) return false
    if (state.difficulty.length > 0 && !state.difficulty.includes(lh.difficulty)) return false
    if (state.routeShape && lh.routeShape && lh.routeShape !== state.routeShape) return false
    if (state.routeShape && !lh.routeShape) return false
    if (!matchesDistance(lh.distance, state.distanceMinKm, state.distanceMaxKm)) return false
    if (!matchesDurationDays(lh.estimatedDays, state.durationMin, state.durationMax)) return false
    if (state.months.length > 0 && !matchesSeason(lh, state.months)) return false
    if (!matchesPublicTransport(lh.publicTransport, state.publicTransport)) return false
    if (state.dogsAllowed && lh.dogsAllowed !== true) return false
    if (state.tentingAllowed && lh.tentingAllowed !== true) return false
    if (state.hasCabinsAlong && (!lh.cabinIds || lh.cabinIds.length === 0)) return false
    if (state.hikeType.length > 0 && !state.hikeType.includes('langvandring')) return false
    return true
  })
}

// ─── Active count ────────────────────────────────────────────────────────────

export function countActiveRouteFilters(state: FilterState): number {
  let n = 0
  if (state.difficulty.length > 0) n++
  if (state.hikeType.length > 0) n++
  if (state.routeShape) n++
  if (state.distanceMinKm !== DEFAULT_DISTANCE_MIN || state.distanceMaxKm != null) n++
  if (state.durationMin !== DEFAULT_DURATION_MIN || state.durationMax != null) n++
  // Landskap is suppressed by Nära mig — see passesSharedBase().
  if (!state.nearMe && normalizeSelectedLandskap(state.landskap).length > 0) n++
  if (state.months.length > 0) n++
  if (state.publicTransport) n++
  if (state.nearMe) n++
  if (state.dogsAllowed) n++
  if (state.tentingAllowed) n++
  if (state.hasCabinsAlong) n++
  return n
}

// ─── Pills ───────────────────────────────────────────────────────────────────

export interface PillSpec {
  key: string
  label: string
  clear: () => Partial<FilterState>
}

export function buildRoutePills(
  state: FilterState,
): PillSpec[] {
  const pills: PillSpec[] = []

  for (const d of state.difficulty) {
    pills.push({
      key: `d-${d}`,
      label: d === 'easy' ? 'Lätt' : d === 'medium' ? 'Medel' : 'Krävande',
      clear: () => ({ difficulty: state.difficulty.filter((x) => x !== d) }),
    })
  }
  if (state.routeShape) {
    pills.push({
      key: 'rs',
      label: state.routeShape === 'roundtrip' ? 'Rundtur' : state.routeShape === 'out-and-back' ? 'Ut och tillbaka' : 'Punkt till punkt',
      clear: () => ({ routeShape: null }),
    })
  }
  if (state.distanceMinKm !== DEFAULT_DISTANCE_MIN || state.distanceMaxKm != null) {
    const maxLabel = state.distanceMaxKm == null ? '300+' : `${state.distanceMaxKm}`
    pills.push({
      key: 'dist',
      label: `${state.distanceMinKm}–${maxLabel} km`,
      clear: () => ({ distanceMinKm: DEFAULT_DISTANCE_MIN, distanceMaxKm: null }),
    })
  }
  if (state.durationMax != null) {
    pills.push({
      key: 'dur',
      label: formatDurationFilterLabel(state.durationMin, state.durationMax),
      clear: () => ({ durationMin: DEFAULT_DURATION_MIN, durationMax: null }),
    })
  } else if (state.durationMin > DEFAULT_DURATION_MIN) {
    pills.push({
      key: 'dur',
      label: formatDurationFilterLabel(state.durationMin, null),
      clear: () => ({ durationMin: DEFAULT_DURATION_MIN, durationMax: null }),
    })
  }
  if (state.tentingAllowed) {
    pills.push({ key: 'tent', label: 'Tält tillåtet', clear: () => ({ tentingAllowed: false }) })
  }
  if (state.hasCabinsAlong) {
    pills.push({ key: 'cab', label: 'Stugor längs leden', clear: () => ({ hasCabinsAlong: false }) })
  }
  for (const ht of state.hikeType) {
    pills.push({
      key: `ht-${ht}`,
      label: ht === 'vandring' ? 'Vandring' : ht === 'fjallvandring' ? 'Fjällvandring' : 'Långvandring',
      clear: () => ({ hikeType: state.hikeType.filter((x) => x !== ht) }),
    })
  }

  return pills
}

// ─── Reset patch ─────────────────────────────────────────────────────────────

export function createRouteResetPatch(): Partial<FilterState> {
  return {
    difficulty: [],
    hikeType: [],
    routeShape: null,
    distanceMinKm: DEFAULT_DISTANCE_MIN,
    distanceMaxKm: null,
    durationMin: DEFAULT_DURATION_MIN,
    durationMax: null,
    landskap: [],
    months: [],
    publicTransport: false,
    nearMe: false,
    nearMeRadiusKm: 25,
    dogsAllowed: false,
    tentingAllowed: false,
    hasCabinsAlong: false,
  }
}
