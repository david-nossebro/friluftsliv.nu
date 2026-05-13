import { Trees, Snowflake, Car } from 'lucide-react'

export interface CabinDetailAccessSectionProps {
  accessSummer?: string
  accessWinter?: string
}

export function CabinDetailAccessSection({
  accessSummer,
  accessWinter,
}: CabinDetailAccessSectionProps) {
  if (!accessSummer && !accessWinter) {
    return null
  }

  return (
    <section aria-labelledby="cabin-access-heading">
      <h2
        id="cabin-access-heading"
        className="font-body font-medium text-xs text-stone uppercase tracking-wide mb-4"
      >
        Hur du tar dig dit
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {accessSummer && (
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-white border border-mist-dark">
            <div className="flex items-center gap-2 text-pine">
              <Trees size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="font-body font-medium text-sm">Sommar</span>
            </div>
            <p className="font-body text-sm text-ink-soft leading-relaxed">{accessSummer}</p>
          </div>
        )}
        {accessWinter && (
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-white border border-mist-dark">
            <div className="flex items-center gap-2 text-pine">
              <Snowflake size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="font-body font-medium text-sm">Vinter</span>
            </div>
            <p className="font-body text-sm text-ink-soft leading-relaxed">{accessWinter}</p>
          </div>
        )}
        {accessSummer && !accessWinter && (
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-white border border-mist-dark">
            <div className="flex items-center gap-2 text-pine">
              <Car size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="font-body font-medium text-sm">Med bil</span>
            </div>
            <p className="font-body text-sm text-ink-soft leading-relaxed">
              Se sommaralternativet ovan.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
