import { describe, it, expect } from 'vitest'
import {
  getApplicableFilters,
  buildPills,
  createFilterResetPatch,
  countActiveFiltersForDimensions,
} from './coordinator'
import { defaultFilterState } from './types'
import type { FilterState, FilterDimension } from './types'

function withOverrides(partial: Partial<FilterState>): FilterState {
  return { ...defaultFilterState, ...partial }
}

describe('getApplicableFilters', () => {
  it('returns all dimensions for "alla"', () => {
    const dims = getApplicableFilters('alla')
    expect(dims).toContain('difficulty')
    expect(dims).toContain('cabinServiceType')
    expect(dims).toContain('utflyktDuration')
  })

  it('returns route dimensions for "vandring"', () => {
    const dims = getApplicableFilters('vandring')
    expect(dims).toContain('difficulty')
    expect(dims).toContain('hasCabinsAlong')
    expect(dims).not.toContain('cabinFacilities')
  })

  it('excludes hasCabinsAlong for kanot and skidturer', () => {
    expect(getApplicableFilters('kanot')).not.toContain('hasCabinsAlong')
    expect(getApplicableFilters('skidturer')).not.toContain('hasCabinsAlong')
    expect(getApplicableFilters('vandring')).toContain('hasCabinsAlong')
  })

  it('returns cabin dimensions for "stugor"', () => {
    const dims = getApplicableFilters('stugor')
    expect(dims).toContain('cabinFacilities')
    expect(dims).toContain('cabinServiceType')
    expect(dims).not.toContain('difficulty')
  })

  it('returns utflykt dimensions for "utflykter"', () => {
    const dims = getApplicableFilters('utflykter')
    expect(dims).toContain('utflyktDuration')
    expect(dims).toContain('season')
    expect(dims).not.toContain('difficulty')
  })

  it('returns only landskap and nearMe for area tabs', () => {
    expect(getApplicableFilters('nationalparker')).toEqual(['landskap', 'nearMe'])
    expect(getApplicableFilters('naturreservat')).toEqual(['landskap', 'nearMe'])
  })
})

describe('countActiveFiltersForDimensions', () => {
  it('counts only the requested dimensions', () => {
    const state = withOverrides({
      difficulty: ['easy'],
      cabinFacilities: ['bastu'],
      landskap: ['skane'],
    })
    expect(countActiveFiltersForDimensions(state, ['difficulty', 'cabinFacilities'])).toBe(2)
    expect(countActiveFiltersForDimensions(state, ['difficulty'])).toBe(1)
    expect(countActiveFiltersForDimensions(state, ['landskap'])).toBe(1)
    expect(countActiveFiltersForDimensions(state, ['cabinServiceType'])).toBe(0)
  })

  it('suppresses landskap when nearMe is active', () => {
    const state = withOverrides({ nearMe: true, landskap: ['skane'] })
    expect(countActiveFiltersForDimensions(state, ['landskap', 'nearMe'])).toBe(1)
  })
})

describe('buildPills', () => {
  it('assigns a dimension to every pill', () => {
    const state = withOverrides({
      difficulty: ['easy', 'medium'],
      routeShape: 'roundtrip',
      landskap: ['skane'],
      months: ['juni'],
      publicTransport: true,
      nearMe: true,
      dogsAllowed: true,
      tentingAllowed: true,
      hasCabinsAlong: true,
      cabinFacilities: ['bastu'],
      cabinServiceType: 'betjänad',
      hikeType: ['vandring'],
      utflyktDurationMin: 2,
      utflyktDurationMax: 4,
    })
    const pills = buildPills(state)
    for (const pill of pills) {
      expect(pill.dimension).toBeDefined()
    }
  })

  it('includes shared pills (landskap, season, publicTransport, nearMe, dogsAllowed)', () => {
    const state = withOverrides({
      landskap: ['skane'],
      months: ['juni'],
      publicTransport: true,
      nearMe: true,
      dogsAllowed: true,
    })
    const pills = buildPills(state)
    expect(pills.some((p) => p.dimension === 'landskap')).toBe(true)
    expect(pills.some((p) => p.dimension === 'season')).toBe(true)
    expect(pills.some((p) => p.dimension === 'publicTransport')).toBe(true)
    expect(pills.some((p) => p.dimension === 'nearMe')).toBe(true)
    expect(pills.some((p) => p.dimension === 'dogsAllowed')).toBe(true)
  })

  it('includes route-specific pills', () => {
    const state = withOverrides({
      difficulty: ['easy'],
      routeShape: 'roundtrip',
      distanceMinKm: 5,
      durationMin: 2,
      durationMax: 8,
      tentingAllowed: true,
      hasCabinsAlong: true,
      hikeType: ['vandring'],
    })
    const pills = buildPills(state)
    expect(pills.some((p) => p.dimension === 'difficulty')).toBe(true)
    expect(pills.some((p) => p.dimension === 'routeShape')).toBe(true)
    expect(pills.some((p) => p.dimension === 'distance')).toBe(true)
    expect(pills.some((p) => p.dimension === 'duration')).toBe(true)
    expect(pills.some((p) => p.dimension === 'tentingAllowed')).toBe(true)
    expect(pills.some((p) => p.dimension === 'hasCabinsAlong')).toBe(true)
    expect(pills.some((p) => p.dimension === 'hikeType')).toBe(true)
  })

  it('includes cabin-specific pills', () => {
    const state = withOverrides({
      cabinFacilities: ['bastu'],
      cabinServiceType: 'betjänad',
    })
    const pills = buildPills(state)
    expect(pills.some((p) => p.dimension === 'cabinFacilities')).toBe(true)
    expect(pills.some((p) => p.dimension === 'cabinServiceType')).toBe(true)
  })

  it('includes utflykt-specific pills', () => {
    const state = withOverrides({
      utflyktDurationMin: 2,
      utflyktDurationMax: 4,
    })
    const pills = buildPills(state)
    expect(pills.some((p) => p.dimension === 'utflyktDuration')).toBe(true)
  })

  it('returns empty array when nothing is active', () => {
    expect(buildPills(defaultFilterState)).toHaveLength(0)
  })
})

describe('createFilterResetPatch', () => {
  it('resets only the requested dimensions', () => {
    const patch = createFilterResetPatch(['difficulty', 'landskap'])
    expect(patch.difficulty).toEqual([])
    expect(patch.landskap).toEqual([])
    expect(patch.routeShape).toBeUndefined()
  })

  it('resets nearMe together with nearMeRadiusKm', () => {
    const patch = createFilterResetPatch(['nearMe'])
    expect(patch.nearMe).toBe(false)
    expect(patch.nearMeRadiusKm).toBe(25)
  })

  it('resets distance as a pair', () => {
    const patch = createFilterResetPatch(['distance'])
    expect(patch.distanceMinKm).toBe(0)
    expect(patch.distanceMaxKm).toBeNull()
  })

  it('resets duration as a pair', () => {
    const patch = createFilterResetPatch(['duration'])
    expect(patch.durationMin).toBe(0)
    expect(patch.durationMax).toBeNull()
  })

  it('resets utflyktDuration as a pair', () => {
    const patch = createFilterResetPatch(['utflyktDuration'])
    expect(patch.utflyktDurationMin).toBe(0)
    expect(patch.utflyktDurationMax).toBeNull()
  })
})
