import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Hello</Card>);
    expect(screen.getByText('Hello')).toBeDefined();
  });

  it('applies default padding and shadow', () => {
    const { container } = render(<Card>Test</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el.dataset.padding).toBe('md');
    expect(el.dataset.shadow).toBe('sm');
  });

  it('applies custom padding and shadow', () => {
    const { container } = render(
      <Card padding="lg" shadow="lg">Test</Card>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.dataset.padding).toBe('lg');
    expect(el.dataset.shadow).toBe('lg');
  });
});
