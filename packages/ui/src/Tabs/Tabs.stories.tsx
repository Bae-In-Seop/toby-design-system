import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const defaultItems = [
  { value: 'overview', label: 'Overview' },
  { value: 'features', label: 'Features' },
  { value: 'pricing', label: 'Pricing' },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    defaultValue: 'overview',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    items: defaultItems,
    defaultValue: 'overview',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    items: defaultItems,
    defaultValue: 'overview',
    size: 'lg',
  },
};

export const WithDisabled: Story = {
  args: {
    items: [
      { value: 'active', label: 'Active' },
      { value: 'disabled', label: 'Disabled', disabled: true },
      { value: 'another', label: 'Another Tab' },
    ],
    defaultValue: 'active',
  },
};

export const ManyTabs: Story = {
  args: {
    items: [
      { value: 'tab1', label: 'Dashboard' },
      { value: 'tab2', label: 'Analytics' },
      { value: 'tab3', label: 'Reports' },
      { value: 'tab4', label: 'Settings' },
      { value: 'tab5', label: 'Billing' },
    ],
    defaultValue: 'tab1',
  },
};
