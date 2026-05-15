import { cn } from '@/lib/utils'

export interface RouteStat {
  label: string
  value: string
  sublabel?: string
}

export interface RouteStatGridProps {
  stats: RouteStat[]
  /**
   * `aria-label` for the surrounding list. Defaults to "Rutt-statistik".
   */
  ariaLabel?: string
  className?: string
}

/**
 * Four-up (two-up on mobile) stat grid with Fraunces numerals.
 * Used at the top of every detail page so route / stage / long-hike share
 * one canonical pattern.
 */
export function RouteStatGrid({ stats, ariaLabel = 'Rutt-statistik', className }: RouteStatGridProps) {
  if (stats.length === 0) return null

  return (
    <div className={cn('border-b border-mist-dark bg-white', className)}>
      <ul
        aria-label={ariaLabel}
        className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map(({ label, value, sublabel }) => (
          <li
            key={label}
            className="rounded-lg border border-mist-dark bg-snow p-4"
          >
            <p className="font-body text-2xs uppercase tracking-wide text-stone">{label}</p>
            <p className="mt-1 font-display text-xl font-light text-pine leading-snug">
              {value}
            </p>
            {sublabel && (
              <p className="mt-1 font-body text-xs text-stone">{sublabel}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
