import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { AreaDetailPage } from '@/components/sections/AreaDetailPage'
import {
  areas,
  getAreaById,
  getAreaRoutesByCategory,
  getCabinsForAreaId,
} from '@/data'

export async function generateStaticParams() {
  return areas.map((area) => ({ id: area.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const area = getAreaById(id)

  if (!area) return { title: 'Området hittades inte' }

  return {
    title: area.title,
    description: area.summary,
  }
}

export default async function AreaDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const area = getAreaById(id)

  if (!area) notFound()

  return (
    <PageLayout currentPath="/utforska">
      <AreaDetailPage
        area={area}
        cabins={getCabinsForAreaId(area.id)}
        hikingRoutes={getAreaRoutesByCategory(area.id, 'vandring')}
        mountainRoutes={getAreaRoutesByCategory(area.id, 'fjallvandring')}
        canoeRoutes={getAreaRoutesByCategory(area.id, 'kanot')}
      />
    </PageLayout>
  )
}
