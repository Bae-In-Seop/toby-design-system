import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeDefined();
  });

  it('applies default variant, size, and radius', () => {
    const { container } = render(<Badge>Test</Badge>);
    const el = container.firstChild as HTMLElement;
    expect(el.dataset.variant).toBe('primary');
    expect(el.dataset.size).toBe('md');
    expect(el.dataset.radius).toBe('full');
  });

  it('applies custom variant, size, and radius', () => {
    const { container } = render(
      <Badge variant="success" size="sm" radius="md">OK</Badge>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.dataset.variant).toBe('success');
    expect(el.dataset.size).toBe('sm');
    expect(el.dataset.radius).toBe('md');
  });
});
