import {
  Flame,
  Utensils,
  Bath,
  ShoppingBag,
  Wifi,
  Coffee,
  Compass,
  Mountain,
  Trees,
  Bike,
  BedDouble,
  Users,
  Dog,
  MapPinned,
  Footprints,
  Home,
  type LucideIcon,
} from 'lucide-react'
import type { FacilityItem } from '@/components/molecules/FacilityGrid'

const facilityIconMap: Record<string, LucideIcon> = {
  vedspis: Flame,
  kök: Utensils,
  köksutrustning: Utensils,
  restaurang: Utensils,
  frukostsal: Coffee,
  café: Coffee,
  bastu: Bath,
  proviantförsäljning: ShoppingBag,
  wifi: Wifi,
  glaciärguide: Mountain,
  guideservice: Compass,
  trädgård: Trees,
  cykeluthyrning: Bike,
  sängplatser: BedDouble,
}

const suitableIconMap: Record<string, LucideIcon> = {
  familjer: Users,
  hund: Dog,
  vandrare: Footprints,
  fjällvandrare: Footprints,
  toppbestigning: Mountain,
  glaciärbestigning: Mountain,
  dagsvandring: Footprints,
  kungsleden: MapPinned,
}

function findIcon(text: string, map: Record<string, LucideIcon>): LucideIcon {
  const lower = text.toLowerCase()
  for (const key of Object.keys(map)) {
    if (lower.includes(key)) return map[key]
  }
  return Home
}

export function toFacilityItems(items: string[]): FacilityItem[] {
  return items.map((label) => ({
    label,
    icon: findIcon(label, facilityIconMap),
  }))
}

export function toSuitableForItems(items: string[]): FacilityItem[] {
  return items.map((label) => ({
    label,
    icon: findIcon(label, suitableIconMap),
  }))
}
