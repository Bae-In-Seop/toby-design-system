import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    radius: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
  args: { children: 'New', variant: 'primary' },
};

export const Secondary: Story = {
  args: { children: 'Draft', variant: 'secondary' },
};

export const Success: Story = {
  args: { children: 'Active', variant: 'success' },
};

export const Error: Story = {
  args: { children: 'Failed', variant: 'error' },
};
