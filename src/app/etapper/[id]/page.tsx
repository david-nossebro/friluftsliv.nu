import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { StageDetailPage } from '@/components/sections/StageDetailPage'
import { getAdjacentStages, getLongHikeForStage, getStageById, stages } from '@/data'

export async function generateStaticParams() {
  return stages.map((stage) => ({ id: stage.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const stage = getStageById(id)
  if (!stage) return { title: 'Etappen hittades inte' }

  return {
    title: stage.title,
    description: `${stage.startLocation} till ${stage.endLocation} · ${stage.distance} km`,
  }
}

export default async function StageDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const stage = getStageById(id)

  if (!stage) notFound()

  const longHike = getLongHikeForStage(stage.id)
  if (!longHike) notFound()

  const { previousStage, nextStage } = getAdjacentStages(stage.id)

  return (
    <PageLayout currentPath="/utforska">
      <StageDetailPage
        stage={stage}
        longHikeTitle={longHike.title}
        longHikeHref={`/langvandringar/${longHike.id}`}
        {...(previousStage ? { previousStage } : {})}
        {...(nextStage ? { nextStage } : {})}
      />
    </PageLayout>
  )
}
