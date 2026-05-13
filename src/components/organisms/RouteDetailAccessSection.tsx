import { Car, Bus } from 'lucide-react'

export interface RouteDetailAccessSectionProps {
  accessByCar?: string
  accessByTransport?: string
}

export function RouteDetailAccessSection({
  accessByCar,
  accessByTransport,
}: RouteDetailAccessSectionProps) {
  if (!accessByCar && !accessByTransport) {
    return null
  }

  return (
    <section aria-labelledby="access-heading">
      <h2
        id="access-heading"
        className="font-body font-medium text-xs text-stone uppercase tracking-wide mb-4"
      >
        Hur du tar dig dit
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {accessByCar && (
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-white border border-mist-dark">
            <div className="flex items-center gap-2 text-pine">
              <Car size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="font-body font-medium text-sm">Med bil</span>
            </div>
            <p className="font-body text-sm text-ink-soft leading-relaxed">{accessByCar}</p>
          </div>
        )}
        {accessByTransport && (
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-white border border-mist-dark">
            <div className="flex items-center gap-2 text-pine">
              <Bus size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="font-body font-medium text-sm">Kollektivtrafik</span>
            </div>
            <p className="font-body text-sm text-ink-soft leading-relaxed">{accessByTransport}</p>
          </div>
        )}
      </div>
    </section>
  )
}
