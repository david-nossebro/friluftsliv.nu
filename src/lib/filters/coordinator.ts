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
  defaultFilterState,
  DEFAULT_DISTANCE_MIN,
  DEFAULT_DURATION_MIN,
} from './types'
import {
  normalizeSelectedLandskap,
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
} from './utflykt'
import {
  applyAreaFilters,
} from './area'
import { LANDSKAP_LABELS } from '../landskap'
import { expandSeasonKeys, formatMonth, formatSeasonKey, getSelectedSeasonKeys } from '../season'

// ─── URL serde ───────────────────────────────────────────────────────────────

const VALID_TABS: readonly ExploreTab[] = [
  'alla', 'utflykter', 'stugor', 'vandring', 'kanot',
  'skidturer', 'nationalparker', 'naturreservat',
]
const VALID_HIKE_TYPES: readonly HikeType[] = ['vandring', 'fjallvandring', 'langvandring']
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'] as const
const VALID_ROUTE_SHAPES = ['roundtrip', 'out-and-back', 'point-to-point'] as const
const VALID_SERVICE_TYPES: readonly (CabinServiceType | 'any')[] = ['any', 'obetjänad', 'betjänad', 'självhushåll']
const VALID_FACILITIES = [
  'vedspis', 'koksutrustning', 'restaurang', 'cafe', 'bastu', 'proviantforsaljning',
  'wifi', 'el', 'vatten', 'utedass', 'torrtoalett', 'dusch', 'guideservice', 'familjevanlig',
] as const

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

function parseEnum<T extends string>(raw: string | null, valid: readonly T[], fallback: T): T {
  return raw && (valid as readonly string[]).includes(raw) ? (raw as T) : fallback
}

function normalizeDurationHours(
  hours: number | null,
  direction: 'min' | 'max',
): number | null {
  if (hours == null) return null
  if (hours <= 0) return 0
  const DURATION_RANGE_HOURS = [
    0, 2, 4, 6, 8, 12, 24, 48, 72, 96, 120, 144, 168, 240, 336,
  ] as const
  if (direction === 'min') {
    const reversed = [...DURATION_RANGE_HOURS].reverse()
    return reversed.find((option) => option <= hours) ?? 0
  }
  return DURATION_RANGE_HOURS.find((option) => option >= hours) ?? 336
}

export function parseFilters(params: URLSearchParams | ReadonlyURLSearchParams): FilterState {
  const get = (key: string) => params.get(key)

  const distanceMin = parseNumber(get('dmin')) ?? DEFAULT_DISTANCE_MIN
  const distanceMax = parseNumber(get('dmax'))
  const durationMinRaw = parseNumber(get('tmin'))
  const durationMaxRaw = parseNumber(get('tmax'))
  const durationUnitRaw = get('du')
  const durationMinHours = normalizeDurationHours(durationMinRaw, 'min') ?? DEFAULT_DURATION_MIN
  const durationMaxHours =
    durationMaxRaw == null
      ? null
      : normalizeDurationHours(durationUnitRaw === 'd' ? durationMaxRaw * 24 : durationMaxRaw, 'max')

  return {
    query: get('q') ?? '',
    tab: parseEnum<ExploreTab>(get('tab'), VALID_TABS, 'alla'),
    difficulty: parseList(get('d'), VALID_DIFFICULTIES),
    routeShape: (() => {
      const raw = get('rs')
      return raw && (VALID_ROUTE_SHAPES as readonly string[]).includes(raw) ? (raw as import('@/types').RouteShape) : null
    })(),
    distanceMinKm: distanceMin,
    distanceMaxKm: distanceMax,
    durationMin: durationMinHours,
    durationMax: durationMaxHours != null && durationMaxHours < durationMinHours ? durationMinHours : durationMaxHours,
    landskap: normalizeSelectedLandskap(parseList(get('l'), [
      'skane', 'blekinge', 'halland', 'smaland', 'oland', 'gotland',
      'vastergotland', 'bohuslan', 'dalsland', 'ostergotland', 'sodermanland',
      'narke', 'vastmanland', 'uppland', 'varmland', 'dalarna', 'gastrikland',
      'halsingland', 'medelpad', 'angermanland', 'jamtland', 'harjedalen',
      'vasterbotten', 'norrbotten', 'lappland',
    ])),
    months: parseList(get('m'), [
      'januari', 'februari', 'mars', 'april', 'maj', 'juni',
      'juli', 'augusti', 'september', 'oktober', 'november', 'december',
    ]),
    publicTransport: parseBool(get('pt')),
    nearMe: parseBool(get('nm')),
    nearMeRadiusKm: parseNumber(get('nmr')) ?? 25,
    dogsAllowed: parseBool(get('dog')),
    tentingAllowed: parseBool(get('tent')),
    hasCabinsAlong: parseBool(get('cab')),
    cabinFacilities: parseList(get('fac'), VALID_FACILITIES),
    cabinServiceType: parseEnum(get('cst'), VALID_SERVICE_TYPES, 'any'),
    hikeType: parseList(get('ht'), VALID_HIKE_TYPES),
  }
}

