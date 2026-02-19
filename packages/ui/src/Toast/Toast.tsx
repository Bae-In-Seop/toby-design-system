import React, { createContext, useContext, useCallback, useState, useEffect, useRef } from 'react';
import styles from './Toast.module.css';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

export interface ToastProps {
  item: ToastItem;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ item, onClose }) => {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const duration = item.duration ?? 3000;
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        setExiting(true);
      }, duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [item.duration]);

  const handleAnimationEnd = () => {
    if (exiting) {
      onClose(item.id);
    }
  };

  return (
    <div
      role="alert"
      data-variant={item.variant}
      data-exiting={exiting || undefined}
      className={styles.toast}
      onAnimationEnd={handleAnimationEnd}
    >
      <span className={styles.message}>{item.message}</span>
      <button
        className={styles.closeButton}
        onClick={() => setExiting(true)}
        aria-label="Close"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M11 3L3 11M3 3L11 11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

// --- Context & Provider ---

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const toast = useCallback((message: string, variant: ToastVariant = 'info', duration?: number) => {
    const id = `toast-${++counterRef.current}`;
    setToasts((prev) => [...prev, { id, message, variant, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className={styles.container} aria-live="polite">
        {toasts.map((item) => (
          <Toast key={item.id} item={item} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
