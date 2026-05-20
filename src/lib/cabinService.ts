import type { CabinServiceType } from '@/types'

export const CABIN_SERVICE_LABELS: Record<CabinServiceType, string> = {
  betjänad: 'Betjänad',
  självhushåll: 'Självhushåll',
  obetjänad: 'Obetjänad',
}

export const ALL_CABIN_SERVICE_TYPES: readonly CabinServiceType[] = ['betjänad', 'självhushåll', 'obetjänad']

export function formatCabinServiceType(t: CabinServiceType): string {
  return CABIN_SERVICE_LABELS[t]
}
