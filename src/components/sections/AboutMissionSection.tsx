import Image from 'next/image'
import { ContentBlock } from '@/components/sections/ContentBlock'
import { cn } from '@/lib/utils'

const defaultParagraphs = [
  'Drömmen om en tur i naturen stannar ofta vid en dröm — inte för att viljan saknas, utan för att det är svårt att veta var man ska börja. Vilken rutt passar för en nybörjare? Vart kan man ta vägen om det regnar? Behöver stugan bokas i förväg?',
  'Vi tror att svaret ska vara lätt att hitta. Här samlar vi rutter, stugor och områden från hela Sverige — på ett ställe, utan omvägar.',
]

export interface AboutMissionSectionProps {
  heading?: string
  paragraphs?: string[]
  imageUrl?: string
  imageAlt?: string
  className?: string
}

export function AboutMissionSection({
  heading = 'Tanken bakom',
  paragraphs = defaultParagraphs,
  imageUrl = '/about-tanken-bakom.jpg',
  imageAlt = 'Ett par står vid en träskylt vid stigen i en grön svensk skog en klar sommardag',
  className,
}: AboutMissionSectionProps) {
  return (
    <section className={cn('max-w-[1200px] mx-auto px-6 py-12 md:py-20', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="flex flex-col gap-6">
          <ContentBlock heading={heading}>
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={cn(
                  'font-body text-base text-ink leading-relaxed',
                  index > 0 && 'mt-4',
                )}
              >
                {paragraph}
              </p>
            ))}
          </ContentBlock>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  )
}
