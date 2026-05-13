'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/atoms/Input'

export type ExploreTab = 'alla' | 'rutter' | 'stugor' | 'omraden'

const tabs: { value: ExploreTab; label: string }[] = [
  { value: 'alla',    label: 'Alla' },
  { value: 'rutter',  label: 'Rutter' },
  { value: 'stugor',  label: 'Stugor' },
  { value: 'omraden', label: 'Områden' },
]

export interface ExploreFiltersProps {
  activeTab?: ExploreTab
  onTabChange?: (tab: ExploreTab) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  className?: string
}

export function ExploreFilters({
  activeTab = 'alla',
  onTabChange,
  searchQuery = '',
  onSearchChange,
  className,
}: ExploreFiltersProps) {
  const mobileSearchId = React.useId()
  const desktopSearchId = React.useId()
  const [query, setQuery] = React.useState(searchQuery)

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    onSearchChange?.(e.target.value)
  }

  return (
    <div className={cn('bg-white border-b border-mist-dark', className)}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Search — mobile only, stacked above tabs */}
        <div className="md:hidden py-2.5 border-b border-mist-dark">
          <label htmlFor={mobileSearchId} className="sr-only">
            Sök bland innehållet
          </label>
          <Input
            id={mobileSearchId}
            variant="search"
            inputSize="sm"
            placeholder="Sök bland innehållet..."
            value={query}
            onChange={handleSearch}
            onClear={() => { setQuery(''); onSearchChange?.('') }}
          />
        </div>

        {/* Tabs + desktop search */}
        <div
          role="group"
          aria-label="Filtrera innehåll"
          className="flex items-end gap-0 -mb-px"
        >
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.value}
              aria-pressed={activeTab === tab.value}
              onClick={() => onTabChange?.(tab.value)}
              className={cn(
                'px-5 py-4 font-body text-sm font-medium border-b-2',
                'transition-all duration-[120ms] focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-moss',
                activeTab === tab.value
                  ? 'border-pine text-pine'
                  : 'border-transparent text-stone hover:text-ink hover:border-mist-dark'
              )}
            >
              {tab.label}
            </button>
          ))}

          {/* Search — desktop only, inline */}
          <div className="hidden md:block ml-auto pb-2 w-64">
            <label htmlFor={desktopSearchId} className="sr-only">
              Sök bland innehållet
            </label>
            <Input
              id={desktopSearchId}
              variant="search"
              inputSize="sm"
              placeholder="Sök bland innehållet..."
              value={query}
              onChange={handleSearch}
              onClear={() => { setQuery(''); onSearchChange?.('') }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
