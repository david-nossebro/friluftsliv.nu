import type { Metadata } from 'next'
import { MapView } from '@/components/organisms/MapView'
import { getMapFeatureLayers } from '@/data'

export const metadata: Metadata = {
  title: 'Karta',
  description: 'Utforska Sveriges rutter och stugor på en interaktiv karta.',
}

export default function MapPage() {
  return <MapView featureLayers={getMapFeatureLayers()} />
}
