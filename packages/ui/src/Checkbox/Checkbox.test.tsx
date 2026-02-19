import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByLabelText('Accept terms')).toBeDefined();
  });

  it('renders without label', () => {
    const { container } = render(<Checkbox />);
    expect(container.querySelector('input[type="checkbox"]')).toBeDefined();
  });

  it('handles check/uncheck', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Toggle" onChange={onChange} />);

    await userEvent.click(screen.getByLabelText('Toggle'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('supports disabled state', () => {
    render(<Checkbox label="Disabled" disabled />);
    expect(screen.getByLabelText('Disabled')).toBeDisabled();
  });

  it('applies size data attribute', () => {
    const { container } = render(<Checkbox label="Test" size="lg" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.dataset.size).toBe('lg');
  });

  it('supports indeterminate state', () => {
    const { container } = render(<Checkbox label="Select all" indeterminate />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
  });
});
