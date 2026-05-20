import type { FilterState, PillSpec, FilterDimension } from './types'
import type { Utflykt } from '@/types'
import type { LatLng } from '../geo'
import {
  matchesQuery,
  matchesPublicTransport,
  matchesSeason,
  passesSharedBase,
  formatDurationFilterLabel,
} from './shared'

// ─── Apply ───────────────────────────────────────────────────────────────────

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

// ─── Pills ───────────────────────────────────────────────────────────────────

export function buildUtflyktPills(
  state: FilterState,
  dimensions?: readonly FilterDimension[],
): PillSpec[] {
  const pills: PillSpec[] = []
  const wants = (dim: FilterDimension) => !dimensions || dimensions.includes(dim)

  if (wants('utflyktDuration') && (state.utflyktDurationMin > 0 || state.utflyktDurationMax != null)) {
    pills.push({
      key: 'udur',
      label: formatDurationFilterLabel(state.utflyktDurationMin, state.utflyktDurationMax),
      dimension: 'utflyktDuration',
      clear: () => ({ utflyktDurationMin: 0, utflyktDurationMax: null }),
    })
  }

  return pills
}
