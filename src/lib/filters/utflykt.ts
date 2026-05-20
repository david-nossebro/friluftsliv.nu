import type { FilterState } from './types'
import type { Utflykt } from '@/types'
import type { LatLng } from '../geo'
import {
  matchesQuery,
  matchesLandskap,
  matchesPublicTransport,
  matchesNearMe,
  matchesSeason,
  normalizeSelectedLandskap,
} from './shared'

// ─── Dimensions ──────────────────────────────────────────────────────────────

export const UTFLYKT_FILTER_DIMENSIONS = [
  'landskap',
  'season',
  'publicTransport',
  'nearMe',
  'dogsAllowed',
] as const

export type UtflyktFilterDimension = (typeof UTFLYKT_FILTER_DIMENSIONS)[number]

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

export function applyUtflyktFilters(
  utflykter: Utflykt[],
  state: FilterState,
  origin: LatLng | null,
): Utflykt[] {
  return utflykter.filter((u) => {
    if (!matchesQuery([u.title, u.region, u.summary], state.query)) return false
    if (!passesSharedBase(u, state, origin)) return false
    if (state.months.length > 0 && !matchesSeason(u, state.months)) return false
    if (!matchesPublicTransport(u.publicTransport, state.publicTransport)) return false
    if (state.dogsAllowed && u.dogsAllowed !== true) return false
    return true
  })
}

// ─── Active count ────────────────────────────────────────────────────────────

export function countActiveUtflyktFilters(state: FilterState): number {
  let n = 0
  if (!state.nearMe && normalizeSelectedLandskap(state.landskap).length > 0) n++
  if (state.months.length > 0) n++
  if (state.publicTransport) n++
  if (state.nearMe) n++
  if (state.dogsAllowed) n++
  return n
}

// ─── Pills ───────────────────────────────────────────────────────────────────

export interface PillSpec {
  key: string
  label: string
  clear: () => Partial<FilterState>
}

export function buildUtflyktPills(): PillSpec[] {
  // Utflykter have no unique pills beyond shared ones (landskap, season, publicTransport, nearMe, dogsAllowed)
  return []
}

// ─── Reset patch ─────────────────────────────────────────────────────────────

export function createUtflyktResetPatch(): Partial<FilterState> {
  return {
    landskap: [],
    months: [],
    publicTransport: false,
    nearMe: false,
    nearMeRadiusKm: 25,
    dogsAllowed: false,
  }
}
