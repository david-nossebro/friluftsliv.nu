import { Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LeafletMap, SWEDEN_CENTER } from '@/components/map/LeafletMap'
import type { RouteDetail } from '@/types'

export interface RouteDetailSidebarProps {
  route: Pick<RouteDetail, 'id' | 'title' | 'region' | 'coordinates' | 'gpxTrack' | 'gpxUrl'>
}

export function RouteDetailSidebar({ route }: RouteDetailSidebarProps) {
  const featureLayers = route.coordinates
    ? [
        {
          type: 'start',
          label: route.region,
          color: '#2C4A3E',
          markers: [
            {
              id: route.id,
              position: route.coordinates,
              type: 'start',
              label: route.title,
              description: route.region,
            },
          ],
        },
      ]
    : undefined

  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-[76px]" aria-label="Kartinfo och åtgärder">
      <LeafletMap
        center={route.coordinates ?? SWEDEN_CENTER}
        zoom={route.coordinates ? 12 : 5}
        height="220px"
        aria-label={`Karta för ${route.title}`}
        {...(featureLayers ? { featureLayers } : {})}
        {...(route.gpxTrack ? { tracks: [route.gpxTrack] } : {})}
      />

      <div className="flex flex-col gap-2">
        {route.gpxUrl && (
          <Button asChild variant="secondary" size="md" className="w-full">
            <a href={route.gpxUrl} download>
              <Download size={15} />
              Ladda ned GPX
            </a>
          </Button>
        )}
        <Button variant="ghost" size="md" className="w-full">
          <Share2 size={15} />
          Dela rutten
        </Button>
      </div>
    </aside>
  )
}
