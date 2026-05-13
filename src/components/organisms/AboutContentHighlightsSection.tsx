import { cn } from '@/lib/utils'

export interface AboutContentHighlight {
  title: string
  body: string
}

const defaultItems: AboutContentHighlight[] = [
  {
    title: 'Rutter',
    body: 'Från lugna dagsturer till flerdagars vandringar i Sareks vildmark. Med distans, höjdmeter och svårighetsgrad så du vet vad du ger dig in på.',
  },
  {
    title: 'Stugor',
    body: 'STF-stugor, fjällstationer och självhushåll. Med faciliteter, tillgänglighet och bokningslänkar.',
  },
  {
    title: 'Karta',
    body: 'En interaktiv karta över hela Sverige där du kan filtrera på aktivitet, svårighetsgrad och plats.',
  },
]

export interface AboutContentHighlightsSectionProps {
  title?: string
  items?: AboutContentHighlight[]
  className?: string
}

export function AboutContentHighlightsSection({
  title = 'Vad du hittar här',
  items = defaultItems,
  className,
}: AboutContentHighlightsSectionProps) {
  return (
    <section className={cn('max-w-[860px] mx-auto px-6 py-12 md:py-20', className)}>
      <h2 className="mb-10 text-center font-display text-2xl md:text-3xl font-light text-pine">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col gap-2">
            <h3 className="font-display text-xl font-light text-pine">{item.title}</h3>
            <p className="font-body text-sm text-ink-soft leading-relaxed">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
