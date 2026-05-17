import type { Landskap } from '@/types'

export const LANDSKAP_LABELS: Record<Landskap, string> = {
  skane: 'Skåne',
  blekinge: 'Blekinge',
  halland: 'Halland',
  smaland: 'Småland',
  oland: 'Öland',
  gotland: 'Gotland',
  vastergotland: 'Västergötland',
  bohuslan: 'Bohuslän',
  dalsland: 'Dalsland',
  ostergotland: 'Östergötland',
  sodermanland: 'Södermanland',
  narke: 'Närke',
  vastmanland: 'Västmanland',
  uppland: 'Uppland',
  varmland: 'Värmland',
  dalarna: 'Dalarna',
  gastrikland: 'Gästrikland',
  halsingland: 'Hälsingland',
  medelpad: 'Medelpad',
  angermanland: 'Ångermanland',
  jamtland: 'Jämtland',
  harjedalen: 'Härjedalen',
  vasterbotten: 'Västerbotten',
  norrbotten: 'Norrbotten',
  lappland: 'Lappland',
}

export type LandsdelKey = 'gotaland' | 'svealand' | 'norrland'

export const LANDSDEL_LABELS: Record<LandsdelKey, string> = {
  gotaland: 'Götaland',
  svealand: 'Svealand',
  norrland: 'Norrland',
}

/** Landskap grouped by landsdel — used by the LocationFilter UI. */
export const LANDSKAP_BY_LANDSDEL: Record<LandsdelKey, readonly Landskap[]> = {
  gotaland: [
    'skane', 'blekinge', 'halland', 'smaland', 'oland', 'gotland',
    'vastergotland', 'bohuslan', 'dalsland', 'ostergotland',
  ],
  svealand: [
    'sodermanland', 'narke', 'vastmanland', 'uppland', 'varmland', 'dalarna',
  ],
  norrland: [
    'gastrikland', 'halsingland', 'medelpad', 'angermanland',
    'jamtland', 'harjedalen', 'vasterbotten', 'norrbotten', 'lappland',
  ],
}

export const ALL_LANDSKAP: readonly Landskap[] = [
  ...LANDSKAP_BY_LANDSDEL.gotaland,
  ...LANDSKAP_BY_LANDSDEL.svealand,
  ...LANDSKAP_BY_LANDSDEL.norrland,
]

/** Same 25 landskap as ALL_LANDSKAP but sorted by Swedish-locale label. */
export const ALL_LANDSKAP_ALPHABETICAL: readonly Landskap[] = [...ALL_LANDSKAP].sort((a, b) =>
  LANDSKAP_LABELS[a].localeCompare(LANDSKAP_LABELS[b], 'sv'),
)

export function formatLandskap(l: Landskap): string {
  return LANDSKAP_LABELS[l]
}

export function formatLandskapList(landskap: readonly Landskap[]): string {
  if (landskap.length === 0) return ''
  if (landskap.length === 1) return formatLandskap(landskap[0]!)
  const labels = landskap.map(formatLandskap)
  return `${labels.slice(0, -1).join(', ')} och ${labels[labels.length - 1]}`
}
