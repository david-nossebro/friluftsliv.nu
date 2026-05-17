'use client'

import * as React from 'react'
import type { LatLng } from './geo'

export type GeolocationStatus =
  | 'idle'
  | 'prompting'
  | 'granted'
  | 'denied'
  | 'unavailable'

const STORAGE_KEY = 'exploreNearMeCoords'
const STORAGE_TTL_MS = 30 * 60 * 1000 // 30 min

interface StoredCoords {
  coords: LatLng
  savedAt: number
}

function readCachedCoords(): LatLng | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredCoords
    if (Date.now() - parsed.savedAt > STORAGE_TTL_MS) return null
    return parsed.coords
  } catch {
    return null
  }
}

function writeCachedCoords(coords: LatLng): void {
  if (typeof window === 'undefined') return
  try {
    const payload: StoredCoords = { coords, savedAt: Date.now() }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Storage may be full or disabled — silently ignore.
  }
}

function clearCachedCoords(): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export interface UseGeolocationResult {
  status: GeolocationStatus
  coords: LatLng | null
  request: () => void
  forget: () => void
}

export function useGeolocation(): UseGeolocationResult {
  const cached = React.useMemo(() => readCachedCoords(), [])
  const [coords, setCoords] = React.useState<LatLng | null>(cached)
  const [status, setStatus] = React.useState<GeolocationStatus>(() => {
    if (typeof window === 'undefined') return 'idle'
    if (!('geolocation' in navigator)) return 'unavailable'
    return cached ? 'granted' : 'idle'
  })

  const request = React.useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setStatus('unavailable')
      return
    }

    setStatus('prompting')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next: LatLng = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCoords(next)
        setStatus('granted')
        writeCachedCoords(next)
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setStatus('denied')
        } else {
          setStatus('unavailable')
        }
        setCoords(null)
      },
      { enableHighAccuracy: false, maximumAge: 5 * 60 * 1000, timeout: 10_000 },
    )
  }, [])

  const forget = React.useCallback(() => {
    setCoords(null)
    setStatus('idle')
    clearCachedCoords()
  }, [])

  return { status, coords, request, forget }
}
