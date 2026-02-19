import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: 'Card content goes here.',
    padding: 'md',
    shadow: 'sm',
  },
};

export const LargeShadow: Story = {
  args: {
    children: 'Card with large shadow.',
    padding: 'lg',
    shadow: 'lg',
  },
};

export const NoPadding: Story = {
  args: {
    children: 'Card with no padding.',
    padding: 'none',
    shadow: 'sm',
  },
};
