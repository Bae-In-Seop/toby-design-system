import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {
    open: true,
    title: 'Dialog Title',
    children: 'This is the dialog content. You can put any content here.',
  },
};

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open Dialog</button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Confirm Action">
          <p>Are you sure you want to proceed?</p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
            <button onClick={() => setOpen(false)}>Cancel</button>
            <button onClick={() => setOpen(false)}>Confirm</button>
          </div>
        </Dialog>
      </>
    );
  },
};
