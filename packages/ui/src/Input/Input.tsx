import React, { useRef, useState } from 'react';
import styles from './Input.module.css';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  label?: string;
  searchIcon?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="2" />
    <path d="M11 11L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ClearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M11 3L3 11M3 3L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Input: React.FC<InputProps> = ({
  variant = 'outlined',
  size = 'md',
  error,
  label,
  searchIcon = false,
  clearable = false,
  onClear,
  value,
  defaultValue,
  onChange,
  id,
  disabled,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(
    (defaultValue as string) ?? ''
  );

  const currentValue = isControlled ? String(value) : internalValue;
  const hasValue = currentValue.length > 0;
  const showClear = clearable && hasValue && !disabled;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
      // 비제어 모드: input의 value를 직접 비우고 onChange 이벤트 발생
      if (inputRef.current) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype, 'value'
        )?.set;
        nativeInputValueSetter?.call(inputRef.current, '');
        inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div
        className={styles.inputWrapper}
        data-has-search={searchIcon || undefined}
        data-has-clear={showClear || undefined}
        data-size={size}
      >
        {searchIcon && (
          <span className={styles.searchIcon}>
            <SearchIcon />
          </span>
        )}
        <input
          ref={inputRef}
          id={inputId}
          data-variant={variant}
          data-size={size}
          data-error={error ? true : undefined}
          data-has-search={searchIcon || undefined}
          data-has-clear={showClear || undefined}
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          value={isControlled ? value : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        {showClear && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear input"
            tabIndex={-1}
          >
            <ClearIcon />
          </button>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
