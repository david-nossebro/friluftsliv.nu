import type { FilterState, PillSpec } from './types'
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
  DEFAULT_DISTANCE_MIN,
  DEFAULT_DURATION_MIN,
  formatDurationFilterLabel,
} from './shared'

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
): PillSpec[] {
  const pills: PillSpec[] = []

  for (const d of state.difficulty) {
    pills.push({
      key: `d-${d}`,
      label: d === 'easy' ? 'Lätt' : d === 'medium' ? 'Medel' : 'Krävande',
      dimension: 'difficulty',
      clear: () => ({ difficulty: state.difficulty.filter((x) => x !== d) }),
    })
  }
  if (state.routeShape) {
    pills.push({
      key: 'rs',
      label: state.routeShape === 'roundtrip' ? 'Rundtur' : state.routeShape === 'out-and-back' ? 'Ut och tillbaka' : 'Punkt till punkt',
      dimension: 'routeShape',
      clear: () => ({ routeShape: null }),
    })
  }
  if (state.distanceMinKm !== DEFAULT_DISTANCE_MIN || state.distanceMaxKm != null) {
    const maxLabel = state.distanceMaxKm == null ? '300+' : `${state.distanceMaxKm}`
    pills.push({
      key: 'dist',
      label: `${state.distanceMinKm}–${maxLabel} km`,
      dimension: 'distance',
      clear: () => ({ distanceMinKm: DEFAULT_DISTANCE_MIN, distanceMaxKm: null }),
    })
  }
  if (state.durationMax != null) {
    pills.push({
      key: 'dur',
      label: formatDurationFilterLabel(state.durationMin, state.durationMax),
      dimension: 'duration',
      clear: () => ({ durationMin: DEFAULT_DURATION_MIN, durationMax: null }),
    })
  } else if (state.durationMin > DEFAULT_DURATION_MIN) {
    pills.push({
      key: 'dur',
      label: formatDurationFilterLabel(state.durationMin, null),
      dimension: 'duration',
      clear: () => ({ durationMin: DEFAULT_DURATION_MIN, durationMax: null }),
    })
  }
  if (state.tentingAllowed) {
    pills.push({ key: 'tent', label: 'Tält tillåtet', dimension: 'tentingAllowed', clear: () => ({ tentingAllowed: false }) })
  }
  if (state.hasCabinsAlong) {
    pills.push({ key: 'cab', label: 'Stugor längs leden', dimension: 'hasCabinsAlong', clear: () => ({ hasCabinsAlong: false }) })
  }
  for (const ht of state.hikeType) {
    pills.push({
      key: `ht-${ht}`,
      label: ht === 'vandring' ? 'Vandring' : ht === 'fjallvandring' ? 'Fjällvandring' : 'Långvandring',
      dimension: 'hikeType',
      clear: () => ({ hikeType: state.hikeType.filter((x) => x !== ht) }),
    })
  }

  return pills
}
