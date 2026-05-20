import type { Month, Season } from '@/types'

export type SeasonKey = 'vinter' | 'var' | 'sommar' | 'host'

const MONTH_LABELS: Record<Month, string> = {
  januari: 'januari',
  februari: 'februari',
  mars: 'mars',
  april: 'april',
  maj: 'maj',
  juni: 'juni',
  juli: 'juli',
  augusti: 'augusti',
  september: 'september',
  oktober: 'oktober',
  november: 'november',
  december: 'december',
}

export const ALL_MONTHS: readonly Month[] = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december',
]

export const SEASON_OPTIONS: readonly {
  key: SeasonKey
  label: string
  months: readonly Month[]
}[] = [
  { key: 'vinter', label: 'Vinter', months: ['december', 'januari', 'februari'] },
  { key: 'var', label: 'Vår', months: ['mars', 'april', 'maj'] },
  { key: 'sommar', label: 'Sommar', months: ['juni', 'juli', 'augusti'] },
  { key: 'host', label: 'Höst', months: ['september', 'oktober', 'november'] },
]

const MONTH_INDEX: Record<Month, number> = Object.fromEntries(
  ALL_MONTHS.map((m, i) => [m, i]),
) as Record<Month, number>

export function formatSeason(season: Season): string {
  if (season === 'year-round') return 'Året runt'
  const from = MONTH_LABELS[season.from]
  const to = MONTH_LABELS[season.to]
  return `${from.charAt(0).toUpperCase() + from.slice(1)} till ${to}`
}

export function formatMonth(month: Month): string {
  return MONTH_LABELS[month]
}

export function formatSeasonKey(key: SeasonKey): string {
  return SEASON_OPTIONS.find((option) => option.key === key)?.label ?? key
}

export function expandSeasonKeys(keys: readonly SeasonKey[]): Month[] {
  const months = new Set<Month>()

  for (const option of SEASON_OPTIONS) {
    if (keys.includes(option.key)) {
      for (const month of option.months) {
        months.add(month)
      }
    }
  }

  return ALL_MONTHS.filter((month) => months.has(month))
}

export function getSelectedSeasonKeys(months: readonly Month[]): SeasonKey[] {
  return SEASON_OPTIONS
    .filter((option) => option.months.every((month) => months.includes(month)))
    .map((option) => option.key)
}

/** True if the given month falls inside the season (handles wrap-around). */
export function seasonCoversMonth(season: Season | undefined, month: Month): boolean {
  if (!season) return true
  if (season === 'year-round') return true
  const from = MONTH_INDEX[season.from]
  const to = MONTH_INDEX[season.to]
  const m = MONTH_INDEX[month]
  if (from <= to) {
    return m >= from && m <= to
  }
  // Wrap-around (e.g. november → februari).
  return m >= from || m <= to
}

/** True if any of the requested months is covered by the season. */
export function seasonCoversAnyMonth(season: Season | undefined, months: readonly Month[]): boolean {
  if (months.length === 0) return true
  return months.some((m) => seasonCoversMonth(season, m))
}

/** Month for the current date (in the local time zone). */
export function currentMonth(now: Date = new Date()): Month {
  return ALL_MONTHS[now.getMonth()]!
}
