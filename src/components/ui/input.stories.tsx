'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState, type ComponentProps } from 'react'
import { Input } from './input'

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'search'] },
    inputSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

const DefaultDemo = (args: ComponentProps<typeof Input>) => {
  const [val, setVal] = useState('')
  return <Input {...args} value={val} onChange={(e) => setVal(e.target.value)} className="w-72" />
}

export const Default: Story = {
  args: { placeholder: 'Skriv här...', variant: 'default', inputSize: 'md' },
  render: (args) => <DefaultDemo {...args} />,
}

const SearchDemo = () => {
  const [val, setVal] = useState('')
  return (
    <Input
      variant="search"
      placeholder="Sök rutter, stugor eller platser..."
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onClear={() => setVal('')}
      className="w-80"
    />
  )
}

export const Search: Story = {
  render: () => <SearchDemo />,
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input placeholder="Liten" inputSize="sm" />
      <Input placeholder="Medium" inputSize="md" />
      <Input placeholder="Stor" inputSize="lg" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { placeholder: 'Inaktiverat fält', disabled: true },
}
