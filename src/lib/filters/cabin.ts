import type { FilterState } from './types'
import type { Cabin, CabinDetail } from '@/types'
import type { LatLng } from '../geo'
import {
  matchesQuery,
  matchesLandskap,
  matchesPublicTransport,
  matchesNearMe,
  normalizeSelectedLandskap,
} from './shared'

// ─── Dimensions ──────────────────────────────────────────────────────────────

export const CABIN_FILTER_DIMENSIONS = [
  'landskap',
  'publicTransport',
  'nearMe',
  'dogsAllowed',
  'cabinFacilities',
  'cabinServiceType',
] as const

export type CabinFilterDimension = (typeof CABIN_FILTER_DIMENSIONS)[number]

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

export function applyCabinFilters(
  cabins: Cabin[],
  state: FilterState,
  origin: LatLng | null,
): Cabin[] {
  return cabins.filter((cabin) => {
    if (!matchesQuery([cabin.title, cabin.region], state.query)) return false
    if (!passesSharedBase(cabin, state, origin)) return false
    if (!matchesPublicTransport(cabin.publicTransport, state.publicTransport)) return false
    if (state.dogsAllowed && cabin.dogsAllowed !== true) return false
    if (state.cabinFacilities.length > 0) {
      const tags = cabin.facilityTags ?? []
      if (!state.cabinFacilities.every((f) => tags.includes(f))) return false
    }
    if (state.cabinServiceType !== 'any') {
      const serviceType = (cabin as CabinDetail).serviceType
      if (!serviceType || serviceType !== state.cabinServiceType) return false
    }
    return true
  })
}

// ─── Active count ────────────────────────────────────────────────────────────

export function countActiveCabinFilters(state: FilterState): number {
  let n = 0
  if (!state.nearMe && normalizeSelectedLandskap(state.landskap).length > 0) n++
  if (state.publicTransport) n++
  if (state.nearMe) n++
  if (state.dogsAllowed) n++
  if (state.cabinFacilities.length > 0) n++
  if (state.cabinServiceType !== 'any') n++
  return n
}

// ─── Pills ───────────────────────────────────────────────────────────────────

export interface PillSpec {
  key: string
  label: string
  clear: () => Partial<FilterState>
}

export function buildCabinPills(state: FilterState): PillSpec[] {
  const pills: PillSpec[] = []

  for (const f of state.cabinFacilities) {
    pills.push({
      key: `fac-${f}`,
      label: f.charAt(0).toUpperCase() + f.slice(1),
      clear: () => ({ cabinFacilities: state.cabinFacilities.filter((x) => x !== f) }),
    })
  }
  if (state.cabinServiceType !== 'any') {
    pills.push({
      key: 'cst',
      label: state.cabinServiceType.charAt(0).toUpperCase() + state.cabinServiceType.slice(1),
      clear: () => ({ cabinServiceType: 'any' }),
    })
  }

  return pills
}

// ─── Reset patch ─────────────────────────────────────────────────────────────

export function createCabinResetPatch(): Partial<FilterState> {
  return {
    landskap: [],
    publicTransport: false,
    nearMe: false,
    nearMeRadiusKm: 25,
    dogsAllowed: false,
    cabinFacilities: [],
    cabinServiceType: 'any',
  }
}
