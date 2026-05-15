import { formatSeason } from '@/lib/season'
import type { RouteStat } from '@/components/sections/RouteStatGrid'
import type { LongHike, Season } from '@/types'

interface RouteLike {
  distance: number
  elevation: number
  duration: number
  season?: Season
  isRoundTrip?: boolean
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} h ${m} min` : `${h} h`
}

function formatDistance(km: number, isRoundTrip?: boolean): RouteStat {
  return {
    label: 'Distans',
    value: `${km} km`,
    ...(isRoundTrip !== undefined
      ? { sublabel: isRoundTrip ? 'Tur/retur' : 'Enkel väg' }
      : {}),
  }
}

/**
 * Stats shown for a single-day route or a single stage of a long hike.
 * Always returns 3–4 items so the grid stays balanced on desktop.
 */
export function buildRouteStats(route: RouteLike): RouteStat[] {
  const stats: RouteStat[] = [
    formatDistance(route.distance, route.isRoundTrip),
    { label: 'Höjdmeter', value: `${route.elevation} m` },
    { label: 'Tid', value: formatDuration(route.duration) },
  ]
  if (route.season) {
    stats.push({ label: 'Säsong', value: formatSeason(route.season) })
  }
  return stats
}

/**
 * Stats shown for a long hike — substitutes "Etapper" + "Dagar" for the
 * single-day duration so the totals make sense at a glance.
 */
export function buildLongHikeStats(
  longHike: LongHike,
  stageCount: number,
): RouteStat[] {
  const stats: RouteStat[] = [
    { label: 'Distans', value: `${longHike.distance} km` },
    {
      label: 'Tid',
      value: `${longHike.estimatedDays} dagar`,
      sublabel: `${Math.floor(longHike.duration / 60)} h gångtid`,
    },
    { label: 'Etapper', value: String(stageCount) },
  ]
  if (longHike.season) {
    stats.push({ label: 'Säsong', value: formatSeason(longHike.season) })
  }
  return stats
}
