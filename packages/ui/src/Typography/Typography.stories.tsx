import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'],
    },
    variant: {
      control: 'select',
      options: ['heading', 'body', 'caption'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    muted: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Heading: Story = {
  args: {
    as: 'h1',
    variant: 'heading',
    size: 'lg',
    children: 'Heading Large',
  },
};

export const Body: Story = {
  args: {
    variant: 'body',
    size: 'md',
    children: 'Body text in medium size. This is the default paragraph style.',
  },
};

export const Caption: Story = {
  args: {
    as: 'span',
    variant: 'caption',
    size: 'md',
    children: 'Caption text for supplementary information',
  },
};

export const Muted: Story = {
  args: {
    variant: 'body',
    muted: true,
    children: 'This text is muted.',
  },
};
