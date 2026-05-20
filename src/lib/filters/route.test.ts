import { describe, it, expect } from 'vitest'
import { applyRouteFilters, applyLongHikeFilters, countActiveRouteFilters, buildRoutePills, createRouteResetPatch } from './route'
import { defaultFilterState } from './types'
import type { FilterState } from './types'
import type { Route, LongHike } from '@/types'

function withOverrides(partial: Partial<FilterState>): FilterState {
  return { ...defaultFilterState, ...partial }
}

const route: Route = {
  id: 'r1',
  title: 'Test rutt',
  region: 'Skåne',
  activityType: 'vandring',
  exploreCategory: 'vandring',
  distance: 10,
  elevation: 100,
  duration: 180,
  difficulty: 'easy',
  landskap: ['skane'],
  kommun: ['Klippan'],
  routeShape: 'roundtrip',
  publicTransport: { mode: 'reachable' },
  dogsAllowed: true,
  tentingAllowed: false,
}

const hardRoute: Route = {
  ...route,
  id: 'r2',
  title: 'Hård rutt',
  difficulty: 'hard',
  distance: 105,
  duration: 1200,
  landskap: ['lappland'],
  kommun: ['Kiruna'],
  routeShape: 'point-to-point',
  publicTransport: { mode: 'none' },
  dogsAllowed: false,
  cabinIds: ['cabin-1'],
}

describe('route filters', () => {
  it('returns everything unchanged for the default state', () => {
    const result = applyRouteFilters([route, hardRoute], defaultFilterState, null)
    expect(result).toHaveLength(2)
  })

  it('filters by difficulty', () => {
    const result = applyRouteFilters([route, hardRoute], withOverrides({ difficulty: ['easy'] }), null)
    expect(result.map((r) => r.id)).toEqual(['r1'])
  })

  it('filters by distance range', () => {
    const minOnly = applyRouteFilters([route, hardRoute], withOverrides({ distanceMinKm: 50 }), null)
    expect(minOnly.map((r) => r.id)).toEqual(['r2'])

    const maxOnly = applyRouteFilters([route, hardRoute], withOverrides({ distanceMaxKm: 50 }), null)
    expect(maxOnly.map((r) => r.id)).toEqual(['r1'])
  })

  it('filters by duration in hours', () => {
    const short = applyRouteFilters([route, hardRoute], withOverrides({ durationMax: 4 }), null)
    expect(short.map((r) => r.id)).toEqual(['r1'])
  })

  it('hasCabinsAlong only keeps routes with cabinIds', () => {
    const result = applyRouteFilters([route, hardRoute], withOverrides({ hasCabinsAlong: true }), null)
    expect(result.map((r) => r.id)).toEqual(['r2'])
  })

  it('publicTransport=true filters to reachable+partial items only', () => {
    const partialRoute: Route = { ...route, id: 'r-partial', publicTransport: { mode: 'partial' } }
    const result = applyRouteFilters([partialRoute, hardRoute], withOverrides({ publicTransport: true }), null)
    expect(result.map((r) => r.id)).toEqual(['r-partial'])
  })

  it('hikeType filters by exploreCategory', () => {
    const mountainRoute: Route = { ...route, id: 'r-mountain', exploreCategory: 'fjallvandring' }
    const result = applyRouteFilters(
      [route, mountainRoute],
      withOverrides({ hikeType: ['fjallvandring'] }),
      null,
    )
    expect(result.map((r) => r.id)).toEqual(['r-mountain'])
  })
})

describe('longHike filters', () => {
  const longHike: LongHike = {
    id: 'lh1',
    title: 'Långtur',
    region: 'Lappland',
    summary: 'Flera dagar i fjällen',
    description: 'Testdata',
    distance: 80,
    elevation: 1200,
    duration: 2520,
    estimatedDays: 6,
    difficulty: 'hard',
    stageIds: [],
    landskap: ['lappland'],
    publicTransport: { mode: 'reachable' },
  }

  it('filters long hikes by estimated days', () => {
    const multidayLimit = applyLongHikeFilters(
      [longHike],
      withOverrides({ durationMin: 72, durationMax: 144 }),
      null,
    )
    expect(multidayLimit.map((lh) => lh.id)).toEqual(['lh1'])

    const tooShort = applyLongHikeFilters(
      [longHike],
      withOverrides({ durationMax: 48 }),
      null,
    )
    expect(tooShort).toHaveLength(0)
  })

  it('hikeType=langvandring keeps only long hikes', () => {
    const result = applyLongHikeFilters(
      [longHike],
      withOverrides({ hikeType: ['langvandring'] }),
      null,
    )
    expect(result).toHaveLength(1)

    const excluded = applyLongHikeFilters(
      [longHike],
      withOverrides({ hikeType: ['vandring'] }),
      null,
    )
    expect(excluded).toHaveLength(0)
  })
})

describe('countActiveRouteFilters', () => {
  it('counts only route-specific filter dimensions', () => {
    expect(countActiveRouteFilters(defaultFilterState)).toBe(0)
    expect(countActiveRouteFilters(withOverrides({ difficulty: ['easy'] }))).toBe(1)
    expect(countActiveRouteFilters(withOverrides({ difficulty: ['easy'], tentingAllowed: true, hasCabinsAlong: true }))).toBe(3)
  })
})

describe('buildRoutePills', () => {
  it('builds pills for active route filters', () => {
    const pills = buildRoutePills(withOverrides({ difficulty: ['easy', 'hard'], routeShape: 'roundtrip' }))
    expect(pills.map((p) => p.key)).toContain('d-easy')
    expect(pills.map((p) => p.key)).toContain('d-hard')
    expect(pills.map((p) => p.key)).toContain('rs')
  })

  it('returns empty array when no route filters are active', () => {
    const pills = buildRoutePills(defaultFilterState)
    expect(pills).toHaveLength(0)
  })
})

describe('createRouteResetPatch', () => {
  it('resets all route-related filter fields', () => {
    const patch = createRouteResetPatch()
    expect(patch.difficulty).toEqual([])
    expect(patch.routeShape).toBeNull()
    expect(patch.distanceMinKm).toBe(0)
    expect(patch.tentingAllowed).toBe(false)
    expect(patch.hasCabinsAlong).toBe(false)
  })
})
