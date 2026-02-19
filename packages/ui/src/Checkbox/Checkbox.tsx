import React, { useRef, useEffect } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  size = 'md',
  indeterminate = false,
  disabled,
  id,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = React.useId();
  const checkboxId = id || `checkbox-${generatedId}`;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      data-size={size}
      data-disabled={disabled || undefined}
      className={styles.wrapper}
      htmlFor={checkboxId}
    >
      <input
        ref={inputRef}
        type="checkbox"
        id={checkboxId}
        disabled={disabled}
        className={styles.input}
        {...props}
      />
      <span className={styles.control} aria-hidden="true">
        <svg className={styles.checkIcon} viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6L5 9L10 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg className={styles.indeterminateIcon} viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6H10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};
