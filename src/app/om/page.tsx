import type { Metadata } from 'next'
import { AboutPageView } from '@/components/organisms/AboutPageView'

export const metadata: Metadata = {
  title: 'Om oss',
  description:
    'friluftsliv.nu hjälper dig hitta vägen ut. Lär känna människorna och tanken bakom Sveriges hem för friluftsliv.',
}

export default function AboutPage() {
  return <AboutPageView />
}
