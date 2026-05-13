'use client'

// This file is intentionally NOT exported from the molecule index — it is
// loaded lazily by LeafletMap via next/dynamic so Leaflet never runs on the
// server.

import * as React from 'react'
import {
  MapContainer,
  TileLayer,
  useMap,
  ZoomControl,
  Polyline,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import type { MapFeatureLayer, MapLayer, MapPosition } from '@/types'

// ─── Brand marker factory ────────────────────────────────────────────────────

/**
 * Creates a custom Leaflet DivIcon using a brand-styled SVG pin.
 * Avoids the broken default PNG icons that Leaflet ships.
 *
 * The visual pin renders at `pinSize` (default 36px) but sits inside a
 * `hitSize` (default 48px) transparent wrapper so the tap target meets
 * WCAG 2.5.5 (≥ 48×48 CSS px).
 */
function createBrandMarker(color = '#2C4A3E', pinSize = 36, hitSize = 48): L.DivIcon {
  const offset = (hitSize - pinSize) / 2
  const html = `
    <div style="width:${hitSize}px;height:${hitSize}px;display:flex;align-items:flex-end;justify-content:center;pointer-events:auto;">
      <svg width="${pinSize}" height="${pinSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;">
        <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"
          fill="${color}" stroke="white" stroke-width="1.5"/>
        <circle cx="12" cy="9" r="2.5" fill="white" opacity="0.9"/>
      </svg>
    </div>
  `
  return L.divIcon({
    html,
    className: '', // clear Leaflet's default white box
    iconSize: [hitSize, hitSize],
    // Pin tip sits at the bottom of the wrapper (offset from the wrapper bottom is 0).
    iconAnchor: [hitSize / 2, hitSize - offset],
    popupAnchor: [0, -pinSize],
  })
}

// Pre-built icons for common brand colors — avoids re-creating on each render
const DEFAULT_MARKER_ICON = createBrandMarker('#2C4A3E')

const MARKER_ICONS: Record<string, L.DivIcon> = {
  '#2C4A3E': DEFAULT_MARKER_ICON, // pine
  '#4A7C59': createBrandMarker('#4A7C59'), // moss
  '#D97B4F': createBrandMarker('#D97B4F'), // ember
  '#A8C4D4': createBrandMarker('#A8C4D4'), // sky
  '#6B5B45': createBrandMarker('#6B5B45'), // earth
}

function getMarkerIcon(color?: string): L.DivIcon {
  if (!color) return DEFAULT_MARKER_ICON

  const colorKey = color.toLowerCase()
  const cached = MARKER_ICONS[colorKey]
  if (cached) return cached
  const icon = createBrandMarker(color)
  MARKER_ICONS[colorKey] = icon
  return icon
}

// ─── Brand cluster icon ──────────────────────────────────────────────────────

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c,
  )

/**
 * Cluster icon factory. Returns a Pine-filled circle with a Snow-coloured count.
 * Sized 40 / 48 / 56 by cluster magnitude; sits inside a 48×48 hit area minimum.
 */
function createClusterIcon(cluster: L.MarkerCluster): L.DivIcon {
  const count = cluster.getChildCount()
  const size = count < 10 ? 40 : count < 100 ? 48 : 56
  const hit = Math.max(size, 48)
  const html = `
    <div style="width:${hit}px;height:${hit}px;display:flex;align-items:center;justify-content:center;">
      <div style="width:${size}px;height:${size}px;border-radius:9999px;background:#2C4A3E;color:#F8FAF7;display:flex;align-items:center;justify-content:center;font-family:var(--font-body),system-ui,sans-serif;font-weight:500;font-size:${size >= 56 ? 15 : 14}px;line-height:1;box-shadow:0 1px 4px rgba(28,43,37,.3);border:2px solid #F8FAF7;">${count}</div>
    </div>
  `
  return L.divIcon({
    html,
    className: 'marker-cluster-brand',
    iconSize: L.point(hit, hit),
  })
}

// ─── Clustered feature markers ───────────────────────────────────────────────

/**
 * Imperatively renders the feature markers inside an L.markerClusterGroup.
 * react-leaflet doesn't ship a cluster component, so we mount the group via
 * the leaflet API directly and tear it down on changes/unmount.
 */
function ClusteredFeatureMarkers({
  visibleLayers,
}: {
  visibleLayers: MapFeatureLayer[]
}) {
  const map = useMap()

  React.useEffect(() => {
    const clusterGroup = L.markerClusterGroup({
      iconCreateFunction: createClusterIcon,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 16,
      maxClusterRadius: 60,
      // Keyboard reach: cluster bubbles must be focusable + activatable.
      chunkedLoading: false,
    })

    for (const featureLayer of visibleLayers) {
      for (const m of featureLayer.markers) {
        const marker = L.marker([m.position.lat, m.position.lng], {
          icon: getMarkerIcon(featureLayer.color),
          title: m.label,
          keyboard: true,
        })
        if (m.label || m.description) {
          const popupHtml = `<div class="font-body">
            <p class="font-medium text-pine text-sm leading-snug">${escapeHtml(m.label ?? '')}</p>
            ${
              m.description
                ? `<p class="text-xs text-stone mt-1 leading-relaxed">${escapeHtml(m.description)}</p>`
                : ''
            }
          </div>`
          marker.bindPopup(popupHtml)
        }
        clusterGroup.addLayer(marker)
      }
    }

    map.addLayer(clusterGroup)
    return () => {
      map.removeLayer(clusterGroup)
    }
  }, [map, visibleLayers])

  return null
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
      <FitToTracks {...(tracks ? { tracks } : {})} />

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

      {/* Feature markers — clustered to keep tap targets WCAG-compliant when
          markers cluster geographically. */}
      <ClusteredFeatureMarkers visibleLayers={visibleLayers} />
    </MapContainer>
  )
}
