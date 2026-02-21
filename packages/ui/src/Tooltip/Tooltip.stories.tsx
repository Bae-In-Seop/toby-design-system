import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    showDelay: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 80,
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'Tooltip text',
    children: <button type="button">Hover me</button>,
    placement: 'top',
  },
};

export const AllPlacements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
      <Tooltip content="Top tooltip" placement="top">
        <button type="button">Top</button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <button type="button">Bottom</button>
      </Tooltip>
      <Tooltip content="Left tooltip" placement="left">
        <button type="button">Left</button>
      </Tooltip>
      <Tooltip content="Right tooltip" placement="right">
        <button type="button">Right</button>
      </Tooltip>
    </div>
  ),
};

export const WithDelay: Story = {
  args: {
    content: 'Appears after 500ms',
    children: <button type="button">500ms delay</button>,
    showDelay: 500,
  },
};

export const OnIconButton: Story = {
  args: {
    content: 'Settings',
    children: (
      <button type="button" aria-label="Settings" style={{ padding: 8 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="8" r="6" />
        </svg>
      </button>
    ),
  },
};

export const KeyboardFocus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <button type="button">Focus first</button>
      <Tooltip content="Visible on focus" placement="bottom">
        <button type="button">Tab to me</button>
      </Tooltip>
    </div>
  ),
};