interface ReadonlyURLSearchParams {
  get(name: string): string | null
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
  if (state.nearMeRadiusKm !== 25) params.set('nmr', String(state.nearMeRadiusKm))
  if (state.dogsAllowed) params.set('dog', '1')
  if (state.tentingAllowed) params.set('tent', '1')
  if (state.hasCabinsAlong) params.set('cab', '1')
  if (state.cabinFacilities.length > 0) params.set('fac', state.cabinFacilities.join(','))
  if (state.cabinServiceType !== 'any') params.set('cst', state.cabinServiceType)
  if (state.hikeType.length > 0) params.set('ht', state.hikeType.join(','))
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
        'tentingAllowed', 'hasCabinsAlong', 'cabinFacilities', 'cabinServiceType']
  }
}

// ─── Active count ────────────────────────────────────────────────────────────

/** Number of active filter dimensions beyond `query` and `tab`. */
export function countActiveFilters(state: FilterState): number {
  let n = 0
  if (state.difficulty.length > 0) n++
  if (state.hikeType.length > 0) n++
  if (state.routeShape) n++
  if (state.distanceMinKm !== DEFAULT_DISTANCE_MIN || state.distanceMaxKm != null) n++
  if (state.durationMin !== DEFAULT_DURATION_MIN || state.durationMax != null) n++
  // Landskap is only counted when Nära mig is off — Nära mig takes precedence.
  if (!state.nearMe && normalizeSelectedLandskap(state.landskap).length > 0) n++
  if (state.months.length > 0) n++
  if (state.publicTransport) n++
  if (state.nearMe) n++
  if (state.dogsAllowed) n++
  if (state.tentingAllowed) n++
  if (state.hasCabinsAlong) n++
  if (state.cabinFacilities.length > 0) n++
  if (state.cabinServiceType !== 'any') n++
  return n
}

export function isFilterStateActive(state: FilterState): boolean {
  return state.query.length > 0 || countActiveFilters(state) > 0
}

export function countActiveFiltersForDimensions(
  state: FilterState,
  dimensions: readonly FilterDimension[],
): number {
  let n = 0

  for (const dimension of dimensions) {
    switch (dimension) {
      case 'difficulty':
        if (state.difficulty.length > 0) n++
        break
      case 'routeShape':
        if (state.routeShape) n++
        break
      case 'distance':
        if (state.distanceMinKm !== DEFAULT_DISTANCE_MIN || state.distanceMaxKm != null) n++
        break
      case 'duration':
        if (state.durationMin !== DEFAULT_DURATION_MIN || state.durationMax != null) n++
        break
      case 'landskap':
        if (!state.nearMe && normalizeSelectedLandskap(state.landskap).length > 0) n++
        break
      case 'season':
        if (state.months.length > 0) n++
        break
      case 'publicTransport':
        if (state.publicTransport) n++
        break
      case 'nearMe':
        if (state.nearMe) n++
        break
      case 'dogsAllowed':
        if (state.dogsAllowed) n++
        break
      case 'tentingAllowed':
        if (state.tentingAllowed) n++
        break
      case 'hasCabinsAlong':
        if (state.hasCabinsAlong) n++
        break
      case 'cabinFacilities':
        if (state.cabinFacilities.length > 0) n++
        break
      case 'cabinServiceType':
        if (state.cabinServiceType !== 'any') n++
        break
      case 'hikeType':
        if (state.hikeType.length > 0) n++
        break
    }
  }

  return n
}

