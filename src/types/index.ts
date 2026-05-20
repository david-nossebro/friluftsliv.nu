export type ActivityType = 'vandring' | 'skidtur' | 'topptur' | 'cykeltur' | 'paddeltur' | 'stugtur'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type CabinServiceType = 'obetjänad' | 'betjänad' | 'självhushåll'

export type ExploreTab =
  | 'alla'
  | 'utflykter'
  | 'stugor'
  | 'vandring'
  | 'kanot'
  | 'skidturer'
  | 'nationalparker'
  | 'naturreservat'

export type RouteExploreCategory =
  | 'vandring'
  | 'fjallvandring'
  | 'kanot'
  | 'skidturer'

export type HikeType = 'vandring' | 'fjallvandring' | 'langvandring'

export interface Utflykt {
  id: string
  title: string
  region: string
  summary: string
  travelTime: string
  visitDuration: string
  highlights: string[]
  imageUrl?: string
  // Filter dimensions
  landskap?: Landskap[]
  kommun?: string[]
  publicTransport?: PublicTransport
  dogsAllowed?: boolean
  season?: Season
  coordinates?: { lat: number; lng: number }
  /** Parsed from `visitDuration` for structured filtering. */
  visitDurationMinHours?: number
  /** Parsed from `visitDuration` for structured filtering. */
  visitDurationMaxHours?: number
}

export interface UtflyktDetail extends Utflykt {
  description: string
  images?: string[]
  season?: Season
  suitableFor?: string[]
  facilities?: string[]
  tips?: string[]
  accessByCar?: string
  accessByTransport?: string
  coordinates?: { lat: number; lng: number }
  areaIds?: string[]
}

export type ProtectedAreaKind = 'nationalpark' | 'naturreservat'

export type Month =
  | 'januari' | 'februari' | 'mars' | 'april' | 'maj' | 'juni'
  | 'juli' | 'augusti' | 'september' | 'oktober' | 'november' | 'december'

export type Season = { from: Month; to: Month } | 'year-round'

// ─── Filter taxonomy ─────────────────────────────────────────────────────────

/** All 25 Swedish landskap, normalized to ASCII slugs. */
export type Landskap =
  | 'skane' | 'blekinge' | 'halland' | 'smaland' | 'oland' | 'gotland'
  | 'vastergotland' | 'bohuslan' | 'dalsland' | 'ostergotland' | 'sodermanland'
  | 'narke' | 'vastmanland' | 'uppland' | 'varmland' | 'dalarna' | 'gastrikland'
  | 'halsingland' | 'medelpad' | 'angermanland' | 'jamtland' | 'harjedalen'
  | 'vasterbotten' | 'norrbotten' | 'lappland'

export type RouteShape = 'roundtrip' | 'out-and-back' | 'point-to-point'

export type PublicTransportMode = 'reachable' | 'partial' | 'none'

export interface PublicTransport {
  mode: PublicTransportMode
  /** Optional list of lines (e.g. "Buss 91", "Nattåg 95"). */
  lines?: string[]
  /** Free-text supplement shown alongside the structured mode. */
  note?: string
}

/** Structured facility tags for cabins (replaces free-form strings). */
export type Facility =
  | 'vedspis'
  | 'koksutrustning'
  | 'restaurang'
  | 'cafe'
  | 'bastu'
  | 'proviantforsaljning'
  | 'wifi'
  | 'el'
  | 'vatten'
  | 'utedass'
  | 'torrtoalett'
  | 'dusch'
  | 'guideservice'
  | 'familjevanlig'

// ─── Domain entities ─────────────────────────────────────────────────────────

export interface Route {
  id: string
  title: string
  region: string
  activityType: ActivityType
  exploreCategory?: RouteExploreCategory
  areaIds?: string[]
  distance: number
  elevation: number
  duration: number
  difficulty: Difficulty
  imageUrl?: string
  // Filter dimensions
  landskap?: Landskap[]
  kommun?: string[]
  routeShape?: RouteShape
  publicTransport?: PublicTransport
  dogsAllowed?: boolean
  tentingAllowed?: boolean
  season?: Season
  /** Curated cabin IDs that lie along this route. */
  cabinIds?: string[]
}

export interface RouteDetail extends Route {
  description: string
  startPoint?: string
  season?: Season
  tips?: string[]
  images?: string[]
  isRoundTrip?: boolean
  accessByCar?: string
  accessByTransport?: string
  gpxUrl?: string
  /** Pre-parsed GPX track coordinates for map rendering */
  gpxTrack?: MapPosition[]
  coordinates?: { lat: number; lng: number }
}

