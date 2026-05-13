'use client'

import { Mountain, Snowflake, TrendingUp, Bike, Waves, Home, Check, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActivityType } from '@/types'

export interface ActivityCategoryChipProps {
  activity: ActivityType
  active?: boolean
  onClick?: () => void
  className?: string
}

const activityConfig: Record<ActivityType, { label: string; icon: LucideIcon }> = {
  vandring:  { label: 'Vandring',  icon: Mountain },
  skidtur:   { label: 'Skidtur',   icon: Snowflake },
  topptur:   { label: 'Topptur',   icon: TrendingUp },
  cykeltur:  { label: 'Cykeltur',  icon: Bike },
  paddeltur: { label: 'Paddeltur', icon: Waves },
  stugtur:   { label: 'Stugtur',   icon: Home },
}

export function ActivityCategoryChip({
  activity,
  active = false,
  onClick,
  className,
}: ActivityCategoryChipProps) {
  const { label, icon: Icon } = activityConfig[activity]
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center gap-2 px-5 py-4 rounded-lg font-body',
        'transition-all duration-[120ms] ease-out cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-1',
        active
          ? 'bg-pine text-snow'
          : 'bg-white text-pine ring-1 ring-inset ring-mist-dark hover:bg-mist hover:ring-moss',
        className
      )}
    >
      {active && (
        <span className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-snow/20">
          <Check size={12} strokeWidth={2} aria-hidden="true" />
        </span>
      )}
      <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
      <span className="text-xs font-medium whitespace-nowrap">{label}</span>
    </button>
  )
}
