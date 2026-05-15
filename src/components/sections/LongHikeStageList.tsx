import Link from 'next/link'
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
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 id="stages-heading" className="font-display text-2xl font-light text-pine">
            Etapper i ordning
          </h2>
          <p className="mt-2 font-body text-sm text-stone max-w-2xl">
            Börja med överblicken och gå sedan vidare till den etapp du vill planera närmare.
          </p>
        </div>
        <Badge variant="outline">{stages.length} etapper</Badge>
      </div>

      <ol className="flex flex-col gap-4">
        {stages.map((stage) => (
          <li key={stage.id}>
            <article className="rounded-xl border border-mist-dark bg-white p-5 shadow-card">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="mist" size="sm">
                      Etapp {stage.stageNumber}
                    </Badge>
                    <DifficultyBadge difficulty={stage.difficulty} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-light text-pine">
                      {stage.title}
                    </h3>
                    <p className="mt-1 font-body text-xs text-stone">
                      {stage.startLocation} till {stage.endLocation}
                    </p>
                  </div>
                  <p className="font-body text-sm text-ink leading-relaxed max-w-2xl">
                    {stage.summary}
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <StatItem icon={Route} value={stage.distance} unit=" km" label="Distans" />
                    <StatItem
                      icon={Clock}
                      value={`${Math.floor(stage.duration / 60)}h`}
                      label="Tid"
                    />
                  </div>
                </div>

                <Button asChild variant="secondary" size="sm">
                  <Link href={`/etapper/${stage.id}`}>
                    Visa etapp
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
