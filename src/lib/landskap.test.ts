import { describe, it, expect } from 'vitest'
import { ALL_LANDSKAP, LANDSKAP_BY_LANDSDEL, LANDSKAP_LABELS, formatLandskap } from './landskap'

describe('landskap', () => {
  it('exports all 25 landskap', () => {
    expect(ALL_LANDSKAP).toHaveLength(25)
  })

  it('every landskap has a label', () => {
    for (const l of ALL_LANDSKAP) {
      expect(LANDSKAP_LABELS[l]).toBeTruthy()
      expect(formatLandskap(l)).toBe(LANDSKAP_LABELS[l])
    }
  })

  it('union of landsdelar covers every landskap exactly once', () => {
    const combined = [
      ...LANDSKAP_BY_LANDSDEL.gotaland,
      ...LANDSKAP_BY_LANDSDEL.svealand,
      ...LANDSKAP_BY_LANDSDEL.norrland,
    ]
    expect(combined.sort()).toEqual([...ALL_LANDSKAP].sort())
  })
})
