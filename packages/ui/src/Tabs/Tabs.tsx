import React, { useState, useRef, useCallback } from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  size = 'md',
}) => {
  const [internalValue, setInternalValue] = useState(
    defaultValue || items[0]?.value || ''
  );
  const tabsRef = useRef<HTMLDivElement>(null);

  const activeValue = controlledValue ?? internalValue;

  const handleSelect = useCallback(
    (tabValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(tabValue);
      }
      onChange?.(tabValue);
    },
    [controlledValue, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const enabledItems = items.filter((item) => !item.disabled);
      const currentIndex = enabledItems.findIndex((item) => item.value === activeValue);

      let nextIndex = currentIndex;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % enabledItems.length;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = enabledItems.length - 1;
      } else {
        return;
      }

      const nextValue = enabledItems[nextIndex].value;
      handleSelect(nextValue);

      // Focus the new tab
      const buttons = tabsRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([disabled])'
      );
      buttons?.[nextIndex]?.focus();
    },
    [items, activeValue, handleSelect]
  );

  const activeItem = items.find((item) => item.value === activeValue);

  return (
    <div data-size={size} className={styles.tabs}>
      <div
        ref={tabsRef}
        role="tablist"
        className={styles.tabList}
        onKeyDown={handleKeyDown}
      >
        {items.map((item) => (
          <button
            key={item.value}
            role="tab"
            type="button"
            id={`tab-${item.value}`}
            aria-selected={item.value === activeValue}
            aria-controls={`tabpanel-${item.value}`}
            tabIndex={item.value === activeValue ? 0 : -1}
            disabled={item.disabled}
            data-active={item.value === activeValue || undefined}
            className={styles.tab}
            onClick={() => handleSelect(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {activeItem && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeItem.value}`}
          aria-labelledby={`tab-${activeItem.value}`}
          className={styles.panel}
        />
      )}
    </div>
  );
};
