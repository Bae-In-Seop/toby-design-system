import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    collapsible: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const defaultItems = [
  {
    value: 'item-1',
    label: 'What is a design system?',
    content:
      'A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.',
  },
  {
    value: 'item-2',
    label: 'Why use design tokens?',
    content:
      'Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes.',
  },
  {
    value: 'item-3',
    label: 'How do I contribute?',
    content:
      'You can contribute by submitting a pull request with your changes. Please follow the contribution guidelines in the repository.',
  },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    defaultValue: 'item-1',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    items: defaultItems,
    defaultValue: 'item-1',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    items: defaultItems,
    defaultValue: 'item-1',
    size: 'lg',
  },
};

export const Multiple: Story = {
  args: {
    items: defaultItems,
    type: 'multiple',
    defaultValue: ['item-1', 'item-2'],
  },
};

export const WithDisabled: Story = {
  args: {
    items: [
      ...defaultItems.slice(0, 2),
      { ...defaultItems[2], disabled: true },
    ],
    defaultValue: 'item-1',
  },
};

export const NonCollapsible: Story = {
  args: {
    items: defaultItems,
    defaultValue: 'item-1',
    collapsible: false,
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | string[]>('item-1');
    return (
      <div>
        <Accordion items={defaultItems} value={value} onChange={setValue} />
        <p style={{ marginTop: 16 }}>Active: {JSON.stringify(value)}</p>
      </div>
    );
  },
};

export const AllCollapsed: Story = {
  args: {
    items: defaultItems,
  },
};
