import { cn } from '@/lib/utils'
import type { Difficulty } from '@/types'

export interface DifficultyBadgeProps {
  difficulty: Difficulty
  className?: string
}

const config: Record<Difficulty, { label: string; className: string }> = {
  easy:   { label: 'Lätt',    className: 'bg-moss/15 text-pine' },
  medium: { label: 'Medel',   className: 'bg-earth/15 text-earth' },
  hard:   { label: 'Svår',    className: 'bg-ember/15 text-ember-dark' },
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const { label, className: colorClass } = config[difficulty]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full font-body font-medium text-2xs',
        colorClass,
        className
      )}
    >
      {label}
    </span>
  )
}
