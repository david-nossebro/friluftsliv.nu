import type { Metadata } from 'next'
import { AboutPageView } from '@/components/sections/AboutPageView'

export const metadata: Metadata = {
  title: 'Om oss',
  description:
    'Vi öppnar dörren till den svenska naturen — för alla som vill ut, oavsett erfarenhet. Tanken bakom friluftsliv.nu.',
}

export default function AboutPage() {
  return <AboutPageView />
}
