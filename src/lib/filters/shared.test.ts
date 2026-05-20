import { describe, it, expect } from 'vitest'
import {
  matchesQuery,
  matchesLandskap,
  matchesDistance,
  matchesDurationMinutes,
  matchesPublicTransport,
  matchesNearMe,
  passesSharedBase,
} from './shared'
import type { FilterState } from './types'

describe('matchesQuery', () => {
  it('returns true for empty query', () => {
    expect(matchesQuery(['foo', 'bar'], '')).toBe(true)
  })

  it('matches case-insensitively', () => {
    expect(matchesQuery(['Skåneleden'], 'skåne')).toBe(true)
    expect(matchesQuery(['Skåneleden'], 'fjäll')).toBe(false)
  })

  it('matches any text in the array', () => {
    expect(matchesQuery(['title', 'region'], 'region')).toBe(true)
    expect(matchesQuery(['title', 'region'], 'title')).toBe(true)
  })
})

describe('matchesLandskap', () => {
  it('returns true when no landskap selected', () => {
    expect(matchesLandskap(['skane'], [])).toBe(true)
  })

  it('returns false when item has no landskap and selection is non-empty', () => {
    expect(matchesLandskap(undefined, ['skane'])).toBe(false)
    expect(matchesLandskap([], ['skane'])).toBe(false)
  })

  it('returns true when item landskap overlaps with selection', () => {
    expect(matchesLandskap(['skane', 'blekinge'], ['skane'])).toBe(true)
  })

  it('returns false when no overlap', () => {
    expect(matchesLandskap(['lappland'], ['skane'])).toBe(false)
  })
})

describe('matchesDistance', () => {
  it('returns true when distance is undefined', () => {
    expect(matchesDistance(undefined, 0, null)).toBe(true)
  })

  it('enforces min bound', () => {
    expect(matchesDistance(5, 10, null)).toBe(false)
    expect(matchesDistance(15, 10, null)).toBe(true)
  })

  it('enforces max bound', () => {
    expect(matchesDistance(25, 0, 20)).toBe(false)
    expect(matchesDistance(15, 0, 20)).toBe(true)
  })
})

describe('matchesDurationMinutes', () => {
  it('returns true when duration is undefined', () => {
    expect(matchesDurationMinutes(undefined, 0, null)).toBe(true)
  })

  it('enforces min hours', () => {
    expect(matchesDurationMinutes(60, 2, null)).toBe(false) // 1h < 2h
    expect(matchesDurationMinutes(180, 2, null)).toBe(true) // 3h >= 2h
  })

  it('enforces max hours', () => {
    expect(matchesDurationMinutes(300, 0, 4)).toBe(false) // 5h > 4h
    expect(matchesDurationMinutes(180, 0, 4)).toBe(true) // 3h <= 4h
  })
})

describe('matchesPublicTransport', () => {
  it('returns true when not required', () => {
    expect(matchesPublicTransport(undefined, false)).toBe(true)
    expect(matchesPublicTransport({ mode: 'none' }, false)).toBe(true)
  })

  it('returns false when required but item has no PT info', () => {
    expect(matchesPublicTransport(undefined, true)).toBe(false)
  })

  it('accepts reachable and partial', () => {
    expect(matchesPublicTransport({ mode: 'reachable' }, true)).toBe(true)
    expect(matchesPublicTransport({ mode: 'partial' }, true)).toBe(true)
  })

  it('rejects none when required', () => {
    expect(matchesPublicTransport({ mode: 'none' }, true)).toBe(false)
  })
})

describe('matchesNearMe', () => {
  it('returns false when origin is null', () => {
    expect(matchesNearMe({ lat: 0, lng: 0 }, null, 25)).toBe(false)
  })

  it('returns false when coords are undefined', () => {
    expect(matchesNearMe(undefined, { lat: 0, lng: 0 }, 25)).toBe(false)
  })

  it('returns true when within radius', () => {
    // Same point should be within any radius
    expect(matchesNearMe({ lat: 59.3, lng: 18.1 }, { lat: 59.3, lng: 18.1 }, 25)).toBe(true)
  })

  it('returns false when outside radius', () => {
    // Two points far apart
    expect(matchesNearMe({ lat: 59.3, lng: 18.1 }, { lat: 67.8, lng: 20.3 }, 25)).toBe(false)
  })
})

describe('passesSharedBase', () => {
  const state: Pick<FilterState, 'nearMe' | 'nearMeRadiusKm' | 'landskap'> = {
    nearMe: false,
    nearMeRadiusKm: 25,
    landskap: [],
  }

  it('returns true with default state', () => {
    expect(passesSharedBase({ landskap: ['skane'] }, state, null)).toBe(true)
  })

  it('checks landskap when no nearMe', () => {
    expect(passesSharedBase({ landskap: ['skane'] }, { ...state, landskap: ['skane'] }, null)).toBe(true)
    expect(passesSharedBase({ landskap: ['lappland'] }, { ...state, landskap: ['skane'] }, null)).toBe(false)
  })

  it('prioritizes nearMe over landskap', () => {
    const nearMeState = { ...state, nearMe: true, landskap: ['skane'] }
    // When nearMe is on and origin is null, matchesNearMe returns false
    expect(passesSharedBase({ landskap: ['skane'], coordinates: { lat: 0, lng: 0 } }, nearMeState, null)).toBe(false)
    // When nearMe is on and item has no coords, it fails
    expect(passesSharedBase({ landskap: ['skane'] }, nearMeState, { lat: 0, lng: 0 })).toBe(false)
  })
})
