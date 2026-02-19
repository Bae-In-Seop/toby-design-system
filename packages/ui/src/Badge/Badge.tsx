import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'full';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  radius = 'full',
  ...props
}) => {
  return (
    <span
      data-variant={variant}
      data-size={size}
      data-radius={radius}
      className={styles.badge}
      {...props}
    >
      {children}
    </span>
  );
};
