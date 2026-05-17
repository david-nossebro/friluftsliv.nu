import type { ExploreTab } from '@/types'

export const exploreTabs: { value: ExploreTab; label: string }[] = [
  { value: 'alla', label: 'Alla' },
  { value: 'utflykter', label: 'Utflykter' },
  { value: 'vandring', label: 'Vandring' },
  { value: 'kanot', label: 'Kanot' },
  { value: 'skidturer', label: 'Skidturer' },
  { value: 'stugor', label: 'Stugor' },
  { value: 'nationalparker', label: 'Nationalparker' },
  { value: 'naturreservat', label: 'Naturreservat' },
]

const legacyExploreTabMap = {
  fjallvandring: 'vandring',
  langvandring: 'vandring',
  kanotleder: 'kanot',
} as const

export const validExploreTabs = exploreTabs.map((tab) => tab.value)

export function normalizeExploreTab(tab?: string): ExploreTab | undefined {
  if (!tab) return undefined

  const normalizedTab = legacyExploreTabMap[tab as keyof typeof legacyExploreTabMap] ?? tab

  return validExploreTabs.includes(normalizedTab as ExploreTab)
    ? (normalizedTab as ExploreTab)
    : undefined
}

export function getExploreTabLabel(tab: ExploreTab) {
  return exploreTabs.find((item) => item.value === tab)?.label ?? 'Alla'
}
