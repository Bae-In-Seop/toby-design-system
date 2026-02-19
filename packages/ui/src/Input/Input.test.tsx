import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeDefined();
  });

  it('applies default variant and size', () => {
    render(<Input placeholder="test" />);
    const el = screen.getByPlaceholderText('test');
    expect(el.dataset.variant).toBe('outlined');
    expect(el.dataset.size).toBe('md');
  });

  it('renders label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeDefined();
  });

  it('shows error message', () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText('Required')).toBeDefined();
  });

  it('sets aria-invalid when error exists', () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByLabelText('Email').getAttribute('aria-invalid')).toBe('true');
  });

  it('renders search icon when searchIcon is true', () => {
    const { container } = render(<Input placeholder="Search..." searchIcon />);
    const input = screen.getByPlaceholderText('Search...');
    expect(input.dataset.hasSearch).toBeDefined();
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('renders clear button when clearable and has value', () => {
    render(<Input placeholder="test" clearable value="hello" onChange={() => {}} />);
    expect(screen.getByLabelText('Clear input')).toBeDefined();
  });

  it('does not render clear button when value is empty', () => {
    render(<Input placeholder="test" clearable value="" onChange={() => {}} />);
    expect(screen.queryByLabelText('Clear input')).toBeNull();
  });

  it('calls onClear when clear button is clicked', async () => {
    const onClear = vi.fn();
    render(<Input clearable value="hello" onChange={() => {}} onClear={onClear} />);

    await userEvent.click(screen.getByLabelText('Clear input'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('does not show clear button when disabled', () => {
    render(<Input clearable value="hello" onChange={() => {}} disabled />);
    expect(screen.queryByLabelText('Clear input')).toBeNull();
  });

  it('shows clear button in uncontrolled mode after typing', async () => {
    render(<Input placeholder="type..." clearable />);
    const input = screen.getByPlaceholderText('type...');

    expect(screen.queryByLabelText('Clear input')).toBeNull();

    await userEvent.type(input, 'hello');
    expect(screen.getByLabelText('Clear input')).toBeDefined();
  });

  it('clears value in uncontrolled mode', async () => {
    render(<Input placeholder="type..." clearable />);
    const input = screen.getByPlaceholderText('type...');

    await userEvent.type(input, 'hello');
    expect(screen.getByLabelText('Clear input')).toBeDefined();

    await userEvent.click(screen.getByLabelText('Clear input'));
    expect(screen.queryByLabelText('Clear input')).toBeNull();
  });
});
