import {
  Flame, Utensils, Bath, ShoppingBag, Wifi, Coffee, Compass,
  Zap, Droplet, Toilet, ShowerHead, Users, type LucideIcon,
} from 'lucide-react'
import type { Facility } from '@/types'

export const FACILITY_LABELS: Record<Facility, string> = {
  vedspis: 'Vedspis',
  koksutrustning: 'Köksutrustning',
  restaurang: 'Restaurang',
  cafe: 'Café',
  bastu: 'Bastu',
  proviantforsaljning: 'Proviantförsäljning',
  wifi: 'Wifi',
  el: 'El',
  vatten: 'Rinnande vatten',
  utedass: 'Utedass',
  torrtoalett: 'Torrtoalett',
  dusch: 'Dusch',
  guideservice: 'Guideservice',
  familjevanlig: 'Familjevänlig',
}

export const FACILITY_ICONS: Record<Facility, LucideIcon> = {
  vedspis: Flame,
  koksutrustning: Utensils,
  restaurang: Utensils,
  cafe: Coffee,
  bastu: Bath,
  proviantforsaljning: ShoppingBag,
  wifi: Wifi,
  el: Zap,
  vatten: Droplet,
  utedass: Toilet,
  torrtoalett: Toilet,
  dusch: ShowerHead,
  guideservice: Compass,
  familjevanlig: Users,
}

export const ALL_FACILITIES: readonly Facility[] = Object.keys(FACILITY_LABELS) as Facility[]

export function formatFacility(f: Facility): string {
  return FACILITY_LABELS[f]
}
