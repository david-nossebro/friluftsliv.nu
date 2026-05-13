import { Mountain, Leaf, Compass, MoonStar, Heart } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { AboutHeroSection } from './AboutHeroSection'
import { AboutMissionSection } from './AboutMissionSection'
import { AboutValuesSection, type AboutValue } from './AboutValuesSection'
import { AboutContentHighlightsSection } from './AboutContentHighlightsSection'
import { AboutCtaSection } from './AboutCtaSection'

const defaultValues: AboutValue[] = [
  {
    icon: Mountain,
    title: 'Jordnära',
    body: 'Vi delar information som du kan lita på. Inga överdrifter — bara det du behöver veta inför nästa tur.',
  },
  {
    icon: Leaf,
    title: 'Inbjudande',
    body: 'Naturen är till för alla. Oavsett om det är din första vandring eller din femtionde, ska du känna dig välkommen här.',
  },
  {
    icon: Compass,
    title: 'Tydlig',
    body: 'Tydligt markerade rutter, tydliga svar. Du ska aldrig behöva gissa hur du tar dig dit eller vad som väntar.',
  },
  {
    icon: MoonStar,
    title: 'Lugn',
    body: 'Vi pratar inte högre än vi behöver. Naturen räcker — vi visar bara vägen.',
  },
  {
    icon: Heart,
    title: 'Meningsfull',
    body: 'Allt vi bygger har ett mål: att hjälpa fler människor ut i den svenska naturen, oftare.',
  },
]

export interface AboutPageViewProps {
  values?: AboutValue[]
}

export function AboutPageView({ values = defaultValues }: AboutPageViewProps) {
  return (
    <PageLayout currentPath="/om">
      <article className="bg-snow">
        <AboutHeroSection />
        <AboutMissionSection />
        <AboutValuesSection values={values} />
        <AboutContentHighlightsSection />
        <AboutCtaSection />
      </article>
    </PageLayout>
  )
}
