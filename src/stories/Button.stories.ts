import type { Meta, StoryObj } from '@storybook/vue3'

import Button from './Button.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Example/Button',
  component: Button,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'lg'] },
    backgroundColor: { control: 'color' },
    onClick: { action: 'clicked' }
  },
  args: { variant: 'default' } // default value
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    variant: 'default',
    label: 'Button'
  }
}
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    label: 'Button',
    backgroundColor: 'destructive'
  }
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Button',
    backgroundColor: 'secondary'
  }
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    label: 'Button'
  }
}

export const Small: Story = {
  args: {
    label: 'Button',
    size: 'sm'
  }
}

export const Large: Story = {
  args: {
    label: 'Button',
    size: 'lg'
  }
}
export const Loading: Story = {
  args: {
    label: 'Button',
    size: 'lg',
    loading: true
  }
}
