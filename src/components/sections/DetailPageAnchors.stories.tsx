import type { Meta, StoryObj } from '@storybook/react'
import { DetailPageAnchors } from './DetailPageAnchors'

const meta = {
  title: 'Sections/DetailPageAnchors',
  component: DetailPageAnchors,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof DetailPageAnchors>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    anchors: [
      { id: 'om-leden', label: 'Om leden' },
      { id: 'karta', label: 'Karta' },
      { id: 'etapper', label: 'Etapper' },
      { id: 'tillgang', label: 'Hur du tar dig dit' },
      { id: 'bra-att-veta', label: 'Bra att veta' },
    ],
  },
  render: (args) => (
    <div>
      <DetailPageAnchors {...args} />
      <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-16">
        {args.anchors.map(({ id, label }) => (
          <section key={id} id={id} className="scroll-mt-24 min-h-[60vh]">
            <h2 className="font-display text-2xl font-light text-pine">{label}</h2>
            <p className="mt-4 font-body text-sm text-ink">
              Demosektion för anchor &quot;{id}&quot;.
            </p>
          </section>
        ))}
      </div>
    </div>
  ),
}
