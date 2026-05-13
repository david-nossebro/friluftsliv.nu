import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export interface RouteDetailMobileBarProps {
  title: string
  distance: number
  duration: number
}

export function RouteDetailMobileBar({
  title,
  distance,
  duration,
}: RouteDetailMobileBarProps) {
  return (
    <div className="lg:hidden sticky bottom-0 z-20 bg-white border-t border-mist-dark px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-body font-medium text-sm text-pine truncate">{title}</p>
        <p className="font-body text-xs text-stone">{distance} km · {formatDuration(duration)}</p>
      </div>
      <Button variant="primary" size="sm">
        <Share2 size={14} />
        Dela
      </Button>
    </div>
  )
}
