import type { MapPosition } from '@/types'

const EARTH_RADIUS_KM = 6371

export interface ElevationSummary {
  minElevation: number
  maxElevation: number
  ascent: number
  descent: number
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/** Great-circle distance between two lat/lng points, in kilometres. */
export function haversineKm(a: MapPosition, b: MapPosition): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

/**
 * Returns an array of cumulative distances, one per input point. The first
 * entry is always 0; the last entry is the total track length in kilometres.
 */
export function cumulativeDistanceKm(track: MapPosition[]): number[] {
  if (track.length === 0) return []
  const out: number[] = new Array(track.length)
  out[0] = 0
  for (let i = 1; i < track.length; i++) {
    out[i] = (out[i - 1] ?? 0) + haversineKm(track[i - 1]!, track[i]!)
  }
  return out
}

export function summarizeElevation(track: MapPosition[]): ElevationSummary | null {
  if (track.length < 2) return null
  if (track.some((point) => point.ele === undefined)) return null

  const elevations = track.map((point) => point.ele as number)
  let ascent = 0
  let descent = 0

  for (let i = 1; i < elevations.length; i++) {
    const delta = (elevations[i] ?? 0) - (elevations[i - 1] ?? 0)
    if (delta > 0) {
      ascent += delta
    } else if (delta < 0) {
      descent += Math.abs(delta)
    }
  }

  return {
    minElevation: Math.min(...elevations),
    maxElevation: Math.max(...elevations),
    ascent,
    descent,
  }
}

/**
 * Linearly interpolates a point on the track at a given distance from the
 * start. Clamps to the track endpoints. Carries `ele` through if both
 * neighbouring points have it.
 */
export function pointAtDistanceKm(track: MapPosition[], km: number): MapPosition {
  if (track.length === 0) {
    throw new Error('pointAtDistanceKm: track is empty')
  }
  const cum = cumulativeDistanceKm(track)
  const total = cum[cum.length - 1] ?? 0
  if (km <= 0 || total === 0) return track[0]!
  if (km >= total) return track[track.length - 1]!

  // Find segment containing km
  let i = 1
  while (i < cum.length && (cum[i] ?? 0) < km) i++
  const prev = track[i - 1]!
  const next = track[i]!
  const prevD = cum[i - 1] ?? 0
  const nextD = cum[i] ?? prevD
  const segment = nextD - prevD
  const t = segment === 0 ? 0 : (km - prevD) / segment

  const lat = prev.lat + (next.lat - prev.lat) * t
  const lng = prev.lng + (next.lng - prev.lng) * t
  const hasEle = prev.ele !== undefined && next.ele !== undefined
  if (hasEle) {
    const ele = prev.ele! + (next.ele! - prev.ele!) * t
    return { lat, lng, ele }
  }
  return { lat, lng }
}
