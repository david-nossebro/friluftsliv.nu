import { describe, it, expect } from 'vitest'
import { formatSeason, seasonCoversMonth, seasonCoversAnyMonth } from './season'

describe('formatSeason', () => {
  it('formats year-round', () => {
    expect(formatSeason('year-round')).toBe('Året runt')
  })

  it('capitalizes the from-month', () => {
    expect(formatSeason({ from: 'juni', to: 'september' })).toBe('Juni till september')
  })
})

describe('seasonCoversMonth', () => {
  it('is true for any month if undefined', () => {
    expect(seasonCoversMonth(undefined, 'januari')).toBe(true)
  })

  it('is true for any month if year-round', () => {
    expect(seasonCoversMonth('year-round', 'december')).toBe(true)
  })

  it('handles forward ranges', () => {
    const s = { from: 'juni' as const, to: 'september' as const }
    expect(seasonCoversMonth(s, 'maj')).toBe(false)
    expect(seasonCoversMonth(s, 'juni')).toBe(true)
    expect(seasonCoversMonth(s, 'augusti')).toBe(true)
    expect(seasonCoversMonth(s, 'september')).toBe(true)
    expect(seasonCoversMonth(s, 'oktober')).toBe(false)
  })

  it('handles wrap-around ranges (e.g. november → februari)', () => {
    const s = { from: 'november' as const, to: 'februari' as const }
    expect(seasonCoversMonth(s, 'oktober')).toBe(false)
    expect(seasonCoversMonth(s, 'november')).toBe(true)
    expect(seasonCoversMonth(s, 'januari')).toBe(true)
    expect(seasonCoversMonth(s, 'februari')).toBe(true)
    expect(seasonCoversMonth(s, 'mars')).toBe(false)
  })
})

describe('seasonCoversAnyMonth', () => {
  it('returns true for empty months list', () => {
    expect(seasonCoversAnyMonth({ from: 'juni', to: 'augusti' }, [])).toBe(true)
  })

  it('returns true if any month is in season', () => {
    expect(
      seasonCoversAnyMonth({ from: 'juni', to: 'augusti' }, ['maj', 'juli']),
    ).toBe(true)
  })

  it('returns false when no months overlap', () => {
    expect(
      seasonCoversAnyMonth({ from: 'juni', to: 'augusti' }, ['december', 'januari']),
    ).toBe(false)
  })
})
