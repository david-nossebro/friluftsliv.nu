'use client'

import * as React from 'react'
import type { ReactNode } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HeaderSearchAdapter } from '@/components/search/HeaderSearchAdapter'
import { MapSidebar, type MapSidebarProps } from '@/components/map/MapSidebar'

export interface MapLayoutProps {
  /** Sidebar configuration. Filter state is owned externally — pass controlled props. */
  sidebarProps?: MapSidebarProps
  /** Map content rendered as the main area. */
  mapSlot?: ReactNode
  className?: string
}

export function MapLayout({ sidebarProps, mapSlot, className }: MapLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className={cn('h-screen flex flex-col overflow-hidden', className)}>
      <HeaderSearchAdapter currentPath="/karta" />
      <div className="flex flex-1 overflow-hidden">
        <MapSidebar
          {...sidebarProps}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div
          className={cn(
            'relative flex-1 flex',
            !mapSlot && 'bg-gradient-to-br from-mist via-birch-pale to-sky/30 items-center justify-center',
          )}
          aria-label="Kartvy"
        >
          {mapSlot ?? (
            <p className="font-body text-stone text-sm">Karta laddas...</p>
          )}

          {/* Mobile filter toggle button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Öppna filter"
            className={cn(
              'md:hidden absolute bottom-6 left-4 z-[1100]',
              'flex items-center gap-2 bg-white text-pine shadow-md',
              'rounded-full px-4 py-2.5 text-sm font-body font-medium',
              'ring-1 ring-inset ring-birch',
              'transition-colors hover:bg-mist active:bg-mist',
            )}
          >
            <SlidersHorizontal size={15} strokeWidth={1.5} />
            Filter
          </button>
        </div>
      </div>
    </div>
  )
}
