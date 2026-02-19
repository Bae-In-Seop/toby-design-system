import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Typography } from './Typography';

describe('Typography', () => {
  it('renders children correctly', () => {
    render(<Typography>Hello</Typography>);
    expect(screen.getByText('Hello')).toBeDefined();
  });

  it('renders as p tag by default', () => {
    const { container } = render(<Typography>Test</Typography>);
    expect(container.querySelector('p')).toBeDefined();
  });

  it('renders with custom as tag', () => {
    const { container } = render(<Typography as="h1">Title</Typography>);
    expect(container.querySelector('h1')).toBeDefined();
  });

  it('applies default variant and size', () => {
    const { container } = render(<Typography>Test</Typography>);
    const el = container.firstChild as HTMLElement;
    expect(el.dataset.variant).toBe('body');
    expect(el.dataset.size).toBe('md');
  });

  it('applies muted style', () => {
    const { container } = render(<Typography muted>Test</Typography>);
    const el = container.firstChild as HTMLElement;
    expect(el.dataset.muted).toBe('true');
  });
});
