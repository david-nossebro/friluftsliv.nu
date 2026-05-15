import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, Route } from 'lucide-react'
import { DifficultyBadge } from '@/components/common/DifficultyBadge'
import { StatItem } from '@/components/common/StatItem'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Stage } from '@/types'

export interface LongHikeStageListProps {
  stages: Stage[]
}

export function LongHikeStageList({ stages }: LongHikeStageListProps) {
  return (
    <section aria-labelledby="stages-heading" className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <h2 id="stages-heading" className="font-display text-2xl font-light text-pine leading-snug">
            Etapper i ordning
          </h2>
          <p className="font-body text-sm text-stone max-w-2xl">
            Börja med överblicken och gå sedan vidare till den etapp du vill planera närmare.
          </p>
        </div>
        <Badge variant="outline">{stages.length} etapper</Badge>
      </div>

      <ol className="flex flex-col gap-4">
        {stages.map((stage) => (
          <li key={stage.id}>
            <article className="rounded-xl border border-mist-dark bg-white shadow-card overflow-hidden">
              <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
                {stage.imageUrl && (
                  <div className="relative md:w-44 lg:w-52 h-40 md:h-auto md:shrink-0 bg-mist">
                    <Image
                      src={stage.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 208px"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-3 flex-1 p-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="mist" size="sm">
                      Etapp {stage.stageNumber}
                    </Badge>
                    <DifficultyBadge difficulty={stage.difficulty} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-light text-pine leading-snug">
                      {stage.title}
                    </h3>
                    <p className="mt-1 font-body text-xs text-stone">
                      {stage.startLocation} till {stage.endLocation}
                    </p>
                  </div>
                  <p className="font-body text-sm text-ink leading-relaxed max-w-2xl">
                    {stage.summary}
                  </p>
                  <div className="flex items-center justify-between gap-3 flex-wrap mt-auto">
                    <div className="flex items-center gap-4 flex-wrap">
                      <StatItem icon={Route} value={stage.distance} unit=" km" label="Distans" />
                      <StatItem
                        icon={Clock}
                        value={`${Math.floor(stage.duration / 60)} h`}
                        label="Tid"
                      />
                    </div>
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/etapper/${stage.id}`}>
                        Visa etapp
                        <ArrowRight size={14} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
