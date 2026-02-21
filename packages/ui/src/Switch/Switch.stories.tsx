import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: 'Enable notifications',
    size: 'md',
  },
};

export const Checked: Story = {
  args: {
    label: 'Dark mode',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Unavailable',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Always on',
    disabled: true,
    defaultChecked: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Switch label="Small" size="sm" />
      <Switch label="Medium" size="md" />
      <Switch label="Large" size="lg" />
    </div>
  ),
};

export const WithoutLabel: Story = {
  args: {
    'aria-label': 'Toggle feature',
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div>
        <Switch
          label="Controlled"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <p style={{ marginTop: 16 }}>State: {checked ? 'ON' : 'OFF'}</p>
      </div>
    );
  },
};
