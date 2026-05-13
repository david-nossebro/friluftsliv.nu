import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { CabinDetailPage } from '@/components/sections/CabinDetailPage'
import { CabinCardGrid } from '@/components/cards/CabinCardGrid'
import { getCabinById, getRelatedCabins, cabins } from '@/data'
import { toFacilityItems, toSuitableForItems } from '@/lib/facilityIcons'

export async function generateStaticParams() {
  return cabins.map((c) => ({ id: c.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const cabin = getCabinById(id)
  if (!cabin) return { title: 'Stugan hittades inte' }
  return {
    title: cabin.title,
    description: `${cabin.region} · ${cabin.beds} bäddar · ${cabin.serviceType}`,
  }
}

export default async function CabinDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cabin = getCabinById(id)
  if (!cabin) notFound()

  const facilityItems = toFacilityItems(cabin.facilities)
  const suitableForItems = cabin.suitableFor ? toSuitableForItems(cabin.suitableFor) : []
  const related = getRelatedCabins(cabin, 4)

  return (
    <PageLayout currentPath="/utforska">
      <CabinDetailPage
        cabin={cabin}
        facilityItems={facilityItems}
        suitableForItems={suitableForItems}
        {...(related.length > 0
          ? {
              relatedCabins: <CabinCardGrid title="Liknande stugor" cabins={related} />,
            }
          : {})}
      />
    </PageLayout>
  )
}
