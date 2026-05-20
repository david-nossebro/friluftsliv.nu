import type { HikeType } from '@/types'

export const HIKE_TYPE_LABELS: Record<HikeType, string> = {
  vandring: 'Vandring',
  fjallvandring: 'Fjällvandring',
  langvandring: 'Långvandring',
}

export const ALL_HIKE_TYPES: readonly HikeType[] = ['vandring', 'fjallvandring', 'langvandring']

export function formatHikeType(ht: HikeType): string {
  return HIKE_TYPE_LABELS[ht]
}
