import { Button } from '@/components/atoms/Button'

export interface CabinDetailMobileBarProps {
  title: string
  beds: number
  pricePerNight?: number
  openPeriod?: string
  bookingUrl?: string
}

export function CabinDetailMobileBar({
  title,
  beds,
  pricePerNight,
  openPeriod,
  bookingUrl,
}: CabinDetailMobileBarProps) {
  return (
    <div className="lg:hidden sticky bottom-0 z-20 bg-white border-t border-mist-dark px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-body font-medium text-sm text-pine truncate">{title}</p>
        <p className="font-body text-xs text-stone">
          {beds} bäddar · {pricePerNight != null ? `${pricePerNight} kr/natt` : openPeriod ?? 'Hela året'}
        </p>
      </div>
      {bookingUrl ? (
        <Button asChild variant="accent" size="sm">
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
            Boka nu
          </a>
        </Button>
      ) : (
        <Button variant="accent" size="sm" disabled>
          Boka nu
        </Button>
      )}
    </div>
  )
}
