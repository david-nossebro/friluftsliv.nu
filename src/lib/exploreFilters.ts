import type {
  AreaListItem,
  Cabin,
  CabinDetail,
  CabinServiceType,
  Difficulty,
  ExploreTab,
  Facility,
  Landskap,
  LongHike,
  Month,
  PublicTransportMode,
  Route,
  RouteShape,
  Utflykt,
} from '@/types'
import { ALL_MONTHS, seasonCoversAnyMonth } from './season'
import { ALL_LANDSKAP } from './landskap'
import { haversineKm, type LatLng } from './geo'

// ─── State shape ─────────────────────────────────────────────────────────────

export interface FilterState {
  query: string
  tab: ExploreTab
  difficulty: Difficulty[]
  routeShape: RouteShape | null
  distanceMinKm: number
  /** null = no upper bound (300+) */
  distanceMaxKm: number | null
  /** Stored in hours so the UI can mix hours + days on one scale. */
  durationMin: number
  /** null = no upper bound. Stored in hours so the UI can mix hours + days on one scale. */
  durationMax: number | null
  /** Empty array = `Alla` / all landskap. */
  landskap: Landskap[]
  months: Month[]
  /** Binary: true requires kollektivtrafik (reachable or partial). */
  publicTransport: boolean
  nearMe: boolean
  nearMeRadiusKm: number
  dogsAllowed: boolean
  tentingAllowed: boolean
  hasCabinsAlong: boolean
  cabinFacilities: Facility[]
  cabinServiceType: CabinServiceType | 'any'
}

export const DEFAULT_DISTANCE_MIN = 0
export const DEFAULT_DURATION_MIN = 0
export const DEFAULT_NEAR_ME_RADIUS_KM = 25
export const DURATION_RANGE_HOURS = [
  0, 2, 4, 6, 8, 12, 24, 48, 72, 96, 120, 144, 168, 240, 336,
] as const

export const defaultFilterState: FilterState = {
  query: '',
  tab: 'alla',
  difficulty: [],
  routeShape: null,
  distanceMinKm: DEFAULT_DISTANCE_MIN,
  distanceMaxKm: null,
  durationMin: DEFAULT_DURATION_MIN,
  durationMax: null,
  landskap: [],
  months: [],
  publicTransport: false,
  nearMe: false,
  nearMeRadiusKm: DEFAULT_NEAR_ME_RADIUS_KM,
  dogsAllowed: false,
  tentingAllowed: false,
  hasCabinsAlong: false,
  cabinFacilities: [],
  cabinServiceType: 'any',
}

// ─── URL serde ───────────────────────────────────────────────────────────────

const VALID_TABS: readonly ExploreTab[] = [
  'alla', 'utflykter', 'stugor', 'vandring', 'kanot',
  'skidturer', 'nationalparker', 'naturreservat',
]
const VALID_DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard']
const VALID_ROUTE_SHAPES: readonly RouteShape[] = ['roundtrip', 'out-and-back', 'point-to-point']
const VALID_SERVICE_TYPES: readonly (CabinServiceType | 'any')[] = ['any', 'obetjänad', 'betjänad', 'självhushåll']
const VALID_FACILITIES: readonly Facility[] = [
  'vedspis', 'koksutrustning', 'restaurang', 'cafe', 'bastu', 'proviantforsaljning',
  'wifi', 'el', 'vatten', 'utedass', 'torrtoalett', 'dusch', 'guideservice', 'familjevanlig',
]
function parseList<T extends string>(raw: string | null, valid: readonly T[]): T[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((v) => v.trim())
    .filter((v): v is T => (valid as readonly string[]).includes(v))
}

export function normalizeSelectedLandskap(landskap: readonly Landskap[]): Landskap[] {
  const normalized = Array.from(new Set(landskap)).filter((value): value is Landskap =>
    (ALL_LANDSKAP as readonly string[]).includes(value),
  )

  return normalized.length === 0 || normalized.length === ALL_LANDSKAP.length ? [] : normalized
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
      return raw && (VALID_ROUTE_SHAPES as readonly string[]).includes(raw) ? (raw as RouteShape) : null
    })(),
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
    cabinServiceType: parseEnum(get('cst'), VALID_SERVICE_TYPES, 'any'),
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
  if (state.nearMeRadiusKm !== DEFAULT_NEAR_ME_RADIUS_KM) params.set('nmr', String(state.nearMeRadiusKm))
  if (state.dogsAllowed) params.set('dog', '1')
  if (state.tentingAllowed) params.set('tent', '1')
  if (state.hasCabinsAlong) params.set('cab', '1')
  if (state.cabinFacilities.length > 0) params.set('fac', state.cabinFacilities.join(','))
  if (state.cabinServiceType !== 'any') params.set('cst', state.cabinServiceType)
  return params
}

