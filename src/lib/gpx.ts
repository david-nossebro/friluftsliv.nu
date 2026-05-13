import type { MapPosition } from '@/types'

/**
 * Parse a GPX XML string and extract all track points.
 *
 * Flattens all `<trkseg>` segments into a single array of coordinates.
 * Returns an empty array if no track points are found.
 *
 * @param xml - Raw GPX XML string
 * @returns Array of { lat, lng } points ordered as they appear in the file
 */
export function parseGpx(xml: string): MapPosition[] {
  if (!xml || typeof xml !== 'string') {
    return []
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'application/xml')

  // Check for parser errors
  const parserError = doc.querySelector('parsererror')
  if (parserError) {
    console.warn('[parseGpx] Invalid XML provided:', parserError.textContent)
    return []
  }

  const points: MapPosition[] = []
  const trackPoints = doc.querySelectorAll('trkpt')

  for (const pt of trackPoints) {
    const lat = parseFloat(pt.getAttribute('lat') ?? '')
    const lng = parseFloat(pt.getAttribute('lon') ?? '')

    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      points.push({ lat, lng })
    }
  }

  return points
}

/**
 * Fetch a GPX file from a URL and parse its track points.
 *
 * @param url - Absolute or relative URL to a `.gpx` file
 * @returns Promise resolving to an array of { lat, lng } points
 */
export async function parseGpxUrl(url: string): Promise<MapPosition[]> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch GPX from ${url}: ${response.status} ${response.statusText}`)
  }
  const xml = await response.text()
  return parseGpx(xml)
}
