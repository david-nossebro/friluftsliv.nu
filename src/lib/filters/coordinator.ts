import type {
  AreaListItem,
  Cabin,
  CabinServiceType,
  ExploreTab,
  HikeType,
  LongHike,
  Route,
  Utflykt,
} from '@/types'
import type { LatLng } from '../geo'
import {
  type FilterState,
  type FilterDimension,
  type PillSpec,
  DEFAULT_DISTANCE_MIN,
  DEFAULT_DURATION_MIN,
  DEFAULT_NEAR_ME_RADIUS_KM,
} from './types'
import {
  normalizeSelectedLandskap,
  normalizeDurationHours,
  VALID_DIFFICULTIES,
  VALID_ROUTE_SHAPES,
  VALID_FACILITIES,
} from './shared'
import {
  applyRouteFilters,
  applyLongHikeFilters,
  buildRoutePills,
} from './route'
import {
  applyCabinFilters,
  buildCabinPills,
} from './cabin'
import {
  applyUtflyktFilters,
  buildUtflyktPills,
} from './utflykt'
import {
  applyAreaFilters,
} from './area'
import { ALL_LANDSKAP, LANDSKAP_LABELS } from '../landskap'
import { ALL_MONTHS, expandSeasonKeys, formatMonth, formatSeasonKey, getSelectedSeasonKeys } from '../season'

// ─── URL serde ───────────────────────────────────────────────────────────────

const VALID_TABS: readonly ExploreTab[] = [
  'alla', 'utflykter', 'stugor', 'vandring', 'kanot',
  'skidturer', 'nationalparker', 'naturreservat',
]
const VALID_HIKE_TYPES: readonly HikeType[] = ['vandring', 'fjallvandring', 'langvandring']
const VALID_SERVICE_TYPES: readonly (CabinServiceType | 'any')[] = ['any', 'obetjänad', 'betjänad', 'självhushåll']
function parseList<T extends string>(raw: string | null, valid: readonly T[]): T[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((v) => v.trim())
    .filter((v): v is T => (valid as readonly string[]).includes(v))
}

