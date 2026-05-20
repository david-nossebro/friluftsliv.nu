import { describe, it, expect } from 'vitest'
import { applyUtflyktFilters, countActiveUtflyktFilters, createUtflyktResetPatch } from './utflykt'
import { defaultFilterState } from './types'
import type { FilterState } from './types'
import type { Utflykt } from '@/types'

function withOverrides(partial: Partial<FilterState>): FilterState {
  return { ...defaultFilterState, ...partial }
}

const utflykt: Utflykt = {
  id: 'u1',
  title: 'Tur',
  region: 'Skåne',
  summary: 'Kort tur',
  travelTime: '1 tim',
  visitDuration: '2 tim',
  highlights: [],
  landskap: ['skane'],
  publicTransport: { mode: 'reachable' },
  dogsAllowed: true,
}

describe('utflykt filters', () => {
  it('returns everything unchanged for the default state', () => {
    const result = applyUtflyktFilters([utflykt], defaultFilterState, null)
    expect(result).toHaveLength(1)
  })

  it('filters by landskap', () => {
    const inSkane = applyUtflyktFilters([utflykt], withOverrides({ landskap: ['skane'] }), null)
    expect(inSkane).toHaveLength(1)

    const inLappland = applyUtflyktFilters([utflykt], withOverrides({ landskap: ['lappland'] }), null)
    expect(inLappland).toHaveLength(0)
  })

  it('filters by publicTransport', () => {
    const noPtUtflykt: Utflykt = { ...utflykt, id: 'u2', publicTransport: { mode: 'none' } }
    const result = applyUtflyktFilters([utflykt, noPtUtflykt], withOverrides({ publicTransport: true }), null)
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('u1')
  })

  it('filters by dogsAllowed', () => {
    const noDogsUtflykt: Utflykt = { ...utflykt, id: 'u3', dogsAllowed: false }
    const result = applyUtflyktFilters([utflykt, noDogsUtflykt], withOverrides({ dogsAllowed: true }), null)
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('u1')
  })
})

describe('countActiveUtflyktFilters', () => {
  it('counts only utflykt-specific filter dimensions', () => {
    expect(countActiveUtflyktFilters(defaultFilterState)).toBe(0)
    expect(countActiveUtflyktFilters(withOverrides({ landskap: ['skane'] }))).toBe(1)
    expect(countActiveUtflyktFilters(withOverrides({ landskap: ['skane'], dogsAllowed: true }))).toBe(2)
  })
})

describe('createUtflyktResetPatch', () => {
  it('resets all utflykt-related filter fields', () => {
    const patch = createUtflyktResetPatch()
    expect(patch.landskap).toEqual([])
    expect(patch.months).toEqual([])
    expect(patch.dogsAllowed).toBe(false)
  })
})
