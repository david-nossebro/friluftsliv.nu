import { Route, TrendingUp, Clock, Calendar, RefreshCw } from 'lucide-react'
import { formatSeason } from '@/lib/season'
import type { RouteDetail } from '@/types'

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export interface RouteDetailStatsBarProps {
  route: Pick<RouteDetail, 'distance' | 'elevation' | 'duration' | 'season' | 'isRoundTrip'>
}

export function RouteDetailStatsBar({ route }: RouteDetailStatsBarProps) {
  return (
    <div
      role="list"
      aria-label="Rutt-statistik"
      className="flex items-stretch overflow-x-auto bg-white border-b border-mist-dark scrollbar-none"
    >
      {[
        { icon: Route, value: `${route.distance} km`, label: 'Distans' },
        { icon: TrendingUp, value: `${route.elevation} m`, label: 'Höjdmeter' },
        { icon: Clock, value: formatDuration(route.duration), label: 'Tid' },
        ...(route.season
          ? [{ icon: Calendar, value: formatSeason(route.season), label: 'Säsong' }]
          : []),
        ...(route.isRoundTrip !== undefined
          ? [{ icon: RefreshCw, value: route.isRoundTrip ? 'Tur/retur' : 'Enkel väg', label: 'Typ' }]
          : []),
      ].map(({ icon: IconComponent, value, label }) => (
        <div
          key={label}
          role="listitem"
          className="flex flex-col items-center justify-center gap-1 px-5 py-3 shrink-0 border-r border-mist-dark last:border-r-0 min-w-[88px]"
        >
          <IconComponent size={16} strokeWidth={1.5} className="text-moss" aria-hidden="true" />
          <span className="font-body font-medium text-sm text-pine whitespace-nowrap">{value}</span>
          <span className="font-body text-2xs text-stone uppercase tracking-wide">{label}</span>
        </div>
      ))}
    </div>
  )
}
