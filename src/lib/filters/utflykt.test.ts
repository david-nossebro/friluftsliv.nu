import { describe, it, expect } from 'vitest'
import { applyUtflyktFilters, buildUtflyktPills } from './utflykt'
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
  visitDuration: '2–4 timmar',
  highlights: [],
  landskap: ['skane'],
  publicTransport: { mode: 'reachable' },
  dogsAllowed: true,
  visitDurationMinHours: 2,
  visitDurationMaxHours: 4,
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

describe('utflyktDuration filter', () => {
  const shortUtflykt: Utflykt = { ...utflykt, id: 'u-short', visitDurationMinHours: 1.5, visitDurationMaxHours: 2 }
  const mediumUtflykt: Utflykt = { ...utflykt, id: 'u-medium', visitDurationMinHours: 2, visitDurationMaxHours: 4 }
  const longUtflykt: Utflykt = { ...utflykt, id: 'u-long', visitDurationMinHours: 4, visitDurationMaxHours: 6 }

  it('filters by min duration', () => {
    const result = applyUtflyktFilters(
      [shortUtflykt, mediumUtflykt, longUtflykt],
      withOverrides({ utflyktDurationMin: 3 }),
      null,
    )
    expect(result.map((u) => u.id)).toEqual(['u-medium', 'u-long'])
  })

  it('filters by max duration', () => {
    const result = applyUtflyktFilters(
      [shortUtflykt, mediumUtflykt, longUtflykt],
      withOverrides({ utflyktDurationMax: 3 }),
      null,
    )
    expect(result.map((u) => u.id)).toEqual(['u-short', 'u-medium'])
  })

  it('filters by min+max range', () => {
    const result = applyUtflyktFilters(
      [shortUtflykt, mediumUtflykt, longUtflykt],
      withOverrides({ utflyktDurationMin: 2, utflyktDurationMax: 4 }),
      null,
    )
    expect(result.map((u) => u.id)).toEqual(['u-short', 'u-medium', 'u-long'])
  })

  it('filters out non-overlapping items', () => {
    const result = applyUtflyktFilters(
      [shortUtflykt, mediumUtflykt, longUtflykt],
      withOverrides({ utflyktDurationMin: 5 }),
      null,
    )
    expect(result.map((u) => u.id)).toEqual(['u-long'])
  })

  it('gracefully passes items without numeric duration', () => {
    const noDuration = { ...utflykt, id: 'u-none' } as Utflykt
    delete (noDuration as unknown as Record<string, unknown>).visitDurationMinHours
    delete (noDuration as unknown as Record<string, unknown>).visitDurationMaxHours
    const result = applyUtflyktFilters(
      [noDuration],
      withOverrides({ utflyktDurationMin: 3 }),
      null,
    )
    expect(result).toHaveLength(1)
  })
})

describe('buildUtflyktPills', () => {
  it('builds a pill for active duration filter', () => {
    const pills = buildUtflyktPills(withOverrides({ utflyktDurationMin: 2, utflyktDurationMax: 4 }))
    expect(pills).toHaveLength(1)
    expect(pills[0]!.key).toBe('udur')
    expect(pills[0]!.label).toBe('2 tim - 4 tim')
  })

  it('returns empty array when no duration filter is active', () => {
    const pills = buildUtflyktPills(defaultFilterState)
    expect(pills).toHaveLength(0)
  })
})

