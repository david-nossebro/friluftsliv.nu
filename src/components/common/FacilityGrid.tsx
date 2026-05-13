import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FacilityItem {
  label: string
  icon: LucideIcon
}

export interface FacilityGridProps {
  items: FacilityItem[]
  className?: string
}

export function FacilityGrid({ items, className }: FacilityGridProps) {
  if (items.length === 0) return null

  return (
    <ul
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3',
        className
      )}
      aria-label="Faciliteter"
    >
      {items.map(({ label, icon: IconComponent }) => (
        <li
          key={label}
          className="flex items-center gap-2.5 font-body text-sm text-ink-soft"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-mist shrink-0">
            <IconComponent size={15} strokeWidth={1.5} className="text-moss" aria-hidden="true" />
          </span>
          {label}
        </li>
      ))}
    </ul>
  )
}
