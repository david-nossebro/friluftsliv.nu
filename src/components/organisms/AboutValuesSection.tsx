import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AboutValue {
  icon: LucideIcon
  title: string
  body: string
}

export interface AboutValuesSectionProps {
  title?: string
  description?: string
  values: AboutValue[]
  className?: string
}

export function AboutValuesSection({
  title = 'Det här tror vi på',
  description = 'Fem ord som styr varje val vi gör — från färgval till vilka rutter vi lyfter fram.',
  values,
  className,
}: AboutValuesSectionProps) {
  return (
    <section className={cn('bg-mist py-12 md:py-20', className)}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mx-auto mb-12 max-w-[600px] text-center">
          <h2 className="mb-3 font-display text-2xl md:text-3xl font-light text-pine">
            {title}
          </h2>
          <p className="font-body text-base text-ink-soft leading-relaxed">
            {description}
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {values.map(({ icon: IconComponent, title: valueTitle, body }) => (
            <li
              key={valueTitle}
              className="flex flex-col gap-3 rounded-xl border border-mist-dark bg-white p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-mist">
                <IconComponent size={20} strokeWidth={1.5} className="text-moss" aria-hidden="true" />
              </span>
              <h3 className="font-display text-lg font-light text-pine">{valueTitle}</h3>
              <p className="font-body text-sm text-ink-soft leading-relaxed">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
