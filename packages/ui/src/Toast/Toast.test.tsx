import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './Toast';

const TestConsumer = () => {
  const { toast } = useToast();
  return (
    <div>
      <button onClick={() => toast('Test message', 'success')}>Show Toast</button>
      <button onClick={() => toast('Error occurred', 'error')}>Show Error</button>
    </div>
  );
};

describe('Toast', () => {
  it('shows toast when triggered', async () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    await userEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test message')).toBeDefined();
  });

  it('renders with correct variant', async () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    await userEvent.click(screen.getByText('Show Error'));
    const alert = screen.getByRole('alert');
    expect(alert.dataset.variant).toBe('error');
  });

  it('shows multiple toasts', async () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    await userEvent.click(screen.getByText('Show Toast'));
    await userEvent.click(screen.getByText('Show Error'));

    expect(screen.getByText('Test message')).toBeDefined();
    expect(screen.getByText('Error occurred')).toBeDefined();
  });

  it('auto-dismisses after duration', async () => {
    vi.useFakeTimers();

    const ShortToast = () => {
      const { toast } = useToast();
      return <button onClick={() => toast('Quick', 'info', 1000)}>Show</button>;
    };

    render(
      <ToastProvider>
        <ShortToast />
      </ToastProvider>
    );

    await act(async () => {
      await userEvent.setup({ advanceTimers: vi.advanceTimersByTime }).click(screen.getByText('Show'));
    });

    expect(screen.getByText('Quick')).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(1100);
    });

    // After timer, the toast should have data-exiting set (animation triggers removal)
    const alert = screen.getByRole('alert');
    expect(alert.dataset.exiting).toBeDefined();

    vi.useRealTimers();
  });

  it('throws when useToast is used outside provider', () => {
    const Bad = () => {
      useToast();
      return null;
    };

    expect(() => render(<Bad />)).toThrow('useToast must be used within a ToastProvider');
  });
});
