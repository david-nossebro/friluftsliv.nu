'use client'

import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ExploreTab } from '@/types'
import { exploreTabs, getExploreTabLabel } from './exploreTabs'

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
  const [isMobilePanelOpen, setIsMobilePanelOpen] = React.useState(false)
  const [tabsFit, setTabsFit] = React.useState<boolean | null>(null)
  const measureContainerRef = React.useRef<HTMLDivElement | null>(null)
  const measureRowRef = React.useRef<HTMLDivElement | null>(null)
  const panelId = React.useId()
  const activeTabLabel = getExploreTabLabel(activeTab)
  const showDisclosure = tabsFit !== true

  const updateTabsFit = React.useCallback(() => {
    const containerElement = measureContainerRef.current
    const rowElement = measureRowRef.current

    if (!containerElement || !rowElement) {
      return
    }

    const containerWidth = containerElement.getBoundingClientRect().width
    const rowWidth = rowElement.getBoundingClientRect().width
    const nextTabsFit = rowWidth <= containerWidth + 1

    setTabsFit((currentTabsFit) => (currentTabsFit === nextTabsFit ? currentTabsFit : nextTabsFit))
  }, [])

  React.useEffect(() => {
    setIsMobilePanelOpen(false)
  }, [activeTab])

  React.useEffect(() => {
    if (tabsFit) {
      setIsMobilePanelOpen(false)
    }
  }, [tabsFit])

  React.useEffect(() => {
    let frameId = 0
    let isCancelled = false

    const scheduleUpdate = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => {
        updateTabsFit()
      })
    }

    scheduleUpdate()

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        scheduleUpdate()
      })

      if (measureContainerRef.current) {
        resizeObserver.observe(measureContainerRef.current)
      }

      if (measureRowRef.current) {
        resizeObserver.observe(measureRowRef.current)
      }

      window.addEventListener('orientationchange', scheduleUpdate)

      if (typeof document !== 'undefined') {
        document.fonts.ready.then(() => {
          if (!isCancelled) {
            scheduleUpdate()
          }
        })
      }

      return () => {
        isCancelled = true
        cancelAnimationFrame(frameId)
        window.removeEventListener('orientationchange', scheduleUpdate)
        resizeObserver.disconnect()
      }
    }

    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('orientationchange', scheduleUpdate)

    return () => {
      isCancelled = true
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('orientationchange', scheduleUpdate)
    }
  }, [updateTabsFit])

  function handleTabSelect(tab: ExploreTab) {
    onTabChange?.(tab)
    setIsMobilePanelOpen(false)
  }

  return (
    <div className={cn('bg-white border-b border-mist-dark', className)}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div ref={measureContainerRef} className="relative py-3">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-3 overflow-hidden invisible"
          >
            <div ref={measureRowRef} className="flex w-max items-end gap-0 -mb-px">
              {exploreTabs.map((tab) => (
                <button
                  type="button"
                  key={tab.value}
                  tabIndex={-1}
                  className="px-5 py-4 font-body text-sm font-medium border-b-2 whitespace-nowrap"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {showDisclosure ? (
            <div>
              <button
                type="button"
                aria-expanded={isMobilePanelOpen}
                aria-controls={panelId}
                onClick={() => setIsMobilePanelOpen((open) => !open)}
                className={cn(
                  'flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-mist-dark bg-snow px-4 py-3 text-left',
                  'transition-colors duration-[120ms] hover:bg-mist',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-1',
                )}
              >
                <span className="font-body text-sm font-medium text-ink">
                  <span className="text-stone">Kategori:</span> {activeTabLabel}
                </span>
                <ChevronDown
                  size={18}
                  strokeWidth={1.8}
                  aria-hidden="true"
                  className={cn(
                    'shrink-0 text-stone transition-transform duration-[120ms]',
                    isMobilePanelOpen && 'rotate-180 text-pine',
                  )}
                />
              </button>

              {isMobilePanelOpen && (
                <div
                  id={panelId}
                  role="group"
                  aria-label="Välj kategori"
                  className="mt-2 overflow-hidden rounded-xl border border-mist-dark bg-white"
                >
                  {exploreTabs.map((tab, index) => {
                    const isActive = activeTab === tab.value

                    return (
                      <button
                        type="button"
                        key={tab.value}
                        aria-pressed={isActive}
                        onClick={() => handleTabSelect(tab.value)}
                        className={cn(
                          'flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left font-body text-base font-medium',
                          'transition-colors duration-[120ms]',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-moss',
                          index > 0 && 'border-t border-mist-dark',
                          isActive ? 'bg-mist text-pine' : 'text-ink hover:bg-mist hover:text-pine',
                        )}
                      >
                        <span>{tab.label}</span>
                        {isActive && <Check size={16} strokeWidth={1.8} aria-hidden="true" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-hidden">
              <div
                role="group"
                aria-label="Filtrera innehåll"
                className="flex items-end gap-0 -mb-px"
              >
                {exploreTabs.map((tab) => (
                  <button
                    type="button"
                    key={tab.value}
                    aria-pressed={activeTab === tab.value}
                    onClick={() => handleTabSelect(tab.value)}
                    className={cn(
                      'px-5 py-4 font-body text-sm font-medium border-b-2 whitespace-nowrap',
                      'transition-all duration-[120ms] focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-moss',
                      activeTab === tab.value
                        ? 'border-pine text-pine'
                        : 'border-transparent text-stone hover:text-ink hover:border-mist-dark',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
