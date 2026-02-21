import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';
import type { AccordionItem } from './Accordion';

const defaultItems: AccordionItem[] = [
  { value: 'item-1', label: 'Item 1', content: 'Content 1' },
  { value: 'item-2', label: 'Item 2', content: 'Content 2' },
  { value: 'item-3', label: 'Item 3', content: 'Content 3' },
];

describe('Accordion', () => {
  // Rendering
  it('renders all items', () => {
    render(<Accordion items={defaultItems} />);
    expect(screen.getByText('Item 1')).toBeDefined();
    expect(screen.getByText('Item 2')).toBeDefined();
    expect(screen.getByText('Item 3')).toBeDefined();
  });

  it('renders with default size md', () => {
    const { container } = render(<Accordion items={defaultItems} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.dataset.size).toBe('md');
  });

  it('applies custom size', () => {
    const { container } = render(<Accordion items={defaultItems} size="lg" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.dataset.size).toBe('lg');
  });

  // Uncontrolled
  it('opens item from defaultValue', () => {
    render(<Accordion items={defaultItems} defaultValue="item-1" />);
    const trigger = screen.getByText('Item 1').closest('button')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('starts all closed when no defaultValue', () => {
    render(<Accordion items={defaultItems} />);
    const triggers = screen.getAllByRole('button');
    triggers.forEach((trigger) => {
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });
  });

  // Controlled
  it('respects controlled value', () => {
    render(<Accordion items={defaultItems} value="item-2" />);
    const trigger1 = screen.getByText('Item 1').closest('button')!;
    const trigger2 = screen.getByText('Item 2').closest('button')!;
    expect(trigger1.getAttribute('aria-expanded')).toBe('false');
    expect(trigger2.getAttribute('aria-expanded')).toBe('true');
  });

  it('calls onChange with new value in controlled mode', async () => {
    const onChange = vi.fn();
    render(
      <Accordion items={defaultItems} value="item-1" onChange={onChange} />
    );
    await userEvent.click(screen.getByText('Item 2'));
    expect(onChange).toHaveBeenCalledWith('item-2');
  });

  // Click toggle
  it('toggles item on click', async () => {
    render(<Accordion items={defaultItems} />);
    const trigger = screen.getByText('Item 1');
    await userEvent.click(trigger);
    expect(
      trigger.closest('button')!.getAttribute('aria-expanded')
    ).toBe('true');
    await userEvent.click(trigger);
    expect(
      trigger.closest('button')!.getAttribute('aria-expanded')
    ).toBe('false');
  });

  it('closes other items in single mode', async () => {
    render(<Accordion items={defaultItems} defaultValue="item-1" />);
    await userEvent.click(screen.getByText('Item 2'));
    const trigger1 = screen.getByText('Item 1').closest('button')!;
    const trigger2 = screen.getByText('Item 2').closest('button')!;
    expect(trigger1.getAttribute('aria-expanded')).toBe('false');
    expect(trigger2.getAttribute('aria-expanded')).toBe('true');
  });

  // Multiple mode
  it('allows multiple items open in multiple mode', async () => {
    render(<Accordion items={defaultItems} type="multiple" />);
    await userEvent.click(screen.getByText('Item 1'));
    await userEvent.click(screen.getByText('Item 2'));
    const trigger1 = screen.getByText('Item 1').closest('button')!;
    const trigger2 = screen.getByText('Item 2').closest('button')!;
    expect(trigger1.getAttribute('aria-expanded')).toBe('true');
    expect(trigger2.getAttribute('aria-expanded')).toBe('true');
  });

  it('opens multiple items from defaultValue array', () => {
    render(
      <Accordion
        items={defaultItems}
        type="multiple"
        defaultValue={['item-1', 'item-2']}
      />
    );
    const trigger1 = screen.getByText('Item 1').closest('button')!;
    const trigger2 = screen.getByText('Item 2').closest('button')!;
    const trigger3 = screen.getByText('Item 3').closest('button')!;
    expect(trigger1.getAttribute('aria-expanded')).toBe('true');
    expect(trigger2.getAttribute('aria-expanded')).toBe('true');
    expect(trigger3.getAttribute('aria-expanded')).toBe('false');
  });

  // Collapsible
  it('prevents collapsing last item when collapsible is false', async () => {
    render(
      <Accordion
        items={defaultItems}
        defaultValue="item-1"
        collapsible={false}
      />
    );
    const trigger = screen.getByText('Item 1');
    await userEvent.click(trigger);
    expect(
      trigger.closest('button')!.getAttribute('aria-expanded')
    ).toBe('true');
  });

  it('allows collapsing all items when collapsible is true', async () => {
    render(<Accordion items={defaultItems} defaultValue="item-1" />);
    const trigger = screen.getByText('Item 1');
    await userEvent.click(trigger);
    expect(
      trigger.closest('button')!.getAttribute('aria-expanded')
    ).toBe('false');
  });

  // Disabled
  it('does not toggle disabled item', async () => {
    const items: AccordionItem[] = [
      ...defaultItems.slice(0, 2),
      { ...defaultItems[2], disabled: true },
    ];
    render(<Accordion items={items} />);
    const trigger = screen.getByText('Item 3').closest('button')!;
    expect(trigger).toBeDisabled();
  });

  it('applies data-disabled on disabled item', () => {
    const items: AccordionItem[] = [
      { ...defaultItems[0], disabled: true },
      ...defaultItems.slice(1),
    ];
    const { container } = render(<Accordion items={items} />);
    const firstItem = container.querySelector('[data-disabled]');
    expect(firstItem).toBeDefined();
  });

  // Keyboard navigation
  it('moves focus with ArrowDown', async () => {
    render(<Accordion items={defaultItems} />);
    const triggers = screen.getAllByRole('button');
    triggers[0].focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(triggers[1]);
  });

  it('moves focus with ArrowUp', async () => {
    render(<Accordion items={defaultItems} />);
    const triggers = screen.getAllByRole('button');
    triggers[1].focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(document.activeElement).toBe(triggers[0]);
  });

  it('wraps focus from last to first with ArrowDown', async () => {
    render(<Accordion items={defaultItems} />);
    const triggers = screen.getAllByRole('button');
    triggers[2].focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(triggers[0]);
  });

  it('moves focus to first with Home', async () => {
    render(<Accordion items={defaultItems} />);
    const triggers = screen.getAllByRole('button');
    triggers[2].focus();
    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(triggers[0]);
  });

  it('moves focus to last with End', async () => {
    render(<Accordion items={defaultItems} />);
    const triggers = screen.getAllByRole('button');
    triggers[0].focus();
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(triggers[2]);
  });

  // ARIA attributes
  it('has correct aria-expanded attributes', () => {
    render(<Accordion items={defaultItems} defaultValue="item-2" />);
    const trigger1 = screen.getByText('Item 1').closest('button')!;
    const trigger2 = screen.getByText('Item 2').closest('button')!;
    expect(trigger1.getAttribute('aria-expanded')).toBe('false');
    expect(trigger2.getAttribute('aria-expanded')).toBe('true');
  });

  it('has correct aria-controls linking', () => {
    render(<Accordion items={defaultItems} />);
    const trigger = screen.getByText('Item 1').closest('button')!;
    const panelId = trigger.getAttribute('aria-controls');
    expect(panelId).toBe('accordion-panel-item-1');
    expect(document.getElementById(panelId!)).toBeDefined();
  });

  it('panels have role region and aria-labelledby', () => {
    render(<Accordion items={defaultItems} />);
    const regions = screen.getAllByRole('region');
    expect(regions.length).toBe(3);
    expect(regions[0].getAttribute('aria-labelledby')).toBe(
      'accordion-trigger-item-1'
    );
  });
});
