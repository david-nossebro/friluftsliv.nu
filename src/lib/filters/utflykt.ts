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
  formatDurationFilterLabel,
} from './shared'

// ─── Dimensions ──────────────────────────────────────────────────────────────

export const UTFLYKT_FILTER_DIMENSIONS = [
  'landskap',
  'season',
  'publicTransport',
  'nearMe',
  'dogsAllowed',
  'utflyktDuration',
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

function matchesUtflyktDuration(
  item: Utflykt,
  minHours: number,
  maxHours: number | null,
): boolean {
  // Graceful fallback: items without numeric duration pass through
  if (item.visitDurationMinHours == null || item.visitDurationMaxHours == null) return true

  // Filter range must overlap with item range
  // Item passes if its max >= filter min (item extends into filter range)
  if (item.visitDurationMaxHours < minHours) return false
  // And if filter has an upper bound, item's min must be <= filter max
  if (maxHours != null && item.visitDurationMinHours > maxHours) return false
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
    if (state.utflyktDurationMin > 0 || state.utflyktDurationMax != null) {
      if (!matchesUtflyktDuration(u, state.utflyktDurationMin, state.utflyktDurationMax)) return false
    }
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
  if (state.utflyktDurationMin > 0 || state.utflyktDurationMax != null) n++
  return n
}

// ─── Pills ───────────────────────────────────────────────────────────────────

export interface PillSpec {
  key: string
  label: string
  clear: () => Partial<FilterState>
}

export function buildUtflyktPills(state: FilterState): PillSpec[] {
  const pills: PillSpec[] = []

  if (state.utflyktDurationMin > 0 || state.utflyktDurationMax != null) {
    pills.push({
      key: 'udur',
      label: formatDurationFilterLabel(state.utflyktDurationMin, state.utflyktDurationMax),
      clear: () => ({ utflyktDurationMin: 0, utflyktDurationMax: null }),
    })
  }

  return pills
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
    utflyktDurationMin: 0,
    utflyktDurationMax: null,
  }
}
