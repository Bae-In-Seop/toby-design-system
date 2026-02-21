import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Rendering
  it('renders trigger element', () => {
    render(
      <Tooltip content="Tip">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    expect(screen.getByText('Trigger')).toBeDefined();
  });

  it('does not show tooltip initially', () => {
    render(
      <Tooltip content="Tip">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.dataset.visible).toBeUndefined();
  });

  // Hover show/hide
  it('shows tooltip on hover after delay', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip" showDelay={200}>
        <button type="button">Trigger</button>
      </Tooltip>
    );
    await user.hover(screen.getByText('Trigger'));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByRole('tooltip').dataset.visible).toBe('true');
  });

  it('hides tooltip on mouse leave', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip" showDelay={10}>
        <button type="button">Trigger</button>
      </Tooltip>
    );
    await user.hover(screen.getByText('Trigger'));
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(screen.getByRole('tooltip').dataset.visible).toBe('true');
    fireEvent.mouseLeave(screen.getByText('Trigger'));
    expect(screen.getByRole('tooltip').dataset.visible).toBeUndefined();
  });

  // Delay
  it('does not show tooltip before delay expires', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip" showDelay={500}>
        <button type="button">Trigger</button>
      </Tooltip>
    );
    await user.hover(screen.getByText('Trigger'));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByRole('tooltip').dataset.visible).toBeUndefined();
  });

  it('cancels show on mouse leave before delay', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip" showDelay={500}>
        <button type="button">Trigger</button>
      </Tooltip>
    );
    await user.hover(screen.getByText('Trigger'));
    await user.unhover(screen.getByText('Trigger'));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByRole('tooltip').dataset.visible).toBeUndefined();
  });

  // Focus show/hide
  it('shows tooltip on focus', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip" showDelay={10}>
        <button type="button">Trigger</button>
      </Tooltip>
    );
    await user.tab();
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(screen.getByRole('tooltip').dataset.visible).toBe('true');
  });

  it('hides tooltip on blur', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip" showDelay={10}>
        <button type="button">Trigger</button>
      </Tooltip>
    );
    await user.tab();
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(screen.getByRole('tooltip').dataset.visible).toBe('true');
    await user.tab();
    expect(screen.getByRole('tooltip').dataset.visible).toBeUndefined();
  });

  // ESC
  it('hides tooltip on Escape key', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip" showDelay={10}>
        <button type="button">Trigger</button>
      </Tooltip>
    );
    await user.hover(screen.getByText('Trigger'));
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(screen.getByRole('tooltip').dataset.visible).toBe('true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('tooltip').dataset.visible).toBeUndefined();
  });

  // Placement
  it('applies placement data attribute', () => {
    render(
      <Tooltip content="Tip" placement="bottom">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip').dataset.placement).toBe('bottom');
  });

  it('defaults to top placement', () => {
    render(
      <Tooltip content="Tip">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip').dataset.placement).toBe('top');
  });

  // ARIA
  it('has role tooltip', () => {
    render(
      <Tooltip content="Tip">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip')).toBeDefined();
  });

  it('sets aria-describedby when visible', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip" showDelay={10}>
        <button type="button">Trigger</button>
      </Tooltip>
    );
    const trigger = screen.getByText('Trigger');
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
    await user.hover(trigger);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    const tooltipId = screen.getByRole('tooltip').id;
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltipId);
  });

  // Custom delay
  it('respects custom showDelay', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip" showDelay={1000}>
        <button type="button">Trigger</button>
      </Tooltip>
    );
    await user.hover(screen.getByText('Trigger'));
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(screen.getByRole('tooltip').dataset.visible).toBeUndefined();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole('tooltip').dataset.visible).toBe('true');
  });
});
