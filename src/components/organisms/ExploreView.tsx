'use client'

import * as React from 'react'
import { ExploreFilters, type ExploreTab } from './ExploreFilters'
import { ExploreGrid, type ExploreItem } from './ExploreGrid'

export interface ExploreViewProps {
  items: ExploreItem[]
  initialQuery?: string
  initialTab?: ExploreTab
  className?: string
}

function matchesTab(item: ExploreItem, tab: ExploreTab): boolean {
  if (tab === 'alla') return true
  if (tab === 'rutter') return item.kind === 'route'
  if (tab === 'stugor') return item.kind === 'cabin'
  if (tab === 'omraden') return item.kind === 'area'
  return true
}

function matchesQuery(item: ExploreItem, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  const title = item.data.title.toLowerCase()
  if (title.includes(q)) return true
  if (item.kind !== 'area') {
    const region = item.data.region.toLowerCase()
    if (region.includes(q)) return true
  }
  return false
}

export function ExploreView({
  items,
  initialQuery = '',
  initialTab = 'alla',
  className,
}: ExploreViewProps) {
  const [tab, setTab] = React.useState<ExploreTab>(initialTab)
  const [query, setQuery] = React.useState(initialQuery)

  const filtered = React.useMemo(
    () => items.filter((item) => matchesTab(item, tab) && matchesQuery(item, query)),
    [items, tab, query],
  )

  return (
    <div className={className}>
      <ExploreFilters
        activeTab={tab}
        onTabChange={setTab}
        searchQuery={query}
        onSearchChange={setQuery}
      />
      <ExploreGrid items={filtered} />
    </div>
  )
}
