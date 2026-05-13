'use client'

import { cn } from '@/lib/utils'
import { ActivityCategoryChip } from '@/components/molecules/ActivityCategoryChip'
import type { ActivityType } from '@/types'

const allActivities: ActivityType[] = ['vandring', 'skidtur', 'topptur', 'cykeltur', 'paddeltur', 'stugtur']

export interface ActivityShortcutsProps {
  title?: string
  onSelect?: (activity: ActivityType) => void
  className?: string
}

export function ActivityShortcuts({
  title = 'Hitta din nästa äventyr',
  onSelect,
  className,
}: ActivityShortcutsProps) {
  return (
    <section className={cn('py-12 px-6', className)} aria-labelledby="shortcuts-heading">
      <div className="max-w-[1200px] mx-auto">
        <h2
          id="shortcuts-heading"
          className="font-display text-2xl font-light text-pine text-center mb-8"
        >
          {title}
        </h2>
        <div role="group" aria-label="Aktiviteter" className="grid grid-cols-3 sm:grid-cols-6 gap-3 justify-items-center">
          {allActivities.map((activity) => (
            <ActivityCategoryChip
              key={activity}
              activity={activity}
              onClick={() => onSelect?.(activity)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
