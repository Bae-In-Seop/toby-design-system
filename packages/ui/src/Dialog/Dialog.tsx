import React, { useEffect, useRef, useCallback } from 'react';
import styles from './Dialog.module.css';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not(:disabled), textarea:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])';

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = `dialog-title-${title.toLowerCase().replace(/\s+/g, '-')}`;

  // Focus trap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusableEls = dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
      const firstEl = focusableEls[0] as HTMLElement;
      const lastEl = focusableEls[focusableEls.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl?.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl?.focus();
        }
      }
    },
    [onClose]
  );

  // Save focus & auto-focus on open, restore on close
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus first focusable element inside dialog
      const timer = setTimeout(() => {
        if (!dialogRef.current) return;
        const firstFocusable = dialogRef.current.querySelector(
          FOCUSABLE_SELECTOR
        ) as HTMLElement;
        firstFocusable?.focus();
      }, 0);

      return () => clearTimeout(timer);
    } else {
      // Restore focus
      previousFocusRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close dialog"
          >
            &#10005;
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
