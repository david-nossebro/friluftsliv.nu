import { describe, it, expect } from 'vitest'
import { haversineKm, distanceToCoord } from './geo'

describe('haversineKm', () => {
  it('returns zero for identical points', () => {
    expect(haversineKm({ lat: 59.33, lng: 18.06 }, { lat: 59.33, lng: 18.06 })).toBe(0)
  })

  it('approximates the Stockholm ↔ Abisko distance', () => {
    const stockholm = { lat: 59.3293, lng: 18.0686 }
    const abisko = { lat: 68.3530, lng: 18.8200 }
    const d = haversineKm(stockholm, abisko)
    expect(d).toBeGreaterThan(1000)
    expect(d).toBeLessThan(1080)
  })

  it('handles points across the equator/anti-meridian without NaN', () => {
    const d = haversineKm({ lat: -45, lng: -170 }, { lat: 45, lng: 170 })
    expect(Number.isFinite(d)).toBe(true)
    expect(d).toBeGreaterThan(0)
  })
})

describe('distanceToCoord', () => {
  it('returns null when candidate has no coordinates', () => {
    expect(distanceToCoord({ lat: 0, lng: 0 }, { coordinates: undefined })).toBeNull()
    expect(distanceToCoord({ lat: 0, lng: 0 }, undefined)).toBeNull()
  })

  it('delegates to haversineKm when coords are present', () => {
    const result = distanceToCoord(
      { lat: 0, lng: 0 },
      { coordinates: { lat: 0, lng: 0 } },
    )
    expect(result).toBe(0)
  })
})