// ─── Active count + presets ──────────────────────────────────────────────────

/** Number of active filter dimensions beyond `query` and `tab`. */
export function countActiveFilters(state: FilterState): number {
  let n = 0
  if (state.difficulty.length > 0) n++
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

// ─── Tab-aware filter visibility ─────────────────────────────────────────────

export type FilterDimension =
  | 'difficulty' | 'routeShape' | 'distance' | 'duration' | 'season'
  | 'landskap' | 'publicTransport' | 'nearMe' | 'dogsAllowed'
  | 'tentingAllowed' | 'hasCabinsAlong'
  | 'cabinFacilities' | 'cabinServiceType'

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
        // Landskap is suppressed by Nära mig — see passesShared().
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
    }
  }

  return patch
}

const ROUTE_FILTERS: FilterDimension[] = [
  'difficulty', 'routeShape', 'distance', 'duration', 'season',
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
      return [...SHARED_FILTERS, 'difficulty', 'routeShape', 'distance', 'duration',
        'tentingAllowed', 'hasCabinsAlong', 'cabinFacilities', 'cabinServiceType']
  }
}

// ─── Matchers ────────────────────────────────────────────────────────────────

function matchesQuery(text: string[], q: string): boolean {
  if (!q) return true
  const lower = q.toLowerCase()
  return text.some((value) => value.toLowerCase().includes(lower))
}

function matchesLandskap(
  itemLandskap: Landskap[] | undefined,
  selected: Landskap[],
): boolean {
  const normalizedSelected = normalizeSelectedLandskap(selected)
  if (normalizedSelected.length === 0) return true
  if (!itemLandskap || itemLandskap.length === 0) return false
  return itemLandskap.some((l) => normalizedSelected.includes(l))
}

function matchesDistance(
  distance: number | undefined,
  min: number,
  max: number | null,
): boolean {
  if (distance == null) return true
  if (distance < min) return false
  if (max != null && distance > max) return false
  return true
}

function matchesDurationMinutes(
  durationMinutes: number | undefined,
  state: FilterState,
): boolean {
  if (durationMinutes == null) return true
  const durationHours = durationMinutes / 60
  if (durationHours < state.durationMin) return false
  if (state.durationMax != null && durationHours > state.durationMax) return false
  return true
}

function matchesDurationDays(
  estimatedDays: number | undefined,
  state: FilterState,
): boolean {
  if (estimatedDays == null) return true
  const durationHours = estimatedDays * 24
  if (durationHours < state.durationMin) return false
  if (state.durationMax != null && durationHours > state.durationMax) return false
  return true
}

function matchesPublicTransport(
  pt: { mode: PublicTransportMode } | undefined,
  required: boolean,
): boolean {
  if (!required) return true
  if (!pt) return false
  // "Med kollektivtrafik" accepts both reachable AND partial data — the user's
  // intent is "I can use transit"; the precise grade is shown on the detail page.
  return pt.mode === 'reachable' || pt.mode === 'partial'
}

function matchesNearMe(
  coords: LatLng | undefined,
  origin: LatLng | null,
  radiusKm: number,
): boolean {
  if (!origin) return true
  if (!coords) return false
  return haversineKm(origin, coords) <= radiusKm
}

// ─── apply() per entity type ─────────────────────────────────────────────────

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

interface Locatable {
  landskap?: Landskap[]
  coordinates?: LatLng
}

