'use client'

import * as React from 'react'
import { MapLayout } from '@/components/layout/MapLayout'
import { LeafletMap } from '@/components/molecules/LeafletMap'
import type { MapFeatureLayer, MapPosition } from '@/types'
import type { MapSidebarFilters } from '@/components/organisms/MapSidebar'

export interface MapViewProps {
  featureLayers: MapFeatureLayer[]
  tracks?: MapPosition[][]
  initialCenter?: MapPosition
  initialZoom?: number
}

const defaultFilters: MapSidebarFilters = {
  activities: [],
  difficulties: [],
  query: '',
}

export function MapView({
  featureLayers,
  tracks,
  initialCenter,
  initialZoom = 5,
}: MapViewProps) {
  const [filters, setFilters] = React.useState<MapSidebarFilters>(defaultFilters)

  const filteredLayers = React.useMemo(() => {
    if (!filters.query) return featureLayers
    const q = filters.query.toLowerCase()
    return featureLayers.map((layer) => ({
      ...layer,
      markers: layer.markers.filter(
        (m) =>
          m.label.toLowerCase().includes(q) ||
          (m.description?.toLowerCase().includes(q) ?? false),
      ),
    }))
  }, [featureLayers, filters.query])

  const resultCount = React.useMemo(
    () => filteredLayers.reduce((sum, layer) => sum + layer.markers.length, 0),
    [filteredLayers],
  )

  return (
    <MapLayout
      sidebarProps={{
        filters,
        onFiltersChange: setFilters,
        resultCount,
      }}
      mapSlot={
        <LeafletMap
          center={initialCenter}
          zoom={initialZoom}
          featureLayers={filteredLayers}
          tracks={tracks}
          height="100%"
          showFullscreenToggle={false}
          className="h-full w-full rounded-none border-0"
          aria-label="Sverige — rutter och stugor"
        />
      }
    />
  )
}
