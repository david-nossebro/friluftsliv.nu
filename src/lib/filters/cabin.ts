import type { FilterState, PillSpec, FilterDimension } from './types'
import type { Cabin } from '@/types'
import type { LatLng } from '../geo'
import {
  matchesQuery,
  matchesPublicTransport,
  passesSharedBase,
} from './shared'
import { FACILITY_LABELS } from '../facility'
import { CABIN_SERVICE_LABELS } from '../cabinService'

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

export function buildCabinPills(
  state: FilterState,
  dimensions?: readonly FilterDimension[],
): PillSpec[] {
  const pills: PillSpec[] = []
  const wants = (dim: FilterDimension) => !dimensions || dimensions.includes(dim)

  if (wants('cabinFacilities')) {
    for (const f of state.cabinFacilities) {
      pills.push({
        key: `fac-${f}`,
        label: FACILITY_LABELS[f],
        dimension: 'cabinFacilities',
        clear: () => ({ cabinFacilities: state.cabinFacilities.filter((x) => x !== f) }),
      })
    }
  }
  if (wants('cabinServiceType') && state.cabinServiceType !== 'any') {
    pills.push({
      key: 'cst',
      label: CABIN_SERVICE_LABELS[state.cabinServiceType],
      dimension: 'cabinServiceType',
      clear: () => ({ cabinServiceType: 'any' }),
    })
  }

  return pills
}
