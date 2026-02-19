import React from 'react';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  shadow = 'sm',
  ...props
}) => {
  return (
    <div
      data-padding={padding}
      data-shadow={shadow}
      className={styles.card}
      {...props}
    >
      {children}
    </div>
  );
};
