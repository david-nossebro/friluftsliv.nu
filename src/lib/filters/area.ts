import type { FilterState } from './types'
import type { AreaListItem } from '@/types'
import type { LatLng } from '../geo'
import {
  matchesQuery,
  matchesLandskap,
  matchesNearMe,
  normalizeSelectedLandskap,
} from './shared'

// ─── Dimensions ──────────────────────────────────────────────────────────────

export const AREA_FILTER_DIMENSIONS = ['landskap', 'nearMe'] as const

export type AreaFilterDimension = (typeof AREA_FILTER_DIMENSIONS)[number]

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

export function applyAreaFilters(
  areas: AreaListItem[],
  state: FilterState,
  origin: LatLng | null,
): AreaListItem[] {
  return areas.filter(({ area }) => {
    if (!matchesQuery([area.title, area.region, area.summary], state.query)) return false
    if (!passesSharedBase(area, state, origin)) return false
    return true
  })
}

// ─── Active count ────────────────────────────────────────────────────────────

export function countActiveAreaFilters(state: FilterState): number {
  let n = 0
  if (!state.nearMe && normalizeSelectedLandskap(state.landskap).length > 0) n++
  if (state.nearMe) n++
  return n
}

// ─── Pills ───────────────────────────────────────────────────────────────────

export interface PillSpec {
  key: string
  label: string
  clear: () => Partial<FilterState>
}

export function buildAreaPills(): PillSpec[] {
  // Areas have no unique pills beyond shared ones (landskap, nearMe)
  return []
}

// ─── Reset patch ─────────────────────────────────────────────────────────────

export function createAreaResetPatch(): Partial<FilterState> {
  return {
    landskap: [],
    nearMe: false,
    nearMeRadiusKm: 25,
  }
}
