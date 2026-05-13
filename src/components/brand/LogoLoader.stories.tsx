import type { Meta, StoryObj } from '@storybook/react'
import { LogoLoader } from './LogoLoader'

const meta = {
  title: 'Brand/LogoLoader',
  component: LogoLoader,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'reversed', 'mono-pine', 'all-white'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    duration: {
      control: { type: 'range', min: 0.6, max: 6, step: 0.2 },
    },
    label: {
      control: 'text',
    },
    caption: {
      control: 'text',
    },
  },
} satisfies Meta<typeof LogoLoader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { variant: 'default', size: 'md', duration: 2.4 },
}

export const Reversed: Story = {
  args: { variant: 'reversed', size: 'md', duration: 2.4 },
  parameters: { backgrounds: { default: 'pine' } },
}

export const MonoPine: Story = {
  args: { variant: 'mono-pine', size: 'md', duration: 2.4 },
  parameters: { backgrounds: { default: 'mist' } },
}

export const AllWhite: Story = {
  args: { variant: 'all-white', size: 'md', duration: 2.4 },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1C3029' },
        { name: 'photo', value: '#1e2e24' },
      ],
    },
  },
}

export const SizeScale: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <LogoLoader size="sm" />
      <LogoLoader size="md" />
      <LogoLoader size="lg" />
      <LogoLoader size="xl" />
    </div>
  ),
}

export const SlowMotion: Story = {
  args: { variant: 'default', size: 'lg', duration: 6 },
  parameters: {
    docs: {
      description: {
        story:
          'Slowed to 6 seconds so you can inspect each phase of the animation: back → mid → front → back.',
      },
    },
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-3">
        <span className="text-2xs font-medium uppercase tracking-widest text-stone">
          Default
        </span>
        <LogoLoader variant="default" size="lg" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <span className="text-2xs font-medium uppercase tracking-widest text-stone">
          Mono Pine
        </span>
        <LogoLoader variant="mono-pine" size="lg" />
      </div>
      <div
        className="flex flex-col items-center gap-3 rounded-lg px-10 py-6"
        style={{ backgroundColor: '#2C4A3E' }}
      >
        <span className="text-2xs font-medium uppercase tracking-widest text-stone-light">
          Reversed
        </span>
        <LogoLoader variant="reversed" size="lg" />
      </div>
      <div
        className="flex flex-col items-center gap-3 rounded-lg px-10 py-6"
        style={{ background: 'linear-gradient(150deg, #1e2e24 0%, #162028 100%)' }}
      >
        <span className="text-2xs font-medium uppercase tracking-widest text-stone-light">
          All White
        </span>
        <LogoLoader variant="all-white" size="lg" />
      </div>
    </div>
  ),
}

/* ── Caption stories ── */

export const WithCaption: Story = {
  args: {
    variant: 'default',
    size: 'md',
    duration: 2.4,
    caption: 'Laddar…',
  },
}

export const WithCaptionReversed: Story = {
  args: {
    variant: 'reversed',
    size: 'md',
    duration: 2.4,
    caption: 'Laddar…',
  },
  parameters: { backgrounds: { default: 'pine' } },
}

export const WithCaptionMonoPine: Story = {
  args: {
    variant: 'mono-pine',
    size: 'md',
    duration: 2.4,
    caption: 'Laddar…',
  },
  parameters: { backgrounds: { default: 'mist' } },
}

export const WithCaptionAllWhite: Story = {
  args: {
    variant: 'all-white',
    size: 'md',
    duration: 2.4,
    caption: 'Laddar…',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1C3029' },
        { name: 'photo', value: '#1e2e24' },
      ],
    },
  },
}

export const CaptionSizeScale: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <LogoLoader size="sm" caption="Laddar…" />
      <LogoLoader size="md" caption="Laddar…" />
      <LogoLoader size="lg" caption="Laddar…" />
      <LogoLoader size="xl" caption="Laddar…" />
    </div>
  ),
}

export const CaptionAllVariants: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-3">
        <span className="text-2xs font-medium uppercase tracking-widest text-stone">
          Default
        </span>
        <LogoLoader variant="default" size="lg" caption="Laddar…" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <span className="text-2xs font-medium uppercase tracking-widest text-stone">
          Mono Pine
        </span>
        <LogoLoader variant="mono-pine" size="lg" caption="Laddar…" />
      </div>
      <div
        className="flex flex-col items-center gap-3 rounded-lg px-10 py-6"
        style={{ backgroundColor: '#2C4A3E' }}
      >
        <span className="text-2xs font-medium uppercase tracking-widest text-stone-light">
          Reversed
        </span>
        <LogoLoader variant="reversed" size="lg" caption="Laddar…" />
      </div>
      <div
        className="flex flex-col items-center gap-3 rounded-lg px-10 py-6"
        style={{ background: 'linear-gradient(150deg, #1e2e24 0%, #162028 100%)' }}
      >
        <span className="text-2xs font-medium uppercase tracking-widest text-stone-light">
          All White
        </span>
        <LogoLoader variant="all-white" size="lg" caption="Laddar…" />
      </div>
    </div>
  ),
}

export const WithCustomText: Story = {
  args: {
    variant: 'default',
    size: 'lg',
    duration: 2.4,
    caption: 'Hittar leden…',
  },
}
