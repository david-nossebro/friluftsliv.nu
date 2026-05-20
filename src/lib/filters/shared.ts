import type {
  Difficulty,
  Facility,
  Landskap,
  Month,
  PublicTransportMode,
  RouteShape,
} from '@/types'
import { seasonCoversAnyMonth } from '../season'
import { ALL_LANDSKAP } from '../landskap'
import { haversineKm, type LatLng } from '../geo'

// Re-exports (kept here so the barrel can expose them from one place)
export { ALL_MONTHS, currentMonth } from '../season'
export {
  ALL_LANDSKAP,
  ALL_LANDSKAP_ALPHABETICAL,
  LANDSKAP_BY_LANDSDEL,
  LANDSDEL_LABELS,
  LANDSKAP_LABELS,
} from '../landskap'

// ─── Constants ───────────────────────────────────────────────────────────────

export const DEFAULT_DISTANCE_MIN = 0
export const DEFAULT_DURATION_MIN = 0
export const DEFAULT_NEAR_ME_RADIUS_KM = 25
export const DURATION_RANGE_HOURS = [
  0, 2, 4, 6, 8, 12, 24, 48, 72, 96, 120, 144, 168, 240, 336,
] as const

export const VALID_DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard']
export const VALID_ROUTE_SHAPES: readonly RouteShape[] = ['roundtrip', 'out-and-back', 'point-to-point']
export const VALID_FACILITIES: readonly Facility[] = [
  'vedspis', 'koksutrustning', 'restaurang', 'cafe', 'bastu', 'proviantforsaljning',
  'wifi', 'el', 'vatten', 'utedass', 'torrtoalett', 'dusch', 'guideservice', 'familjevanlig',
]

// ─── Landskap normalization ──────────────────────────────────────────────────

export function normalizeSelectedLandskap(landskap: readonly Landskap[]): Landskap[] {
  const normalized = Array.from(new Set(landskap)).filter((value): value is Landskap =>
    (ALL_LANDSKAP as readonly string[]).includes(value),
  )

  return normalized.length === 0 || normalized.length === ALL_LANDSKAP.length ? [] : normalized
}

// ─── Matchers ─────────────────────────────────────────────────────────────────

export function matchesQuery(text: string[], q: string): boolean {
  if (!q) return true
  const lower = q.toLowerCase()
  return text.some((value) => value.toLowerCase().includes(lower))
}

export function matchesLandskap(
  itemLandskap: Landskap[] | undefined,
  selected: Landskap[],
): boolean {
  const normalizedSelected = normalizeSelectedLandskap(selected)
  if (normalizedSelected.length === 0) return true
  if (!itemLandskap || itemLandskap.length === 0) return false
  return itemLandskap.some((l) => normalizedSelected.includes(l))
}

export function matchesDistance(
  distance: number | undefined,
  min: number,
  max: number | null,
): boolean {
  if (distance == null) return true
  if (distance < min) return false
  if (max != null && distance > max) return false
  return true
}

export function matchesDurationMinutes(
  durationMinutes: number | undefined,
  minHours: number,
  maxHours: number | null,
): boolean {
  if (durationMinutes == null) return true
  const durationHours = durationMinutes / 60
  if (durationHours < minHours) return false
  if (maxHours != null && durationHours > maxHours) return false
  return true
}

export function matchesDurationDays(
  estimatedDays: number | undefined,
  minHours: number,
  maxHours: number | null,
): boolean {
  if (estimatedDays == null) return true
  const durationHours = estimatedDays * 24
  if (durationHours < minHours) return false
  if (maxHours != null && durationHours > maxHours) return false
  return true
}

export function matchesPublicTransport(
  pt: { mode: PublicTransportMode } | undefined,
  required: boolean,
): boolean {
  if (!required) return true
  if (!pt) return false
  return pt.mode === 'reachable' || pt.mode === 'partial'
}

export function matchesNearMe(
  coords: LatLng | undefined,
  origin: LatLng | null,
  radiusKm: number,
): boolean {
  if (!origin) return true
  if (!coords) return false
  return haversineKm(origin, coords) <= radiusKm
}

// ─── Season helpers ───────────────────────────────────────────────────────────

export function matchesSeason(
  item: unknown,
  months: Month[],
): boolean {
  if (months.length === 0) return true
  const season =
    item && typeof item === 'object' && 'season' in item
      ? (item as { season?: import('@/types').Season }).season
      : undefined
  if (!season) return false
  return seasonCoversAnyMonth(season, months)
}

// ─── Duration formatting (UI helpers) ────────────────────────────────────────

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

