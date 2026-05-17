import { describe, it, expect } from 'vitest'
import {
  type FilterState,
  applyFilters,
  countActiveFilters,
  defaultFilterState,
  parseFilters,
  serializeFilters,
} from './exploreFilters'
import type { AreaListItem, Cabin, Difficulty, LongHike, Route, Utflykt } from '@/types'

function withOverrides(partial: Partial<FilterState>): FilterState {
  return { ...defaultFilterState, ...partial }
}

describe('exploreFilters — serde', () => {
  it('round-trips the default state to an empty querystring', () => {
    const params = serializeFilters(defaultFilterState)
    expect(params.toString()).toBe('')
    const parsed = parseFilters(params)
    expect(parsed).toEqual(defaultFilterState)
  })

  it('serializes only non-default fields', () => {
    const params = serializeFilters(
      withOverrides({
        query: 'abisko',
        tab: 'vandring',
        difficulty: ['easy', 'medium'],
        distanceMinKm: 5,
        distanceMaxKm: 100,
        dogsAllowed: true,
        landskap: ['lappland'],
        months: ['juni'],
      }),
    )
    expect(params.get('q')).toBe('abisko')
    expect(params.get('tab')).toBe('vandring')
    expect(params.get('d')).toBe('easy,medium')
    expect(params.get('dmin')).toBe('5')
    expect(params.get('dmax')).toBe('100')
    expect(params.get('dog')).toBe('1')
    expect(params.get('l')).toBe('lappland')
    expect(params.get('m')).toBe('juni')
    expect(params.get('rs')).toBeNull()
  })

  it('parses durationUnit "d" as days', () => {
    const parsed = parseFilters(new URLSearchParams('du=d&tmax=4'))
    expect(parsed.durationUnit).toBe('days')
    expect(parsed.durationMax).toBe(4)
  })

  it('ignores unknown values gracefully', () => {
    const parsed = parseFilters(new URLSearchParams('d=easy,bogus,hard&rs=garbage'))
    expect(parsed.difficulty).toEqual<Difficulty[]>(['easy', 'hard'])
    expect(parsed.routeShape).toBeNull()
    expect(parsed.publicTransport).toBe(false)
  })

  it('publicTransport boolean URL serde: pt=1 ⇄ true', () => {
    expect(serializeFilters(withOverrides({ publicTransport: true })).get('pt')).toBe('1')
    expect(parseFilters(new URLSearchParams('pt=1')).publicTransport).toBe(true)
    expect(parseFilters(new URLSearchParams('')).publicTransport).toBe(false)
  })

  it('back-compat: legacy ?q=...&tab=... URLs decode cleanly', () => {
    const parsed = parseFilters(new URLSearchParams('q=lappland&tab=stugor'))
    expect(parsed.query).toBe('lappland')
    expect(parsed.tab).toBe('stugor')
    expect(countActiveFilters(parsed)).toBe(0)
  })
})

describe('countActiveFilters', () => {
  it('counts only structured filters, not query/tab', () => {
    expect(countActiveFilters(defaultFilterState)).toBe(0)
    expect(countActiveFilters(withOverrides({ query: 'x', tab: 'vandring' }))).toBe(0)
    expect(countActiveFilters(withOverrides({ difficulty: ['easy'] }))).toBe(1)
    expect(countActiveFilters(withOverrides({ difficulty: ['easy'], dogsAllowed: true, landskap: ['skane'] }))).toBe(3)
  })
})

