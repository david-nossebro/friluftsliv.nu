import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { RouteDetailPage } from '@/components/organisms/RouteDetailPage'
import { RouteCardGrid } from '@/components/organisms/RouteCardGrid'
import { getRouteById, getRelatedRoutes, routes } from '@/data'

export async function generateStaticParams() {
  return routes.map((r) => ({ id: r.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const route = getRouteById(id)
  if (!route) return { title: 'Rutten hittades inte' }
  return {
    title: route.title,
    description: `${route.region} · ${route.distance} km · ${route.elevation} höjdmeter`,
  }
}

export default async function RouteDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const route = getRouteById(id)
  if (!route) notFound()

  const related = getRelatedRoutes(route, 4)

  return (
    <PageLayout currentPath="/utforska">
      <RouteDetailPage
        route={route}
        relatedRoutes={
          related.length > 0 ? (
            <RouteCardGrid title="Liknande rutter" routes={related} />
          ) : undefined
        }
      />
    </PageLayout>
  )
}
