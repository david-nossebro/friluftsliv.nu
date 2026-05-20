import { describe, it, expect } from 'vitest'
import { applyCabinFilters, countActiveCabinFilters, buildCabinPills, createCabinResetPatch } from './cabin'
import { defaultFilterState } from './types'
import type { FilterState } from './types'
import type { Cabin } from '@/types'

function withOverrides(partial: Partial<FilterState>): FilterState {
  return { ...defaultFilterState, ...partial }
}

const cabin: Cabin = {
  id: 'c1',
  title: 'Stuga',
  region: 'Skåne',
  amenities: [],
  landskap: ['skane'],
  kommun: 'Klippan',
  facilityTags: ['bastu', 'koksutrustning'],
  publicTransport: { mode: 'reachable' },
  dogsAllowed: true,
}

describe('cabin filters', () => {
  it('returns everything unchanged for the default state', () => {
    const result = applyCabinFilters([cabin], defaultFilterState, null)
    expect(result).toHaveLength(1)
  })

  it('cabin facilities require ALL of the selected facilities', () => {
    const both = applyCabinFilters([cabin], withOverrides({ cabinFacilities: ['bastu', 'koksutrustning'] }), null)
    expect(both).toHaveLength(1)

    const missing = applyCabinFilters([cabin], withOverrides({ cabinFacilities: ['bastu', 'restaurang'] }), null)
    expect(missing).toHaveLength(0)
  })

  it('cabinServiceType filters by service type', () => {
    const cabinWithService: Cabin = {
      ...cabin,
      id: 'c2',
      serviceType: 'betjänad',
    } as Cabin

    const result = applyCabinFilters(
      [cabin, cabinWithService],
      withOverrides({ cabinServiceType: 'betjänad' }),
      null,
    )
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('c2')
  })

  it('publicTransport=true filters to reachable+partial items only', () => {
    const noPtCabin: Cabin = { ...cabin, id: 'c3', publicTransport: { mode: 'none' } }
    const result = applyCabinFilters([cabin, noPtCabin], withOverrides({ publicTransport: true }), null)
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('c1')
  })
})

describe('countActiveCabinFilters', () => {
  it('counts only cabin-specific filter dimensions', () => {
    expect(countActiveCabinFilters(defaultFilterState)).toBe(0)
    expect(countActiveCabinFilters(withOverrides({ cabinFacilities: ['bastu'] }))).toBe(1)
    expect(countActiveCabinFilters(withOverrides({ cabinFacilities: ['bastu'], cabinServiceType: 'betjänad' }))).toBe(2)
  })
})

describe('buildCabinPills', () => {
  it('builds pills for active cabin filters', () => {
    const pills = buildCabinPills(withOverrides({ cabinFacilities: ['bastu'], cabinServiceType: 'betjänad' }))
    expect(pills.map((p) => p.key)).toContain('fac-bastu')
    expect(pills.map((p) => p.key)).toContain('cst')
  })

  it('returns empty array when no cabin filters are active', () => {
    const pills = buildCabinPills(defaultFilterState)
    expect(pills).toHaveLength(0)
  })
})

describe('createCabinResetPatch', () => {
  it('resets all cabin-related filter fields', () => {
    const patch = createCabinResetPatch()
    expect(patch.cabinFacilities).toEqual([])
    expect(patch.cabinServiceType).toBe('any')
    expect(patch.dogsAllowed).toBe(false)
  })
})
