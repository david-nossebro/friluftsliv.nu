'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { MapLayer } from '@/types'

// ─── Layer icons (SVG glyphs, brand-consistent) ───────────────────────────────

/** Small inline SVG that visually communicates each map style */
function LayerGlyph({ layerId }: { layerId: string }) {
  if (layerId === 'topo') {
    // Topographic contour lines
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <ellipse cx="8" cy="9" rx="6" ry="3" stroke="currentColor" strokeWidth="1.2" />
        <ellipse cx="8" cy="9" rx="4" ry="2" stroke="currentColor" strokeWidth="1.2" />
        <ellipse cx="8" cy="9" rx="2" ry="1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    )
  }
  if (layerId === 'satellite') {
    // Satellite grid
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="5" height="5" fill="currentColor" opacity="0.7" rx="0.5" />
        <rect x="9" y="2" width="5" height="5" fill="currentColor" opacity="0.4" rx="0.5" />
        <rect x="2" y="9" width="5" height="5" fill="currentColor" opacity="0.4" rx="0.5" />
        <rect x="9" y="9" width="5" height="5" fill="currentColor" opacity="0.7" rx="0.5" />
      </svg>
    )
  }
  // Default / OSM: road-style icon
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 14 L8 3 L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9 L11 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MapLayerToggleProps {
  layers: MapLayer[]
  activeLayerId: string
  onLayerChange: (layerId: string) => void
  className?: string
}

const FALLBACK_LAYER: MapLayer = {
  id: 'osm',
  label: 'Karta',
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  previewColor: '#EFF4EC',
  maxZoom: 19,
}

function getLayerById(layers: MapLayer[], activeLayerId: string) {
  return layers.find((layer) => layer.id === activeLayerId) ?? layers[0] ?? FALLBACK_LAYER
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MapLayerToggle({
  layers,
  activeLayerId,
  onLayerChange,
  className,
}: MapLayerToggleProps) {
  const panelId = React.useId()
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([])
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const activeLayer = getLayerById(layers, activeLayerId)

  // Collapse on outside click
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!isExpanded) return
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsExpanded(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isExpanded])

  React.useEffect(() => {
    if (!isExpanded) {
      return
    }

    const activeIndex = Math.max(layers.findIndex((layer) => layer.id === activeLayerId), 0)
    optionRefs.current[activeIndex]?.focus()
  }, [activeLayerId, isExpanded, layers])

  function closeOptions() {
    setIsExpanded(false)
    requestAnimationFrame(() => {
      triggerRef.current?.focus()
    })
  }

  function selectOption(index: number) {
    if (layers.length === 0) {
      onLayerChange(FALLBACK_LAYER.id)
      return
    }

    const nextIndex = (index + layers.length) % layers.length
    const nextLayer = layers[nextIndex] ?? FALLBACK_LAYER
    onLayerChange(nextLayer.id)
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* Expanded panel */}
      {isExpanded && (
        <div
          id={panelId}
          className={cn(
            'absolute top-0 right-0',
            'bg-white/95 backdrop-blur-sm rounded-lg border border-mist-dark',
            'shadow-md p-1.5 flex flex-col gap-1',
            'min-w-[120px]',
          )}
          role="radiogroup"
          aria-label="Välj karttyp"
        >
          {layers.map((layer, index) => {
            const isActive = layer.id === activeLayerId
            return (
              <button
                ref={(element) => {
                  optionRefs.current[index] = element
                }}
                key={layer.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  onLayerChange(layer.id)
                  closeOptions()
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                    event.preventDefault()
                    selectOption(index + 1)
                    return
                  }

                  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                    event.preventDefault()
                    selectOption(index - 1)
                    return
                  }

                  if (event.key === 'Home') {
                    event.preventDefault()
                    selectOption(0)
                    return
                  }

                  if (event.key === 'End') {
                    event.preventDefault()
                    selectOption(layers.length - 1)
                    return
                  }

                  if (event.key === 'Escape') {
                    event.preventDefault()
                    closeOptions()
                  }
                }}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md w-full text-left',
                  'font-body text-xs font-medium transition-colors duration-[120ms]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss',
                  isActive
                    ? 'bg-pine text-snow'
                    : 'text-ink-soft hover:bg-mist hover:text-pine',
                )}
              >
                <LayerGlyph layerId={layer.id} />
                {layer.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Collapsed trigger button */}
      {!isExpanded && (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsExpanded(true)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setIsExpanded(true)
            }
          }}
          aria-label={`Karttyp: ${activeLayer.label}. Klicka för att byta`}
          aria-controls={panelId}
          aria-expanded={isExpanded}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg',
            'bg-white/95 backdrop-blur-sm border border-mist-dark shadow-md',
            'font-body text-xs font-medium text-ink-soft',
            'hover:bg-mist hover:text-pine transition-colors duration-[120ms]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss',
          )}
        >
          <LayerGlyph layerId={activeLayer.id} />
          {/* Show label on sm+ screens */}
          <span className="hidden sm:inline">{activeLayer.label}</span>
        </button>
      )}
    </div>
  )
}
