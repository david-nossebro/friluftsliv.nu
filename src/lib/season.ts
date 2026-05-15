import type { Month, Season } from '@/types'

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

export function formatSeason(season: Season): string {
  if (season === 'year-round') return 'Året runt'
  const from = MONTH_LABELS[season.from]
  const to = MONTH_LABELS[season.to]
  return `${from.charAt(0).toUpperCase() + from.slice(1)} till ${to}`
}
