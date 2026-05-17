import type { RouteShape } from '@/types'

export const ROUTE_SHAPE_LABELS: Record<RouteShape, string> = {
  roundtrip: 'Rundtur',
  'out-and-back': 'Tur och retur',
  'point-to-point': 'Enkelväg',
}

export const ROUTE_SHAPE_HINTS: Record<RouteShape, string> = {
  roundtrip: 'Startar och slutar på samma plats.',
  'out-and-back': 'Samma led tillbaka.',
  'point-to-point': 'Olika start- och slutpunkt — logistik behövs.',
}

export const ALL_ROUTE_SHAPES: readonly RouteShape[] = ['roundtrip', 'out-and-back', 'point-to-point']

export function formatRouteShape(shape: RouteShape): string {
  return ROUTE_SHAPE_LABELS[shape]
}

/** Backfill helper for legacy data that only has `isRoundTrip`. */
export function inferRouteShape(isRoundTrip: boolean | undefined): RouteShape {
  return isRoundTrip ? 'roundtrip' : 'point-to-point'
}
