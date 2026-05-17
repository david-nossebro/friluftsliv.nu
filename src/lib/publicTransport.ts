import type { PublicTransport, PublicTransportMode } from '@/types'

export const PUBLIC_TRANSPORT_LABELS: Record<PublicTransportMode, string> = {
  reachable: 'Når du med kollektivtrafik',
  partial: 'Delvis med kollektivtrafik',
  none: 'Kräver bil',
}

export const PUBLIC_TRANSPORT_SHORT: Record<PublicTransportMode, string> = {
  reachable: 'Kollektivt',
  partial: 'Delvis kollektivt',
  none: 'Bil krävs',
}

export function formatPublicTransport(pt: PublicTransport): string {
  const base = PUBLIC_TRANSPORT_LABELS[pt.mode]
  if (pt.lines && pt.lines.length > 0) {
    return `${base} (${pt.lines.join(', ')})`
  }
  return base
}
