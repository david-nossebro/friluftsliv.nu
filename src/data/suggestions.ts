import type { SearchSuggestion } from '@/types'
import { routes } from './routes'
import { cabins } from './cabins'
import { areas } from './areas'

const regions: SearchSuggestion[] = [
  { id: 'region-lappland', name: 'Lappland', type: 'region' },
  { id: 'region-jamtland', name: 'Jämtland', type: 'region' },
  { id: 'region-skane', name: 'Skåne', type: 'region' },
  { id: 'region-stockholm', name: 'Stockholms län', type: 'region' },
]

export const defaultSuggestions: SearchSuggestion[] = [
  ...routes.map<SearchSuggestion>((r) => ({
    id: `route-${r.id}`,
    name: r.title,
    type: 'route',
    distance: r.distance,
  })),
  ...cabins.map<SearchSuggestion>((c) => ({
    id: `cabin-${c.id}`,
    name: c.title,
    type: 'cabin',
  })),
  ...areas.map<SearchSuggestion>((a) => ({
    id: `area-${a.id}`,
    name: a.title,
    type: 'area',
  })),
  ...regions,
]
