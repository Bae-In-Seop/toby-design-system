import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Hello</Button>);
    expect(screen.getByRole('button', { name: 'Hello' })).toBeDefined();
  });

  it('applies default variant and size', () => {
    render(<Button>Test</Button>);
    const el = screen.getByRole('button');
    expect(el.dataset.variant).toBe('primary');
    expect(el.dataset.size).toBe('md');
  });

  it('applies custom variant and size', () => {
    render(<Button variant="secondary" size="lg">Test</Button>);
    const el = screen.getByRole('button');
    expect(el.dataset.variant).toBe('secondary');
    expect(el.dataset.size).toBe('lg');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Test</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows spinner when loading', () => {
    const { container } = render(<Button loading>Test</Button>);
    expect(container.querySelector('[aria-hidden="true"]')).toBeDefined();
  });
});
