import React from 'react';
import styles from './Switch.module.css';

export interface SwitchProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type' | 'role'
  > {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  size = 'md',
  disabled,
  id,
  ...props
}) => {
  const generatedId = React.useId();
  const switchId = id || `switch-${generatedId}`;

  return (
    <label
      data-size={size}
      data-disabled={disabled || undefined}
      className={styles.wrapper}
      htmlFor={switchId}
    >
      <input
        type="checkbox"
        role="switch"
        id={switchId}
        disabled={disabled}
        className={styles.input}
        {...props}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};
