import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatItemProps {
  icon: LucideIcon
  value: string | number
  unit?: string
  label?: string
  className?: string
}

export function StatItem({ icon: IconComponent, value, unit, label, className }: StatItemProps) {
  return (
    <div className={cn('inline-flex items-center gap-1 text-stone', className)}>
      <IconComponent size={13} strokeWidth={1.5} className="shrink-0" />
      <span className="font-body text-xs font-medium text-ink-soft">
        {value}
        {unit && <span className="font-normal text-stone ml-0.5">{unit}</span>}
      </span>
      {label && <span className="sr-only">{label}</span>}
    </div>
  )
}
