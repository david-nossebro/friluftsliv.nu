'use client'

import { cn } from '@/lib/utils'
import type { ExploreTab } from '@/types'
import { exploreTabs } from './exploreTabs'

export interface ExploreFiltersProps {
  activeTab?: ExploreTab
  onTabChange?: (tab: ExploreTab) => void
  className?: string
}

export function ExploreFilters({
  activeTab = 'alla',
  onTabChange,
  className,
}: ExploreFiltersProps) {
  return (
    <div className={cn('bg-white border-b border-mist-dark', className)}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="overflow-x-auto">
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
      </div>
    </div>
  )
}
