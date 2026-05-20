import type { FilterState } from './types'
import type { AreaListItem } from '@/types'
import type { LatLng } from '../geo'
import {
  matchesQuery,
  passesSharedBase,
} from './shared'

// ─── Dimensions ──────────────────────────────────────────────────────────────

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


