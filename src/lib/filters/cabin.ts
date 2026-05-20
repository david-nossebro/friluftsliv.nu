import type { FilterState, PillSpec } from './types'
import type { Cabin } from '@/types'
import type { LatLng } from '../geo'
import {
  matchesQuery,
  matchesPublicTransport,
  passesSharedBase,
} from './shared'

// ─── Dimensions ──────────────────────────────────────────────────────────────

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
      const serviceType = cabin.serviceType
      if (!serviceType || serviceType !== state.cabinServiceType) return false
    }
    return true
  })
}

// ─── Pills ───────────────────────────────────────────────────────────────────

export function buildCabinPills(state: FilterState): PillSpec[] {
  const pills: PillSpec[] = []

  for (const f of state.cabinFacilities) {
    pills.push({
      key: `fac-${f}`,
      label: f.charAt(0).toUpperCase() + f.slice(1),
      dimension: 'cabinFacilities',
      clear: () => ({ cabinFacilities: state.cabinFacilities.filter((x) => x !== f) }),
    })
  }
  if (state.cabinServiceType !== 'any') {
    pills.push({
      key: 'cst',
      label: state.cabinServiceType.charAt(0).toUpperCase() + state.cabinServiceType.slice(1),
      dimension: 'cabinServiceType',
      clear: () => ({ cabinServiceType: 'any' }),
    })
  }

  return pills
}
