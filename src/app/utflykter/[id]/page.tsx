import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { UtflyktDetailPage } from '@/components/sections/UtflyktDetailPage'
import { getRelatedUtflykter, getUtflyktById, utflykter } from '@/data'

export async function generateStaticParams() {
  return utflykter.map((utflykt) => ({ id: utflykt.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const utflykt = getUtflyktById(id)
  if (!utflykt) return { title: 'Utflykten hittades inte' }

  return {
    title: utflykt.title,
    description: utflykt.summary,
  }
}

export default async function UtflyktDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const utflykt = getUtflyktById(id)
  if (!utflykt) notFound()

  const relatedUtflykter = getRelatedUtflykter(utflykt, 4)

  return (
    <PageLayout currentPath="/utforska">
      <UtflyktDetailPage utflykt={utflykt} relatedUtflykter={relatedUtflykter} />
    </PageLayout>
  )
}
