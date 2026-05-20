// Backward-compatibility barrel — all filter logic has moved into
// `src/lib/filters/*.ts`. Import from `@/lib/filters/*` for new code.

export type { FilterState, FilterDimension } from './filters/types'
export { defaultFilterState } from './filters/types'

export {
  DEFAULT_DISTANCE_MIN,
  DEFAULT_DURATION_MIN,
  DEFAULT_NEAR_ME_RADIUS_KM,
  DURATION_RANGE_HOURS,
  normalizeSelectedLandskap,
  normalizeDurationHours,
  formatDurationHours,
  formatDurationFilterLabel,
  ALL_MONTHS,
  currentMonth,
  ALL_LANDSKAP,
  ALL_LANDSKAP_ALPHABETICAL,
  LANDSKAP_BY_LANDSDEL,
  LANDSDEL_LABELS,
  LANDSKAP_LABELS,
} from './filters/shared'

export {
  parseFilters,
  serializeFilters,
  countActiveFilters,
  isFilterStateActive,
  countActiveFiltersForDimensions,
  createFilterResetPatch,
  getApplicableFilters,
  applyFilters,
  splitRoutesByCategory,
  buildPills,
} from './filters/coordinator'

export type {
  ApplyFiltersInput,
  ApplyFiltersOutput,
  RouteSplit,
  PillSpec,
} from './filters/coordinator'