function passesShared(
  item: Locatable,
  state: FilterState,
  origin: LatLng | null,
): boolean {
  if (state.nearMe) {
    // Nära mig takes precedence over landskap. We keep the user's landskap
    // selection in state so it returns when they switch Nära mig off.
    return matchesNearMe(item.coordinates, origin, state.nearMeRadiusKm)
  }
  if (!matchesLandskap(item.landskap, state.landskap)) return false
  return true
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

export function applyFilters({
  state,
  origin = null,
  areas,
  utflykter,
  routes,
  longHikes,
  cabins,
}: ApplyFiltersInput): ApplyFiltersOutput {
  const filteredRoutes = routes.filter((route) => {
    if (!matchesQuery([route.title, route.region], state.query)) return false
    if (!passesShared(route as Locatable, state, origin)) return false
    if (state.difficulty.length > 0 && !state.difficulty.includes(route.difficulty)) return false
    if (state.routeShape && route.routeShape && route.routeShape !== state.routeShape) return false
    if (state.routeShape && !route.routeShape) return false
    if (!matchesDistance(route.distance, state.distanceMinKm, state.distanceMaxKm)) return false
    if (!matchesDurationMinutes(route.duration, state)) return false
    if (state.months.length > 0 && !seasonCoversAnyMonth(asSeason(route), state.months)) return false
    if (!matchesPublicTransport(route.publicTransport, state.publicTransport)) return false
    if (state.dogsAllowed && route.dogsAllowed !== true) return false
    if (state.tentingAllowed && route.tentingAllowed !== true) return false
    if (state.hasCabinsAlong && (!route.cabinIds || route.cabinIds.length === 0)) return false
    return true
  })

  const filteredLongHikes = longHikes.filter((lh) => {
    if (!matchesQuery([lh.title, lh.region, lh.summary], state.query)) return false
    if (!passesShared(lh as Locatable, state, origin)) return false
    if (state.difficulty.length > 0 && !state.difficulty.includes(lh.difficulty)) return false
    if (state.routeShape && lh.routeShape && lh.routeShape !== state.routeShape) return false
    if (state.routeShape && !lh.routeShape) return false
    if (!matchesDistance(lh.distance, state.distanceMinKm, state.distanceMaxKm)) return false
    if (!matchesDurationDays(lh.estimatedDays, state)) return false
    if (state.months.length > 0 && !seasonCoversAnyMonth(lh.season, state.months)) return false
    if (!matchesPublicTransport(lh.publicTransport, state.publicTransport)) return false
    if (state.dogsAllowed && lh.dogsAllowed !== true) return false
    if (state.tentingAllowed && lh.tentingAllowed !== true) return false
    if (state.hasCabinsAlong && (!lh.cabinIds || lh.cabinIds.length === 0)) return false
    return true
  })

  const filteredCabins = cabins.filter((cabin) => {
    if (!matchesQuery([cabin.title, cabin.region], state.query)) return false
    if (!passesShared(cabin as Locatable, state, origin)) return false
    if (!matchesPublicTransport(cabin.publicTransport, state.publicTransport)) return false
    if (state.dogsAllowed && cabin.dogsAllowed !== true) return false
    if (state.cabinFacilities.length > 0) {
      const tags = cabin.facilityTags ?? []
      if (!state.cabinFacilities.every((f) => tags.includes(f))) return false
    }
    if (state.cabinServiceType !== 'any') {
      // Cabin (not CabinDetail) doesn't always have serviceType; treat missing as no-match.
      const serviceType = (cabin as CabinDetail).serviceType
      if (!serviceType || serviceType !== state.cabinServiceType) return false
    }
    return true
  })

  const filteredUtflykter = utflykter.filter((u) => {
    if (!matchesQuery([u.title, u.region, u.summary], state.query)) return false
    if (!passesShared(u, state, origin)) return false
    if (state.months.length > 0 && !seasonCoversAnyMonth(asSeason(u), state.months)) return false
    if (!matchesPublicTransport(u.publicTransport, state.publicTransport)) return false
    if (state.dogsAllowed && u.dogsAllowed !== true) return false
    return true
  })

  const filteredAreas = areas.filter(({ area }) => {
    if (!matchesQuery([area.title, area.region, area.summary], state.query)) return false
    if (!passesShared(area, state, origin)) return false
    return true
  })

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

// Try to extract season from a value that may have one.
function asSeason(item: unknown) {
  if (item && typeof item === 'object' && 'season' in item) {
    return (item as { season?: import('@/types').Season }).season
  }
  return undefined
}

// ─── Helpers exposed for UI ──────────────────────────────────────────────────

export function normalizeDurationHours(
  hours: number | null,
  direction: 'min' | 'max',
): number | null {
  if (hours == null) return null
  if (hours <= 0) return 0
  if (direction === 'min') {
    const reversed = [...DURATION_RANGE_HOURS].reverse()
    return reversed.find((option) => option <= hours) ?? 0
  }
  return DURATION_RANGE_HOURS.find((option) => option >= hours) ?? 336
}

export function formatDurationHours(maxHours: number): string {
  if (maxHours === 0) return '0 tim'
  if (maxHours < 24 || maxHours % 24 !== 0) {
    return `${maxHours} tim`
  }

  const days = maxHours / 24
  return days === 1 ? '1 dag' : `${days} dagar`
}

export function formatDurationFilterLabel(minHours: number, maxHours: number | null): string {
  if (minHours === 0 && maxHours == null) return 'Alla längder'
  if (minHours > 0 && maxHours == null) return `Från ${formatDurationHours(minHours)}`
  if (minHours === 0 && maxHours != null) return `Upp till ${formatDurationHours(maxHours)}`
  return `${formatDurationHours(minHours)} - ${formatDurationHours(maxHours ?? minHours)}`
}

export { ALL_MONTHS, currentMonth } from './season'
export {
  ALL_LANDSKAP,
  ALL_LANDSKAP_ALPHABETICAL,
  LANDSKAP_BY_LANDSDEL,
  LANDSDEL_LABELS,
  LANDSKAP_LABELS,
} from './landskap'
