import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Dialog open={false} onClose={() => {}} title="Test">
        Content
      </Dialog>
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders content when open', () => {
    render(
      <Dialog open={true} onClose={() => {}} title="Test Title">
        Dialog content
      </Dialog>
    );
    expect(screen.getByText('Dialog content')).toBeDefined();
    expect(screen.getByText('Test Title')).toBeDefined();
  });

  it('has correct aria attributes', () => {
    render(
      <Dialog open={true} onClose={() => {}} title="Test">
        Content
      </Dialog>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBeDefined();
  });

  it('calls onClose when ESC is pressed', () => {
    const onClose = vi.fn();
    render(
      <Dialog open={true} onClose={onClose} title="Test">
        Content
      </Dialog>
    );
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Dialog open={true} onClose={onClose} title="Test">
        Content
      </Dialog>
    );
    fireEvent.click(screen.getByLabelText('Close dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open={true} onClose={onClose} title="Test">
        Content
      </Dialog>
    );
    // Click backdrop (the first child element)
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
