import { ExternalLink, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface CabinBookingCardProps {
  pricePerNight?: number
  bookingUrl?: string
}

export function CabinBookingCard({
  pricePerNight,
  bookingUrl,
}: CabinBookingCardProps) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl bg-white border border-mist-dark">
      {pricePerNight != null && (
        <p className="font-body text-center">
          <span className="text-xl font-medium text-pine">{pricePerNight} kr</span>
          <span className="text-sm text-stone ml-1">/ natt</span>
        </p>
      )}
      {bookingUrl ? (
        <Button asChild variant="accent" size="md" className="w-full">
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={15} />
            Boka stuga
          </a>
        </Button>
      ) : (
        <Button variant="accent" size="md" className="w-full" disabled>
          <ExternalLink size={15} />
          Boka stuga
        </Button>
      )}
      <Button variant="ghost" size="md" className="w-full">
        <Share2 size={15} />
        Dela stugan
      </Button>
    </div>
  )
}
