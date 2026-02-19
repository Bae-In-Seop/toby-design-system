import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Select } from './Select';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

describe('Select', () => {
  it('renders options', () => {
    render(<Select options={options} />);
    expect(screen.getByText('Option A')).toBeDefined();
    expect(screen.getByText('Option B')).toBeDefined();
  });

  it('renders placeholder', () => {
    render(<Select options={options} placeholder="Choose..." />);
    expect(screen.getByText('Choose...')).toBeDefined();
  });

  it('renders label', () => {
    render(<Select options={options} label="Category" />);
    expect(screen.getByLabelText('Category')).toBeDefined();
  });

  it('shows error message', () => {
    render(<Select options={options} label="Category" error="Required" />);
    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText('Required')).toBeDefined();
  });

  it('applies default size', () => {
    render(<Select options={options} />);
    const el = screen.getByRole('combobox');
    expect(el.dataset.size).toBe('md');
  });
});
