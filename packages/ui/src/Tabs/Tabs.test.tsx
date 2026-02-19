import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

const items = [
  { value: 'tab1', label: 'Tab 1' },
  { value: 'tab2', label: 'Tab 2' },
  { value: 'tab3', label: 'Tab 3' },
];

describe('Tabs', () => {
  it('renders all tab labels', () => {
    render(<Tabs items={items} />);
    expect(screen.getByText('Tab 1')).toBeDefined();
    expect(screen.getByText('Tab 2')).toBeDefined();
    expect(screen.getByText('Tab 3')).toBeDefined();
  });

  it('selects first tab by default', () => {
    render(<Tabs items={items} />);
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    expect(tab1.getAttribute('aria-selected')).toBe('true');
  });

  it('selects tab on click', async () => {
    const onChange = vi.fn();
    render(<Tabs items={items} onChange={onChange} />);

    await userEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('supports defaultValue', () => {
    render(<Tabs items={items} defaultValue="tab2" />);
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tab2.getAttribute('aria-selected')).toBe('true');
  });

  it('supports controlled value', () => {
    render(<Tabs items={items} value="tab3" />);
    const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
    expect(tab3.getAttribute('aria-selected')).toBe('true');
  });

  it('navigates with arrow keys', async () => {
    const onChange = vi.fn();
    render(<Tabs items={items} onChange={onChange} />);

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    tab1.focus();

    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('tab2');

    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('tab3');

    // Wraps around
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('tab1');
  });

  it('skips disabled tabs in keyboard navigation', async () => {
    const itemsWithDisabled = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
      { value: 'c', label: 'C' },
    ];
    const onChange = vi.fn();
    render(<Tabs items={itemsWithDisabled} onChange={onChange} />);

    const tabA = screen.getByRole('tab', { name: 'A' });
    tabA.focus();

    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('c');
  });

  it('renders tabpanel with correct aria attributes', () => {
    render(<Tabs items={items} defaultValue="tab1" />);
    const panel = screen.getByRole('tabpanel');
    expect(panel.getAttribute('aria-labelledby')).toBe('tab-tab1');
  });

  it('applies size data attribute', () => {
    const { container } = render(<Tabs items={items} size="lg" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.dataset.size).toBe('lg');
  });

  it('disables tab button', () => {
    const itemsWithDisabled = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ];
    render(<Tabs items={itemsWithDisabled} />);
    expect(screen.getByRole('tab', { name: 'B' })).toBeDisabled();
  });
});