export interface Stage extends Route {
  longHikeId: string
  stageNumber: number
  summary: string
  startLocation: string
  endLocation: string
}

export interface StageDetail extends Stage {
  description: string
  startPoint?: string
  season?: Season
  tips?: string[]
  images?: string[]
  isRoundTrip?: boolean
  accessByCar?: string
  accessByTransport?: string
  gpxUrl?: string
  gpxTrack?: MapPosition[]
  coordinates?: { lat: number; lng: number }
  endCoordinates?: { lat: number; lng: number }
}

export interface LongHike {
  id: string
  title: string
  region: string
  summary: string
  description: string
  distance: number
  elevation: number
  duration: number
  estimatedDays: number
  difficulty: Difficulty
  stageIds: string[]
  imageUrl?: string
  images?: string[]
  season?: Season
  tips?: string[]
  terrain?: string
  waymarking?: string
  overnight?: string
  startPoint?: string
  endPoint?: string
  accessByCar?: string
  accessByTransport?: string
  gpxUrl?: string
  gpxTrack?: MapPosition[]
  coordinates?: { lat: number; lng: number }
  endCoordinates?: { lat: number; lng: number }
  // Filter dimensions
  landskap?: Landskap[]
  kommun?: string[]
  routeShape?: RouteShape
  publicTransport?: PublicTransport
  dogsAllowed?: boolean
  tentingAllowed?: boolean
  cabinIds?: string[]
}

export interface Cabin {
  id: string
  title: string
  region: string
  areaIds?: string[]
  amenities: string[]
  pricePerNight?: number
  imageUrl?: string
  // Filter dimensions
  landskap?: Landskap[]
  kommun?: string
  facilityTags?: Facility[]
  publicTransport?: PublicTransport
  dogsAllowed?: boolean
  serviceType?: CabinServiceType
}

export interface CabinDetail extends Cabin {
  description: string
  beds: number
  openPeriod?: string
  serviceType: CabinServiceType
  isLocked?: boolean
  facilities: string[]
  suitableFor?: string[]
  activities?: string
  images?: string[]
  accessSummer?: string
  accessWinter?: string
  coordinates?: { lat: number; lng: number }
  bookingUrl?: string
}

export interface Area {
  id: string
  title: string
  kind: ProtectedAreaKind
  region: string
  summary: string
  description: string
  imageUrl?: string
  images?: string[]
  // Filter dimensions
  landskap?: Landskap[]
  kommun?: string[]
  coordinates?: { lat: number; lng: number }
}

export interface AreaListItem {
  area: Area
  routeCount: number
  cabinCount: number
}

export interface SearchSuggestion {
  id: string
  name: string
  type: 'route' | 'cabin' | 'area' | 'utflykt' | 'region'
  distance?: number
}

// ─── Map types ───────────────────────────────────────────────────────────────

export interface MapPosition {
  lat: number
  lng: number
  /** Optional altitude in metres above sea level (matches GPX `<ele>`). */
  ele?: number
}

/** A tile layer configuration for the map */
export interface MapLayer {
  id: string
  label: string
  tileUrl: string
  attribution: string
  /** Brand color hex used as a visual preview swatch */
  previewColor?: string
  /** Max zoom the tile provider supports */
  maxZoom?: number
}

/** A single placeable marker on the map */
export interface MapMarker {
  id: string
  position: MapPosition
  /** Matches a MapFeatureLayer.type — used for icon & color lookup */
  type: string
  label: string
  /** Optional popup content */
  description?: string
}

/** A named layer of markers that can be toggled on/off */
export interface MapFeatureLayer {
  /** Unique type identifier, used for filtering */
  type: string
  /** Display label shown in the filter bar */
  label: string
  /** Emoji or short string icon shown in filter chips */
  icon?: string
  /** Brand color hex for markers of this type */
  color?: string
  markers: MapMarker[]
}

/** Default map tile layers — export for reuse in stories/pages */
export const DEFAULT_MAP_LAYERS: MapLayer[] = [
  {
    id: 'osm',
    label: 'Karta',
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    previewColor: '#EFF4EC',
    maxZoom: 19,
  },
  {
    id: 'topo',
    label: 'Topografi',
    tileUrl: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://opentopomap.org">OpenTopoMap</a> | © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    previewColor: '#B5C9A1',
    maxZoom: 17,
  },
  {
    id: 'satellite',
    label: 'Satellit',
    tileUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© <a href="https://www.esri.com/">Esri</a>',
    previewColor: '#4A7C59',
    maxZoom: 18,
  },
]
