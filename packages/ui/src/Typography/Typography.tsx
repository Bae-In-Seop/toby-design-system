import React from 'react';
import styles from './Typography.module.css';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  variant?: 'heading' | 'body' | 'caption';
  size?: 'sm' | 'md' | 'lg';
  muted?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  as: Tag = 'p',
  variant = 'body',
  size = 'md',
  muted = false,
  ...props
}) => {
  return (
    <Tag
      data-variant={variant}
      data-size={size}
      data-muted={muted || undefined}
      className={styles.typography}
      {...props}
    >
      {children}
    </Tag>
  );
};
