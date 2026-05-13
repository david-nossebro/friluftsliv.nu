import type { Meta, StoryObj } from '@storybook/react'
import { Mountain, Search, ArrowRight } from 'lucide-react'
import { Button } from './Button'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'accent', 'icon'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    pill: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { children: 'Hitta rutt', variant: 'primary', size: 'md' },
}

export const Secondary: Story = {
  args: { children: 'Visa alla', variant: 'secondary', size: 'md' },
}

export const Ghost: Story = {
  args: { children: 'Avbryt', variant: 'ghost', size: 'md' },
}

export const Accent: Story = {
  args: { children: 'Utforska kartan', variant: 'accent', size: 'md' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primär</Button>
      <Button variant="secondary">Sekundär</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="accent">Accent</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Liten</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Stor</Button>
      <Button size="xl">Extra stor</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">
        <Mountain size={16} />
        Hitta rutt
      </Button>
      <Button variant="secondary">
        Visa fler
        <ArrowRight size={16} />
      </Button>
    </div>
  ),
}

export const IconButton: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button variant="icon" size="sm"><Search size={14} /></Button>
      <Button variant="icon" size="md"><Search size={18} /></Button>
      <Button variant="icon" size="lg"><Search size={20} /></Button>
    </div>
  ),
}

export const PillVariant: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" pill>Primär pill</Button>
      <Button variant="secondary" pill>Sekundär pill</Button>
      <Button variant="accent" pill>Accent pill</Button>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" disabled>Inaktiverad</Button>
      <Button variant="secondary" disabled>Inaktiverad</Button>
    </div>
  ),
}
