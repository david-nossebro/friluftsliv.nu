import type { ExploreTab } from '@/types'

export const exploreTabs: { value: ExploreTab; label: string }[] = [
  { value: 'alla', label: 'Alla' },
  { value: 'vandring', label: 'Vandring' },
  { value: 'fjallvandring', label: 'Fjällvandring' },
  { value: 'langvandring', label: 'Långvandring' },
  { value: 'kanotleder', label: 'Kanotleder' },
  { value: 'skidturer', label: 'Skidturer' },
  { value: 'stugor', label: 'Stugor' },
  { value: 'nationalparker', label: 'Nationalparker' },
  { value: 'naturreservat', label: 'Naturreservat' },
]

export const allExploreSections = exploreTabs.filter((tab) => tab.value !== 'alla')