export function createFilterResetPatch(
  dimensions: readonly FilterDimension[],
): Partial<FilterState> {
  const patch: Partial<FilterState> = {}

  for (const dimension of dimensions) {
    switch (dimension) {
      case 'difficulty':
        patch.difficulty = defaultFilterState.difficulty
        break
      case 'routeShape':
        patch.routeShape = defaultFilterState.routeShape
        break
      case 'distance':
        patch.distanceMinKm = defaultFilterState.distanceMinKm
        patch.distanceMaxKm = defaultFilterState.distanceMaxKm
        break
      case 'duration':
        patch.durationMin = defaultFilterState.durationMin
        patch.durationMax = defaultFilterState.durationMax
        break
      case 'landskap':
        patch.landskap = defaultFilterState.landskap
        break
      case 'season':
        patch.months = defaultFilterState.months
        break
      case 'publicTransport':
        patch.publicTransport = defaultFilterState.publicTransport
        break
      case 'nearMe':
        patch.nearMe = defaultFilterState.nearMe
        patch.nearMeRadiusKm = defaultFilterState.nearMeRadiusKm
        break
      case 'dogsAllowed':
        patch.dogsAllowed = defaultFilterState.dogsAllowed
        break
      case 'tentingAllowed':
        patch.tentingAllowed = defaultFilterState.tentingAllowed
        break
      case 'hasCabinsAlong':
        patch.hasCabinsAlong = defaultFilterState.hasCabinsAlong
        break
      case 'cabinFacilities':
        patch.cabinFacilities = defaultFilterState.cabinFacilities
        break
      case 'cabinServiceType':
        patch.cabinServiceType = defaultFilterState.cabinServiceType
        break
      case 'hikeType':
        patch.hikeType = defaultFilterState.hikeType
        break
    }
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

export interface PillSpec {
  key: string
  label: string
  clear: () => Partial<FilterState>
}

export function buildPills(state: FilterState): PillSpec[] {
  const pills: PillSpec[] = []
  const normalizedLandskap = normalizeSelectedLandskap(state.landskap)

  // Shared pills
  for (const l of normalizedLandskap) {
    pills.push({
      key: `l-${l}`,
      label: LANDSKAP_LABELS[l],
      clear: () => ({ landskap: normalizedLandskap.filter((item) => item !== l) }),
    })
  }
  const selectedSeasons = getSelectedSeasonKeys(state.months)
  const seasonMonths = new Set(expandSeasonKeys(selectedSeasons))
  for (const season of selectedSeasons) {
    pills.push({
      key: `season-${season}`,
      label: formatSeasonKey(season),
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
      clear: () => ({ months: state.months.filter((x) => x !== m) }),
    })
  }
  if (state.publicTransport) {
    pills.push({ key: 'pt', label: 'Med kollektivtrafik', clear: () => ({ publicTransport: false }) })
  }
  if (state.nearMe) {
    pills.push({
      key: 'nm',
      label: `Nära mig (${state.nearMeRadiusKm} km)`,
      clear: () => ({ nearMe: false }),
    })
  }
  if (state.dogsAllowed) {
    pills.push({ key: 'dog', label: 'Hund välkommen', clear: () => ({ dogsAllowed: false }) })
  }

  // Route-specific pills
  pills.push(...buildRoutePills(state))

  // Cabin-specific pills
  pills.push(...buildCabinPills(state))

  return pills
}
