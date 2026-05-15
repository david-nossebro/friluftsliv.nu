import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { LongHikeDetailPage } from '@/components/sections/LongHikeDetailPage'
import { getLongHikeById, getStagesForLongHike, longHikes } from '@/data'

export async function generateStaticParams() {
  return longHikes.map((longHike) => ({ id: longHike.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const longHike = getLongHikeById(id)
  if (!longHike) return { title: 'Långvandringen hittades inte' }

  return {
    title: longHike.title,
    description: `${longHike.region} · ${longHike.distance} km · ${longHike.stageIds.length} etapper`,
  }
}

export default async function LongHikeDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const longHike = getLongHikeById(id)

  if (!longHike) notFound()

  const stages = getStagesForLongHike(longHike.id)

  return (
    <PageLayout currentPath="/utforska">
      <LongHikeDetailPage longHike={longHike} stages={stages} />
    </PageLayout>
  )
}
