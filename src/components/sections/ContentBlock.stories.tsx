import type { Meta, StoryObj } from '@storybook/react'
import { MapPin, Sun, Lightbulb } from 'lucide-react'
import { ContentBlock } from './ContentBlock'

const meta = {
  title: 'Sections/ContentBlock',
  component: ContentBlock,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof ContentBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    heading: 'Beskrivning',
    body: 'Turen startar på skogsveg och etter ca 200 m svingar den til venstre inn på sti gjennom granskog. Stien stig jamnt med fleire flotte utsiktspunkt til du kjem til ei sherpatrapp, «Hardangertrappa», som snor seg opp ei bratt fjellside.',
  },
}

export const WithIcon: Story = {
  args: {
    heading: 'Startpunkt',
    icon: MapPin,
    body: 'Frå Herand båtkai ca 3,6 km nordover på fylkesveg 550. Sving inn til venstre ved skiltet «Hardanger kulturgalleri».',
  },
}

export const WithSeasonIcon: Story = {
  args: {
    heading: 'Säsong',
    icon: Sun,
    body: 'Maj – oktober/november. Försök inte göra denna vandring om det är snö, is eller frost.',
  },
}

export const WithTipsList: Story = {
  args: {
    heading: 'Tips för turen',
    icon: Lightbulb,
  },
  render: (args) => (
    <ContentBlock {...args}>
      <ul className="flex flex-col gap-2">
        {[
          'Ta med mat, dricka och vindtäta kläder.',
          'Vandringsboots rekommenderas. Vid torrt väder kan träningsskor användas.',
          'Bra mobilsignal längs större delen av rutten.',
          'Karta och kompass rekommenderas.',
        ].map((tip) => (
          <li key={tip} className="flex gap-2 font-body text-sm text-ink leading-relaxed">
            <span className="text-moss mt-0.5 shrink-0" aria-hidden="true">·</span>
            {tip}
          </li>
        ))}
      </ul>
    </ContentBlock>
  ),
}
