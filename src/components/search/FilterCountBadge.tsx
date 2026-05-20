'use client'

export function FilterCountBadge({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-pine text-snow text-2xs font-medium">
      {n}
    </span>
  )
}
