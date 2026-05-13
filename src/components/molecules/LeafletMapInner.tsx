'use client'

// This file is intentionally NOT exported from the molecule index — it is
// loaded lazily by LeafletMap via next/dynamic so Leaflet never runs on the
// server.

import * as React from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
  Polyline,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapFeatureLayer, MapLayer, MapPosition } from '@/types'

// ─── Brand marker factory ────────────────────────────────────────────────────

/**
 * Creates a custom Leaflet DivIcon using a brand-styled SVG pin.
 * Avoids the broken default PNG icons that Leaflet ships.
 */
function createBrandMarker(color = '#2C4A3E', size = 36): L.DivIcon {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"
        fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="9" r="2.5" fill="white" opacity="0.9"/>
    </svg>
  `
  return L.divIcon({
    html: svg,
    className: '', // clear Leaflet's default white box
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // tip of pin at the coordinate
    popupAnchor: [0, -size],
  })
}

// Pre-built icons for common brand colors — avoids re-creating on each render
const MARKER_ICONS: Record<string, L.DivIcon> = {
  '#2C4A3E': createBrandMarker('#2C4A3E'), // pine
  '#4A7C59': createBrandMarker('#4A7C59'), // moss
  '#D97B4F': createBrandMarker('#D97B4F'), // ember
  '#A8C4D4': createBrandMarker('#A8C4D4'), // sky
  '#6B5B45': createBrandMarker('#6B5B45'), // earth
}

function getMarkerIcon(color?: string): L.DivIcon {
  if (!color) return MARKER_ICONS['#2C4A3E']
  const cached = MARKER_ICONS[color.toLowerCase()]
  if (cached) return cached
  const icon = createBrandMarker(color)
  MARKER_ICONS[color.toLowerCase()] = icon
  return icon
}

// ─── Sync center/zoom when controlled props change ───────────────────────────

function MapSync({ center, zoom }: { center: MapPosition; zoom: number }) {
  const map = useMap()
  React.useEffect(() => {
    map.setView([center.lat, center.lng], zoom)
  }, [map, center.lat, center.lng, zoom])
  return null
}

// ─── Fit map bounds to tracks ────────────────────────────────────────────────

function FitToTracks({ tracks }: { tracks?: MapPosition[][] }) {
  const map = useMap()

  React.useEffect(() => {
    if (!tracks || tracks.length === 0) return

    const allPoints = tracks.flat().map((pt): L.LatLngExpression => [pt.lat, pt.lng])
    if (allPoints.length === 0) return

    const bounds = L.latLngBounds(allPoints)
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 16 })
    }
  }, [map, tracks])

  return null
}

// ─── Component ───────────────────────────────────────────────────────────────

export interface LeafletMapInnerProps {
  center: MapPosition
  zoom: number
  activeLayer: MapLayer
  featureLayers?: MapFeatureLayer[]
  activeFeatureTypes?: string[]
  /** Track polylines to render on the map. Each entry is one continuous track. */
  tracks?: MapPosition[][]
}

/** Brand styling for track polylines */
const TRACK_PATH_OPTIONS: L.PolylineOptions = {
  color: '#2C4A3E',
  weight: 3,
  opacity: 0.85,
  lineCap: 'round',
  lineJoin: 'round',
}

export default function LeafletMapInner({
  center,
  zoom,
  activeLayer,
  featureLayers,
  activeFeatureTypes,
  tracks,
}: LeafletMapInnerProps) {
  const visibleLayers = React.useMemo(() => {
    if (!featureLayers) return []
    if (!activeFeatureTypes) return featureLayers
    return featureLayers.filter((fl) => activeFeatureTypes.includes(fl.type))
  }, [featureLayers, activeFeatureTypes])

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      zoomControl={false}
      className="w-full h-full"
      // Only zoom with ctrl/cmd+scroll to avoid page hijacking
      scrollWheelZoom={false}
    >
      <MapSync center={center} zoom={zoom} />
      <FitToTracks tracks={tracks} />

      <TileLayer
        key={activeLayer.id} // remount on layer change to avoid tile bleeding
        url={activeLayer.tileUrl}
        attribution={activeLayer.attribution}
        maxZoom={activeLayer.maxZoom ?? 19}
      />

      {/* Zoom control — bottom-right for thumb reach on mobile */}
      <ZoomControl position="bottomright" />

      {/* Track polylines */}
      {tracks?.map((track, index) => (
        <Polyline
          key={`track-${index}`}
          positions={track.map((pt) => [pt.lat, pt.lng])}
          pathOptions={TRACK_PATH_OPTIONS}
        />
      ))}

      {/* Feature markers */}
      {visibleLayers.map((featureLayer) =>
        featureLayer.markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.position.lat, marker.position.lng]}
            icon={getMarkerIcon(featureLayer.color)}
            title={marker.label}
          >
            {(marker.label || marker.description) && (
              <Popup>
                <div className="font-body">
                  <p className="font-medium text-pine text-sm leading-snug">
                    {marker.label}
                  </p>
                  {marker.description && (
                    <p className="text-xs text-stone mt-1 leading-relaxed">
                      {marker.description}
                    </p>
                  )}
                </div>
              </Popup>
            )}
          </Marker>
        ))
      )}
    </MapContainer>
  )
}