function parseNumber(raw: string | null): number | null {
  if (raw == null || raw === '') return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

function parseBool(raw: string | null): boolean {
  return raw === '1' || raw === 'true'
}

function parseEnum<T extends string>(raw: string | null, valid: readonly T[], fallback: T | null): T | null {
  return raw && (valid as readonly string[]).includes(raw) ? (raw as T) : fallback
}

export function parseFilters(params: URLSearchParams | Pick<URLSearchParams, 'get'>): FilterState {
  const get = (key: string) => params.get(key)

  const distanceMin = parseNumber(get('dmin')) ?? DEFAULT_DISTANCE_MIN
  const distanceMax = parseNumber(get('dmax'))
  const durationMinRaw = parseNumber(get('tmin'))
  const durationMaxRaw = parseNumber(get('tmax'))
  const durationMinHours = normalizeDurationHours(durationMinRaw, 'min') ?? DEFAULT_DURATION_MIN
  const durationMaxHours =
    durationMaxRaw == null
      ? null
      : normalizeDurationHours(durationMaxRaw, 'max')

  return {
    query: get('q') ?? '',
    tab: parseEnum<ExploreTab>(get('tab'), VALID_TABS, 'alla') ?? 'alla',
    difficulty: parseList(get('d'), VALID_DIFFICULTIES),
    routeShape: parseEnum(get('rs'), VALID_ROUTE_SHAPES, null),
    distanceMinKm: distanceMin,
    distanceMaxKm: distanceMax,
    durationMin: durationMinHours,
    durationMax: durationMaxHours != null && durationMaxHours < durationMinHours ? durationMinHours : durationMaxHours,
    landskap: normalizeSelectedLandskap(parseList(get('l'), ALL_LANDSKAP)),
    months: parseList(get('m'), ALL_MONTHS),
    publicTransport: parseBool(get('pt')),
    nearMe: parseBool(get('nm')),
    nearMeRadiusKm: parseNumber(get('nmr')) ?? DEFAULT_NEAR_ME_RADIUS_KM,
    dogsAllowed: parseBool(get('dog')),
    tentingAllowed: parseBool(get('tent')),
    hasCabinsAlong: parseBool(get('cab')),
    cabinFacilities: parseList(get('fac'), VALID_FACILITIES),
    cabinServiceType: parseEnum(get('cst'), VALID_SERVICE_TYPES, 'any') ?? 'any',
    hikeType: parseList(get('ht'), VALID_HIKE_TYPES),
    utflyktDurationMin: parseNumber(get('umin')) ?? 0,
    utflyktDurationMax: parseNumber(get('umax')),
  }
}

/** Serialize state to URLSearchParams, omitting defaults to keep URLs compact. */
export function serializeFilters(state: FilterState): URLSearchParams {
  const params = new URLSearchParams()
  const normalizedLandskap = normalizeSelectedLandskap(state.landskap)
  if (state.query) params.set('q', state.query)
  if (state.tab !== 'alla') params.set('tab', state.tab)
  if (state.difficulty.length > 0) params.set('d', state.difficulty.join(','))
  if (state.routeShape) params.set('rs', state.routeShape)
  if (state.distanceMinKm !== DEFAULT_DISTANCE_MIN) params.set('dmin', String(state.distanceMinKm))
  if (state.distanceMaxKm != null) params.set('dmax', String(state.distanceMaxKm))
  if (state.durationMin !== DEFAULT_DURATION_MIN) params.set('tmin', String(state.durationMin))
  if (state.durationMax != null) params.set('tmax', String(state.durationMax))
  if (normalizedLandskap.length > 0) params.set('l', normalizedLandskap.join(','))
  if (state.months.length > 0) params.set('m', state.months.join(','))
  if (state.publicTransport) params.set('pt', '1')
  if (state.nearMe) params.set('nm', '1')
  if (state.nearMeRadiusKm !== DEFAULT_NEAR_ME_RADIUS_KM) params.set('nmr', String(state.nearMeRadiusKm))
  if (state.dogsAllowed) params.set('dog', '1')
  if (state.tentingAllowed) params.set('tent', '1')
  if (state.hasCabinsAlong) params.set('cab', '1')
  if (state.cabinFacilities.length > 0) params.set('fac', state.cabinFacilities.join(','))
  if (state.cabinServiceType !== 'any') params.set('cst', state.cabinServiceType)
  if (state.hikeType.length > 0) params.set('ht', state.hikeType.join(','))
  if (state.utflyktDurationMin > 0) params.set('umin', String(state.utflyktDurationMin))
  if (state.utflyktDurationMax != null) params.set('umax', String(state.utflyktDurationMax))
  return params
}

// ─── Tab-aware filter visibility ─────────────────────────────────────────────

const ROUTE_FILTERS: FilterDimension[] = [
  'difficulty', 'hikeType', 'routeShape', 'distance', 'duration', 'season',
  'landskap', 'publicTransport', 'nearMe', 'dogsAllowed',
  'tentingAllowed', 'hasCabinsAlong',
]
const CABIN_FILTERS: FilterDimension[] = [
  'landskap', 'publicTransport', 'nearMe', 'dogsAllowed',
  'cabinFacilities', 'cabinServiceType',
]
const SHARED_FILTERS: FilterDimension[] = [
  'landskap', 'season', 'publicTransport', 'nearMe', 'dogsAllowed',
]
const AREA_FILTERS: FilterDimension[] = ['landskap', 'nearMe']
const UTFLYKT_FILTERS: FilterDimension[] = [
  'landskap', 'season', 'publicTransport', 'nearMe', 'dogsAllowed',
  'utflyktDuration',
]

export function getApplicableFilters(tab: ExploreTab): FilterDimension[] {
  switch (tab) {
    case 'stugor': return CABIN_FILTERS
    case 'vandring': return ROUTE_FILTERS
    case 'kanot':
    case 'skidturer':
      return ROUTE_FILTERS.filter((f) => f !== 'hasCabinsAlong')
    case 'nationalparker':
    case 'naturreservat':
      return AREA_FILTERS
    case 'utflykter': return UTFLYKT_FILTERS
    case 'alla':
    default:
      return [...SHARED_FILTERS, 'difficulty', 'hikeType', 'routeShape', 'distance', 'duration',
        'tentingAllowed', 'hasCabinsAlong', 'cabinFacilities', 'cabinServiceType',
        'utflyktDuration']
  }
}

// ─── Active count ────────────────────────────────────────────────────────────

const ACTIVE_PREDICATES: Record<FilterDimension, (state: FilterState) => boolean> = {
  difficulty: (s) => s.difficulty.length > 0,
  routeShape: (s) => !!s.routeShape,
  distance: (s) => s.distanceMinKm !== DEFAULT_DISTANCE_MIN || s.distanceMaxKm != null,
  duration: (s) => s.durationMin !== DEFAULT_DURATION_MIN || s.durationMax != null,
  season: (s) => s.months.length > 0,
  landskap: (s) => !s.nearMe && normalizeSelectedLandskap(s.landskap).length > 0,
  publicTransport: (s) => s.publicTransport,
  nearMe: (s) => s.nearMe,
  dogsAllowed: (s) => s.dogsAllowed,
  tentingAllowed: (s) => s.tentingAllowed,
  hasCabinsAlong: (s) => s.hasCabinsAlong,
  cabinFacilities: (s) => s.cabinFacilities.length > 0,
  cabinServiceType: (s) => s.cabinServiceType !== 'any',
  hikeType: (s) => s.hikeType.length > 0,
  utflyktDuration: (s) => s.utflyktDurationMin > 0 || s.utflyktDurationMax != null,
}

/** Number of active filter dimensions beyond `query` and `tab`. */
export function countActiveFilters(state: FilterState): number {
  return countActiveFiltersForDimensions(state, ALL_FILTER_DIMENSIONS)
}

export function isFilterStateActive(state: FilterState): boolean {
  return state.query.length > 0 || countActiveFilters(state) > 0
}

export function countActiveFiltersForDimensions(
  state: FilterState,
  dimensions: readonly FilterDimension[],
): number {
  return dimensions.filter((d) => ACTIVE_PREDICATES[d](state)).length
}

// ─── Reset patch ─────────────────────────────────────────────────────────────

const RESET_BY_DIMENSION: Record<FilterDimension, Partial<FilterState>> = {
  difficulty: { difficulty: [] },
  routeShape: { routeShape: null },
  distance: { distanceMinKm: DEFAULT_DISTANCE_MIN, distanceMaxKm: null },
  duration: { durationMin: DEFAULT_DURATION_MIN, durationMax: null },
  landskap: { landskap: [] },
  season: { months: [] },
  publicTransport: { publicTransport: false },
  nearMe: { nearMe: false, nearMeRadiusKm: DEFAULT_NEAR_ME_RADIUS_KM },
  dogsAllowed: { dogsAllowed: false },
  tentingAllowed: { tentingAllowed: false },
  hasCabinsAlong: { hasCabinsAlong: false },
  cabinFacilities: { cabinFacilities: [] },
  cabinServiceType: { cabinServiceType: 'any' },
  hikeType: { hikeType: [] },
  utflyktDuration: { utflyktDurationMin: 0, utflyktDurationMax: null },
}

const ALL_FILTER_DIMENSIONS: FilterDimension[] = Object.keys(ACTIVE_PREDICATES) as FilterDimension[]

export function createFilterResetPatch(
  dimensions: readonly FilterDimension[],
): Partial<FilterState> {
  const patch: Partial<FilterState> = {}
  for (const dimension of dimensions) {
    Object.assign(patch, RESET_BY_DIMENSION[dimension])
  }
  return patch
}

// ─── Apply ───────────────────────────────────────────────────────────────────

export interface ApplyFiltersInput {
  state: FilterState
  origin?: LatLng | null
  areas: AreaListItem[]
  utflykter: Utflykt[]
  routes: Route[]
  longHikes: LongHike[]
  cabins: Cabin[]
}

export interface ApplyFiltersOutput {
  areas: AreaListItem[]
  utflykter: Utflykt[]
  routes: Route[]
  longHikes: LongHike[]
  cabins: Cabin[]
  count: number
}

export function applyFilters({
  state,
  origin = null,
  areas,
  utflykter,
  routes,
  longHikes,
  cabins,
}: ApplyFiltersInput): ApplyFiltersOutput {
  const filteredRoutes = applyRouteFilters(routes, state, origin)
  const filteredLongHikes = applyLongHikeFilters(longHikes, state, origin)
  const filteredCabins = applyCabinFilters(cabins, state, origin)
  const filteredUtflykter = applyUtflyktFilters(utflykter, state, origin)
  const filteredAreas = applyAreaFilters(areas, state, origin)

  const count =
    filteredAreas.length + filteredUtflykter.length + filteredRoutes.length +
    filteredLongHikes.length + filteredCabins.length

  return {
    areas: filteredAreas,
    utflykter: filteredUtflykter,
    routes: filteredRoutes,
    longHikes: filteredLongHikes,
    cabins: filteredCabins,
    count,
  }
}

// ─── Route category splitting ─────────────────────────────────────────────────

export type RouteSplit = {
  hiking: Route[]
  mountain: Route[]
  canoe: Route[]
  ski: Route[]
}

export function splitRoutesByCategory(routes: Route[]): RouteSplit {
  return {
    hiking: routes.filter((r) => r.exploreCategory === 'vandring'),
    mountain: routes.filter((r) => r.exploreCategory === 'fjallvandring'),
    canoe: routes.filter((r) => r.exploreCategory === 'kanot'),
    ski: routes.filter((r) => r.exploreCategory === 'skidturer'),
  }
}

// ─── Pills ───────────────────────────────────────────────────────────────────

export function buildPills(
  state: FilterState,
  dimensions?: readonly FilterDimension[],
): PillSpec[] {
  const pills: PillSpec[] = []
  const normalizedLandskap = normalizeSelectedLandskap(state.landskap)
  const wants = (dim: FilterDimension) => !dimensions || dimensions.includes(dim)

  // Shared pills
  if (wants('landskap')) {
    for (const l of normalizedLandskap) {
      pills.push({
        key: `l-${l}`,
        label: LANDSKAP_LABELS[l],
        dimension: 'landskap',
        clear: () => ({ landskap: normalizedLandskap.filter((item) => item !== l) }),
      })
    }
  }
  if (wants('season')) {
    const selectedSeasons = getSelectedSeasonKeys(state.months)
    const seasonMonths = new Set(expandSeasonKeys(selectedSeasons))
    for (const season of selectedSeasons) {
      pills.push({
        key: `season-${season}`,
        label: formatSeasonKey(season),
        dimension: 'season',
        clear: () => {
          const monthsToRemove = new Set(expandSeasonKeys([season]))
          return { months: state.months.filter((month) => !monthsToRemove.has(month)) }
        },
      })
    }
    for (const m of state.months) {
      if (seasonMonths.has(m)) continue
      pills.push({
        key: `m-${m}`,
        label: formatMonth(m),
        dimension: 'season',
        clear: () => ({ months: state.months.filter((x) => x !== m) }),
      })
    }
  }
  if (wants('publicTransport') && state.publicTransport) {
    pills.push({ key: 'pt', label: 'Med kollektivtrafik', dimension: 'publicTransport', clear: () => ({ publicTransport: false }) })
  }
  if (wants('nearMe') && state.nearMe) {
    pills.push({
      key: 'nm',
      label: `Nära mig (${state.nearMeRadiusKm} km)`,
      dimension: 'nearMe',
      clear: () => ({ nearMe: false }),
    })
  }
  if (wants('dogsAllowed') && state.dogsAllowed) {
    pills.push({ key: 'dog', label: 'Hund välkommen', dimension: 'dogsAllowed', clear: () => ({ dogsAllowed: false }) })
  }

  // Route-specific pills
  if (wants('difficulty') || wants('routeShape') || wants('distance') || wants('duration') || wants('tentingAllowed') || wants('hasCabinsAlong') || wants('hikeType')) {
    pills.push(...buildRoutePills(state, dimensions))
  }

  // Cabin-specific pills
  if (wants('cabinFacilities') || wants('cabinServiceType')) {
    pills.push(...buildCabinPills(state, dimensions))
  }

  // Utflykt-specific pills
  pills.push(...buildUtflyktPills(state, dimensions))

  return pills
}
