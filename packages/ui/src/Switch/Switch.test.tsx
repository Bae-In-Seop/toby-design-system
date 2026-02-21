import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';

describe('Switch', () => {
  // Rendering
  it('renders with label', () => {
    render(<Switch label="Notifications" />);
    expect(screen.getByLabelText('Notifications')).toBeDefined();
  });

  it('renders without label', () => {
    const { container } = render(<Switch aria-label="Toggle" />);
    expect(container.querySelector('input[role="switch"]')).toBeDefined();
  });

  // Role
  it('has role switch', () => {
    render(<Switch label="Test" />);
    expect(screen.getByRole('switch')).toBeDefined();
  });

  // Toggle
  it('toggles on click', async () => {
    const onChange = vi.fn();
    render(<Switch label="Toggle me" onChange={onChange} />);
    const input = screen.getByRole('switch');
    await userEvent.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect((input as HTMLInputElement).checked).toBe(true);
  });

  it('toggles off on second click', async () => {
    render(<Switch label="Toggle me" defaultChecked />);
    const input = screen.getByRole('switch') as HTMLInputElement;
    expect(input.checked).toBe(true);
    await userEvent.click(input);
    expect(input.checked).toBe(false);
  });

  // Disabled
  it('is disabled when disabled prop is set', () => {
    render(<Switch label="Disabled" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('applies data-disabled on wrapper', () => {
    const { container } = render(<Switch label="Disabled" disabled />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.dataset.disabled).toBe('true');
  });

  // Size
  it('applies default size md', () => {
    const { container } = render(<Switch label="Test" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.dataset.size).toBe('md');
  });

  it('applies custom size', () => {
    const { container } = render(<Switch label="Test" size="lg" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.dataset.size).toBe('lg');
  });

  // Controlled
  it('supports controlled checked state', () => {
    const { rerender } = render(<Switch label="Ctrl" checked={false} onChange={() => {}} />);
    const input = screen.getByRole('switch') as HTMLInputElement;
    expect(input.checked).toBe(false);
    rerender(<Switch label="Ctrl" checked={true} onChange={() => {}} />);
    expect(input.checked).toBe(true);
  });

  // Uncontrolled
  it('supports uncontrolled defaultChecked', () => {
    render(<Switch label="Unctrl" defaultChecked />);
    const input = screen.getByRole('switch') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  // HTML attributes passthrough
  it('passes through HTML attributes', () => {
    render(<Switch label="Test" data-testid="custom-switch" />);
    expect(screen.getByRole('switch').dataset.testid).toBe('custom-switch');
  });
});
