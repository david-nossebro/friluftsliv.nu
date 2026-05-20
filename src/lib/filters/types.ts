import type {
  Difficulty,
  CabinServiceType,
  ExploreTab,
  Facility,
  HikeType,
  Landskap,
  Month,
  RouteShape,
} from '@/types'

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
  hikeType: HikeType[]
  /** Utflykt visit duration filter — min hours. */
  utflyktDurationMin: number
  /** Utflykt visit duration filter — max hours (null = no upper bound). */
  utflyktDurationMax: number | null
}

export const DEFAULT_DISTANCE_MIN = 0
export const DEFAULT_DURATION_MIN = 0
export const DEFAULT_NEAR_ME_RADIUS_KM = 25

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
  hikeType: [],
  utflyktDurationMin: 0,
  utflyktDurationMax: null,
}

export type FilterDimension =
  | 'difficulty' | 'routeShape' | 'distance' | 'duration' | 'season'
  | 'landskap' | 'publicTransport' | 'nearMe' | 'dogsAllowed'
  | 'tentingAllowed' | 'hasCabinsAlong'
  | 'cabinFacilities' | 'cabinServiceType'
  | 'hikeType'
  | 'utflyktDuration'

export interface PillSpec {
  key: string
  label: string
  dimension: FilterDimension
  clear: () => Partial<FilterState>
}
