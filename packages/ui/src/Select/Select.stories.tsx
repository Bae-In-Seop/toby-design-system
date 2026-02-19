import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const sampleOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Select a framework',
    size: 'md',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Framework',
    options: sampleOptions,
    placeholder: 'Select a framework',
  },
};

export const WithError: Story = {
  args: {
    label: 'Framework',
    options: sampleOptions,
    placeholder: 'Select a framework',
    error: 'Please select a framework',
  },
};

export const Disabled: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Select a framework',
    disabled: true,
  },
};
