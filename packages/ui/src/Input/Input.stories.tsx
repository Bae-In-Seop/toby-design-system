import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error: { control: 'text' },
    label: { control: 'text' },
    searchIcon: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Outlined: Story = {
  args: {
    placeholder: 'Enter text...',
    variant: 'outlined',
    size: 'md',
  },
};

export const Filled: Story = {
  args: {
    placeholder: 'Enter text...',
    variant: 'filled',
    size: 'md',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    error: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithSearchIcon: Story = {
  args: {
    placeholder: 'Search...',
    searchIcon: true,
  },
};

const SearchClearDemo = () => {
  const [value, setValue] = useState('');
  return (
    <Input
      placeholder="Search..."
      searchIcon
      clearable
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue('')}
    />
  );
};

export const SearchWithClear: Story = {
  render: () => <SearchClearDemo />,
};

const ClearableDemo = () => {
  const [value, setValue] = useState('Hello World');
  return (
    <Input
      label="Name"
      clearable
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue('')}
    />
  );
};

export const Clearable: Story = {
  render: () => <ClearableDemo />,
};

export const ClearableUncontrolled: Story = {
  args: {
    label: 'Uncontrolled',
    placeholder: 'Type something, then clear...',
    clearable: true,
    defaultValue: 'Default text',
  },
};
