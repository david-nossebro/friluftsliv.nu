'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import type { ExploreTab } from '@/types'
import { exploreTabs } from './exploreTabs'

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

  React.useEffect(() => {
    setQuery(searchQuery)
  }, [searchQuery])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    onSearchChange?.(e.target.value)
  }

  return (
    <div className={cn('bg-white border-b border-mist-dark', className)}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="md:hidden py-2.5 border-b border-mist-dark">
          <label htmlFor={mobileSearchId} className="sr-only">
            Sök stuga, tur eller område
          </label>
          <Input
            id={mobileSearchId}
            variant="search"
            inputSize="sm"
            placeholder="Sök stuga, tur eller område…"
            value={query}
            onChange={handleSearch}
            onClear={() => {
              setQuery('')
              onSearchChange?.('')
            }}
          />
        </div>

        <div className="flex items-end gap-4 md:gap-6">
          <div className="flex-1 overflow-x-auto">
            <div
              role="group"
              aria-label="Filtrera innehåll"
              className="flex items-end gap-0 -mb-px min-w-max"
            >
              {exploreTabs.map((tab) => (
                <button
                  type="button"
                  key={tab.value}
                  aria-pressed={activeTab === tab.value}
                  onClick={() => onTabChange?.(tab.value)}
                  className={cn(
                    'px-5 py-4 font-body text-sm font-medium border-b-2 whitespace-nowrap',
                    'transition-all duration-[120ms] focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-moss',
                    activeTab === tab.value
                      ? 'border-pine text-pine'
                      : 'border-transparent text-stone hover:text-ink hover:border-mist-dark'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block pb-2 w-64 shrink-0">
            <label htmlFor={desktopSearchId} className="sr-only">
              Sök stuga, tur eller område
            </label>
            <Input
              id={desktopSearchId}
              variant="search"
              inputSize="sm"
              placeholder="Sök stuga, tur eller område…"
              value={query}
              onChange={handleSearch}
              onClear={() => {
                setQuery('')
                onSearchChange?.('')
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
