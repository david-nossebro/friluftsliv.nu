import type { FilterState, PillSpec } from './types'
import type { FilterDimension } from './types'
import type { LongHike, Route } from '@/types'
import type { LatLng } from '../geo'
import {
  matchesQuery,
  matchesDistance,
  matchesDurationMinutes,
  matchesDurationDays,
  matchesPublicTransport,
  matchesSeason,
  passesSharedBase,
  formatDurationFilterLabel,
} from './shared'
import { DEFAULT_DISTANCE_MIN, DEFAULT_DURATION_MIN } from './types'
import { DIFFICULTY_LABELS } from '../difficulty'
import { HIKE_TYPE_LABELS } from '../hikeType'
import { ROUTE_SHAPE_LABELS } from '../routeShape'

// ─── Dimensions ──────────────────────────────────────────────────────────────

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
      const routeHikeType = route.exploreCategory
      if (routeHikeType !== 'vandring' && routeHikeType !== 'fjallvandring') return false
      if (!state.hikeType.includes(routeHikeType)) return false
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

// ─── Pills ───────────────────────────────────────────────────────────────────

export function buildRoutePills(
  state: FilterState,
  dimensions?: readonly FilterDimension[],
): PillSpec[] {
  const pills: PillSpec[] = []
  const wants = (dim: FilterDimension) => !dimensions || dimensions.includes(dim)

  if (wants('difficulty')) {
    for (const d of state.difficulty) {
      pills.push({
        key: `d-${d}`,
        label: DIFFICULTY_LABELS[d],
        dimension: 'difficulty',
        clear: () => ({ difficulty: state.difficulty.filter((x) => x !== d) }),
      })
    }
  }
  if (wants('routeShape') && state.routeShape) {
    pills.push({
      key: 'rs',
      label: ROUTE_SHAPE_LABELS[state.routeShape],
      dimension: 'routeShape',
      clear: () => ({ routeShape: null }),
    })
  }
  if (wants('distance') && (state.distanceMinKm !== DEFAULT_DISTANCE_MIN || state.distanceMaxKm != null)) {
    const maxLabel = state.distanceMaxKm == null ? '300+' : `${state.distanceMaxKm}`
    pills.push({
      key: 'dist',
      label: `${state.distanceMinKm}–${maxLabel} km`,
      dimension: 'distance',
      clear: () => ({ distanceMinKm: DEFAULT_DISTANCE_MIN, distanceMaxKm: null }),
    })
  }
  if (wants('duration') && (state.durationMax != null || state.durationMin > DEFAULT_DURATION_MIN)) {
    pills.push({
      key: 'dur',
      label: formatDurationFilterLabel(state.durationMin, state.durationMax),
      dimension: 'duration',
      clear: () => ({ durationMin: DEFAULT_DURATION_MIN, durationMax: null }),
    })
  }
  if (wants('tentingAllowed') && state.tentingAllowed) {
    pills.push({ key: 'tent', label: 'Tält tillåtet', dimension: 'tentingAllowed', clear: () => ({ tentingAllowed: false }) })
  }
  if (wants('hasCabinsAlong') && state.hasCabinsAlong) {
    pills.push({ key: 'cab', label: 'Stugor längs leden', dimension: 'hasCabinsAlong', clear: () => ({ hasCabinsAlong: false }) })
  }
  if (wants('hikeType')) {
    for (const ht of state.hikeType) {
      pills.push({
        key: `ht-${ht}`,
        label: HIKE_TYPE_LABELS[ht],
        dimension: 'hikeType',
        clear: () => ({ hikeType: state.hikeType.filter((x) => x !== ht) }),
      })
    }
  }

  return pills
}
