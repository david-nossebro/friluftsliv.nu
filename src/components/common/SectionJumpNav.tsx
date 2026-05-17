import { cn } from '@/lib/utils'

export interface SectionJumpNavItem {
  href: string
  label: string
  count: number
}

export interface SectionJumpNavProps {
  description: string
  items: SectionJumpNavItem[]
  ariaLabel: string
  className?: string
}

export function SectionJumpNav({
  description,
  items,
  ariaLabel,
  className,
}: SectionJumpNavProps) {
  return (
    <div className={cn('rounded-2xl border border-mist-dark bg-white p-4 md:p-5', className)}>
      <p className="font-body text-sm text-ink leading-relaxed">{description}</p>

      <nav
        aria-label={ariaLabel}
        className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-full border border-mist-dark bg-snow px-4 py-2.5',
              'font-body text-sm font-medium text-ink transition-colors duration-[120ms]',
              'hover:border-moss hover:bg-mist hover:text-pine',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-1',
            )}
          >
            <span>{item.label}</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-pine ring-1 ring-inset ring-mist-dark">
              {item.count}
            </span>
          </a>
        ))}
      </nav>
    </div>
  )
}
