import { describe, it, expect } from 'vitest'
import { applyAreaFilters, countActiveAreaFilters, createAreaResetPatch } from './area'
import { defaultFilterState } from './types'
import type { FilterState } from './types'
import type { AreaListItem } from '@/types'

function withOverrides(partial: Partial<FilterState>): FilterState {
  return { ...defaultFilterState, ...partial }
}

const areaListItem: AreaListItem = {
  area: {
    id: 'a1',
    title: 'Söderåsen',
    kind: 'nationalpark',
    region: 'Skåne',
    summary: '',
    description: '',
    landskap: ['skane'],
    coordinates: { lat: 56.0420, lng: 13.2380 },
  },
  routeCount: 1,
  cabinCount: 1,
}

describe('area filters', () => {
  it('returns everything unchanged for the default state', () => {
    const result = applyAreaFilters([areaListItem], defaultFilterState, null)
    expect(result).toHaveLength(1)
  })

  it('filters by landskap', () => {
    const inSkane = applyAreaFilters([areaListItem], withOverrides({ landskap: ['skane'] }), null)
    expect(inSkane).toHaveLength(1)

    const inLappland = applyAreaFilters([areaListItem], withOverrides({ landskap: ['lappland'] }), null)
    expect(inLappland).toHaveLength(0)
  })

  it('Nära mig with origin filters by haversine distance', () => {
    const stockholm = { lat: 59.3293, lng: 18.0686 }
    const result = applyAreaFilters(
      [areaListItem],
      withOverrides({ nearMe: true, nearMeRadiusKm: 100 }),
      stockholm,
    )
    expect(result).toHaveLength(0)
  })

  it('Nära mig takes precedence over landskap', () => {
    const nearArea = { lat: 56.04, lng: 13.24 }
    const result = applyAreaFilters(
      [areaListItem],
      withOverrides({ nearMe: true, nearMeRadiusKm: 50, landskap: ['lappland'] }),
      nearArea,
    )
    expect(result).toHaveLength(1)
  })
})

describe('countActiveAreaFilters', () => {
  it('counts only area-specific filter dimensions', () => {
    expect(countActiveAreaFilters(defaultFilterState)).toBe(0)
    expect(countActiveAreaFilters(withOverrides({ landskap: ['skane'] }))).toBe(1)
    expect(countActiveAreaFilters(withOverrides({ nearMe: true }))).toBe(1)
  })
})

describe('createAreaResetPatch', () => {
  it('resets all area-related filter fields', () => {
    const patch = createAreaResetPatch()
    expect(patch.landskap).toEqual([])
    expect(patch.nearMe).toBe(false)
  })
})
