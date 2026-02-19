import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider, useToast } from './Toast';
import { Button } from '../Button';

const meta: Meta = {
  title: 'Components/Toast',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj;

const ToastDemo = () => {
  const { toast } = useToast();

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button variant="primary" onClick={() => toast('Changes saved successfully', 'success')}>
        Success
      </Button>
      <Button variant="danger" onClick={() => toast('Something went wrong', 'error')}>
        Error
      </Button>
      <Button variant="secondary" onClick={() => toast('Please check your input', 'warning')}>
        Warning
      </Button>
      <Button variant="ghost" onClick={() => toast('New update available', 'info')}>
        Info
      </Button>
    </div>
  );
};

export const Default: Story = {
  render: () => <ToastDemo />,
};

const CustomDurationDemo = () => {
  const { toast } = useToast();

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button variant="primary" onClick={() => toast('Disappears in 1s', 'info', 1000)}>
        1 second
      </Button>
      <Button variant="secondary" onClick={() => toast('Disappears in 5s', 'success', 5000)}>
        5 seconds
      </Button>
    </div>
  );
};

export const CustomDuration: Story = {
  render: () => <CustomDurationDemo />,
};

const StackDemo = () => {
  const { toast } = useToast();
  let count = 0;

  return (
    <Button
      variant="primary"
      onClick={() => {
        count++;
        const variants = ['success', 'error', 'warning', 'info'] as const;
        toast(`Notification #${count}`, variants[count % 4]);
      }}
    >
      Add toast (click multiple times)
    </Button>
  );
};

export const Stacked: Story = {
  render: () => <StackDemo />,
};