describe('applyFilters', () => {
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
  const longHikes: LongHike[] = []

  it('returns everything unchanged for the default state', () => {
    const result = applyFilters({
      state: defaultFilterState,
      areas: [areaListItem],
      utflykter: [utflykt],
      routes: [route, hardRoute],
      longHikes,
      cabins: [cabin],
    })
    expect(result.count).toBe(5)
    expect(result.routes).toHaveLength(2)
  })

  it('AND-composes filters (difficulty + landskap)', () => {
    const result = applyFilters({
      state: withOverrides({ difficulty: ['easy'], landskap: ['skane'] }),
      areas: [areaListItem],
      utflykter: [utflykt],
      routes: [route, hardRoute],
      longHikes,
      cabins: [cabin],
    })
    expect(result.routes).toHaveLength(1)
    expect(result.routes[0]!.id).toBe('r1')
  })

  it('distance range bounds work both ways', () => {
    const minOnly = applyFilters({
      state: withOverrides({ distanceMinKm: 50 }),
      areas: [], utflykter: [], routes: [route, hardRoute], longHikes, cabins: [],
    })
    expect(minOnly.routes.map((r) => r.id)).toEqual(['r2'])

    const maxOnly = applyFilters({
      state: withOverrides({ distanceMaxKm: 50 }),
      areas: [], utflykter: [], routes: [route, hardRoute], longHikes, cabins: [],
    })
    expect(maxOnly.routes.map((r) => r.id)).toEqual(['r1'])
  })

  it('cabin facilities require ALL of the selected facilities', () => {
    const both = applyFilters({
      state: withOverrides({ cabinFacilities: ['bastu', 'koksutrustning'] }),
      areas: [], utflykter: [], routes: [], longHikes, cabins: [cabin],
    })
    expect(both.cabins).toHaveLength(1)

    const missing = applyFilters({
      state: withOverrides({ cabinFacilities: ['bastu', 'restaurang'] }),
      areas: [], utflykter: [], routes: [], longHikes, cabins: [cabin],
    })
    expect(missing.cabins).toHaveLength(0)
  })

  it('hasCabinsAlong only keeps routes with cabinIds', () => {
    const result = applyFilters({
      state: withOverrides({ hasCabinsAlong: true }),
      areas: [], utflykter: [], routes: [route, hardRoute], longHikes, cabins: [],
    })
    expect(result.routes.map((r) => r.id)).toEqual(['r2'])
  })

  it('publicTransport=true filters to reachable+partial items only', () => {
    const partialRoute: Route = {
      ...route,
      id: 'r-partial',
      publicTransport: { mode: 'partial' },
    }
    const result = applyFilters({
      state: withOverrides({ publicTransport: true }),
      areas: [], utflykter: [utflykt], routes: [partialRoute, hardRoute], longHikes, cabins: [cabin],
    })
    // The bil-krävs route is excluded; partial + reachable items pass.
    expect(result.routes.map((r) => r.id)).toEqual(['r-partial'])
    expect(result.cabins).toHaveLength(1)
    expect(result.utflykter).toHaveLength(1)
  })

  it('selectedKommun (empty) lets every item through; non-empty acts as inclusion filter', () => {
    const all = applyFilters({
      state: withOverrides({ landskap: ['skane'], selectedKommun: [] }),
      areas: [areaListItem], utflykter: [utflykt], routes: [route], longHikes, cabins: [cabin],
    })
    // Empty selectedKommun = "Alla" → everything in scope still passes.
    expect(all.routes).toHaveLength(1)
    expect(all.cabins).toHaveLength(1)

    const onlyKlippan = applyFilters({
      state: withOverrides({ landskap: ['skane'], selectedKommun: ['Svalöv'] }),
      areas: [areaListItem], utflykter: [utflykt], routes: [route], longHikes, cabins: [cabin],
    })
    // Items with kommun=Klippan should be excluded; Svalöv is the only included kommun.
    expect(onlyKlippan.routes).toHaveLength(0)
    expect(onlyKlippan.cabins).toHaveLength(0)
  })

  it('Nära mig with origin filters by haversine distance', () => {
    const stockholm = { lat: 59.3293, lng: 18.0686 }
    const result = applyFilters({
      state: withOverrides({ nearMe: true, nearMeRadiusKm: 100 }),
      origin: stockholm,
      areas: [areaListItem], utflykter: [], routes: [], longHikes, cabins: [],
    })
    // Söderåsen is far from Stockholm → excluded.
    expect(result.areas).toHaveLength(0)
  })
})
