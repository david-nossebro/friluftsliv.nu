import type { Meta, StoryObj } from '@storybook/react'
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
    heading: 'Om turen',
    body: 'Turen startar på skogsväg och efter ca 200 m svänger den till vänster in på en stig genom granskog. Stigen stiger jämnt med flera fina utsiktspunkter innan du kommer till en sherpatrappa, "Hardangertrappan", som slingrar sig upp i en brant fjällsida.',
  },
}

export const WithEyebrow: Story = {
  args: {
    eyebrow: 'Säsong',
    heading: 'Maj till oktober',
    body: 'Försök inte gå rutten om det ligger snö, is eller frost på berget.',
  },
}

export const WithBulletList: Story = {
  args: {
    heading: 'Tips för turen',
  },
  render: (args) => (
    <ContentBlock {...args}>
      <ul className="list-disc marker:text-moss pl-5 flex flex-col gap-2 font-body text-sm text-ink leading-relaxed">
        {[
          'Ta med mat, dricka och vindtäta kläder.',
          'Vandringskängor rekommenderas. Vid torrt väder duger träningsskor.',
          'Bra mobilsignal längs större delen av rutten.',
          'Karta och kompass rekommenderas.',
        ].map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </ContentBlock>
  ),
}
