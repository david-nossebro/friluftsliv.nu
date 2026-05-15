'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Maximize2, Minimize2 } from 'lucide-react'
import { useBodyScrollLock } from '@/lib/overlay'
import { cn } from '@/lib/utils'
import type { MapFeatureLayer, MapLayer, MapPosition } from '@/types'
import { DEFAULT_MAP_LAYERS } from '@/types'
import { MapLayerToggle } from './MapLayerToggle'

// Lazy-load Leaflet internals — never runs on the server
const MapInner = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

// ─── MapSkeleton ─────────────────────────────────────────────────────────────

function MapSkeleton() {
  return (
    <div
      className="w-full h-full flex items-center justify-center bg-mist animate-pulse"
      aria-hidden="true"
    >
      <svg
        className="opacity-10"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2C4A3E"
        strokeWidth="1.5"
      >
        <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    </div>
  )
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface LeafletMapProps {
  /** Initial map center. Defaults to Sweden's geographic center. */
  center?: MapPosition
  /** Initial zoom level. Defaults to 5 for country view. */
  zoom?: number
  /** Available tile layers. Defaults to DEFAULT_MAP_LAYERS. */
  layers?: MapLayer[]
  /** Controlled active tile layer ID. */
  activeLayerId?: string
  /** Called when the user switches tile layers. */
  onLayerChange?: (layerId: string) => void
  /** Feature datasets to render as markers. */
  featureLayers?: MapFeatureLayer[]
  /** Feature types that are currently visible. Undefined = show all. */
  activeFeatureTypes?: string[]
  /** Track polylines to render on the map. Each entry is one continuous track. */
  tracks?: MapPosition[][]
  /** Stroke color for rendered track polylines. Defaults to brand pine. */
  trackColor?: string
  /** Optional position rendered as a small overlay marker — used to sync with a chart cursor. */
  cursorPosition?: MapPosition
  /** Height of the map container. Defaults to '400px'. Accepts any CSS value. */
  height?: string
  /** Show the fullscreen expand/collapse button. Defaults to true. */
  showFullscreenToggle?: boolean
  /** Extra class names applied to the wrapper div. */
  className?: string
  /** Accessible label for the map region element. */
  'aria-label'?: string
}

/** Sweden's geographic center — sensible default for this product. */
export const SWEDEN_CENTER: MapPosition = { lat: 62.5, lng: 16.5 }

const FALLBACK_LAYER: MapLayer = {
  id: 'osm',
  label: 'Karta',
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  previewColor: '#EFF4EC',
  maxZoom: 19,
}

function getPreferredLayer(layers: MapLayer[], activeLayerId?: string) {
  return layers.find((layer) => layer.id === activeLayerId) ?? layers[0] ?? FALLBACK_LAYER
}

export function LeafletMap({
  center = SWEDEN_CENTER,
  zoom = 5,
  layers = DEFAULT_MAP_LAYERS,
  activeLayerId: controlledLayerId,
  onLayerChange,
  featureLayers,
  activeFeatureTypes,
  tracks,
  trackColor,
  cursorPosition,
  height = '400px',
  showFullscreenToggle = true,
  className,
  'aria-label': ariaLabel = 'Interaktiv karta',
}: LeafletMapProps) {
  const defaultLayer = getPreferredLayer(layers)

  // Support both controlled (activeLayerId + onLayerChange) and uncontrolled usage
  const [internalLayerId, setInternalLayerId] = React.useState(
    controlledLayerId ?? defaultLayer.id
  )
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const activeLayerId = controlledLayerId ?? internalLayerId

  function handleLayerChange(id: string) {
    if (!controlledLayerId) setInternalLayerId(id)
    onLayerChange?.(id)
  }

  function openFullscreen() {
    setIsFullscreen(true)
  }

  function closeFullscreen() {
    setIsFullscreen(false)
  }

  // Escape key exits fullscreen
  React.useEffect(() => {
    if (!isFullscreen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeFullscreen()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isFullscreen])

  useBodyScrollLock(isFullscreen)

  const activeLayer = getPreferredLayer(layers, activeLayerId)

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        isFullscreen
          ? 'fixed inset-0 z-[9999] rounded-none border-0'
          : 'rounded-xl border border-mist-dark',
        !isFullscreen && className
      )}
      style={isFullscreen ? undefined : { height }}
      role="region"
      aria-label={ariaLabel}
    >
      {/* Leaflet map canvas — loaded client-side only */}
      <MapInner
        center={center}
        zoom={zoom}
        activeLayer={activeLayer}
        {...(featureLayers ? { featureLayers } : {})}
        {...(activeFeatureTypes ? { activeFeatureTypes } : {})}
        {...(tracks ? { tracks } : {})}
        {...(trackColor ? { trackColor } : {})}
        {...(cursorPosition ? { cursorPosition } : {})}
      />

      {/* Fullscreen toggle — top-left, symmetric to layer toggle at top-right */}
      {showFullscreenToggle && (
        <div className="absolute top-3 left-3 z-[1000] pointer-events-auto">
          <button
            type="button"
            onClick={isFullscreen ? closeFullscreen : openFullscreen}
            aria-label={isFullscreen ? 'Stäng helskärmskartan' : 'Öppna karta i helskärm'}
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-lg',
              'bg-white/95 backdrop-blur-sm border border-mist-dark',
              'shadow-[0_1px_4px_rgba(44,74,62,0.10)]',
              'text-pine',
              'hover:bg-mist transition-colors duration-[120ms]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-1',
            )}
          >
            {isFullscreen
              ? <Minimize2 size={15} strokeWidth={1.5} aria-hidden="true" />
              : <Maximize2 size={15} strokeWidth={1.5} aria-hidden="true" />
            }
          </button>
        </div>
      )}

      {/* Layer toggle overlay — rendered as a regular React div on top of the map */}
      {layers.length > 1 && (
        <div className="absolute top-3 right-3 z-[1000] pointer-events-auto">
          <MapLayerToggle
            layers={layers}
            activeLayerId={activeLayerId}
            onLayerChange={handleLayerChange}
          />
        </div>
      )}
    </div>
  )
}
