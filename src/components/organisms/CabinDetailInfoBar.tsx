import { BedDouble, Calendar, Lock, LockOpen, Users, BadgeInfo } from 'lucide-react'
import type { CabinDetail, CabinServiceType } from '@/types'

const serviceTypeLabels: Record<CabinServiceType, string> = {
  obetjänad: 'Obetjänad',
  betjänad: 'Betjänad',
  självhushåll: 'Självhushåll',
}

export interface CabinDetailInfoBarProps {
  cabin: Pick<CabinDetail, 'beds' | 'openPeriod' | 'serviceType' | 'isLocked' | 'pricePerNight'>
}

export function CabinDetailInfoBar({ cabin }: CabinDetailInfoBarProps) {
  return (
    <div
      role="list"
      aria-label="Stugfakta"
      className="flex items-stretch overflow-x-auto bg-white border-b border-mist-dark scrollbar-none"
    >
      {[
        { icon: BedDouble, value: `${cabin.beds} bäddar`, label: 'Kapacitet' },
        { icon: Calendar, value: cabin.openPeriod ?? 'Hela året', label: 'Öppen' },
        { icon: Users, value: serviceTypeLabels[cabin.serviceType], label: 'Service' },
        {
          icon: cabin.isLocked ? Lock : LockOpen,
          value: cabin.isLocked ? 'Låst' : 'Olåst',
          label: 'Tillgång',
        },
        ...(cabin.pricePerNight != null
          ? [{ icon: BadgeInfo, value: `${cabin.pricePerNight} kr`, label: 'Per natt' }]
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
