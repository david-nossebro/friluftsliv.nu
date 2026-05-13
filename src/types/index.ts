export type ActivityType = 'vandring' | 'skidtur' | 'topptur' | 'cykeltur' | 'paddeltur' | 'stugtur'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type CabinServiceType = 'obetjänad' | 'betjänad' | 'självhushåll'

export interface Route {
  id: string
  title: string
  region: string
  activityType: ActivityType
  distance: number
  elevation: number
  duration: number
  difficulty: Difficulty
  imageUrl?: string
}

export interface RouteDetail extends Route {
  description: string
  startPoint?: string
  season?: string
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

export interface Cabin {
  id: string
  title: string
  region: string
  amenities: string[]
  pricePerNight?: number
  available: boolean
  imageUrl?: string
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
  routeCount: number
  imageUrl?: string
}

export interface SearchSuggestion {
  id: string
  name: string
  type: 'route' | 'cabin' | 'area' | 'region'
  distance?: number
}

// ─── Map types ───────────────────────────────────────────────────────────────

export interface MapPosition {
  lat: number
  lng: number
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
