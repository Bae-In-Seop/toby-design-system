import React, { useState, useRef, useCallback } from 'react';
import styles from './Accordion.module.css';

export interface AccordionItem {
  value: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  type = 'single',
  collapsible = true,
  size = 'md',
}) => {
  const [internalValue, setInternalValue] = useState<string | string[]>(() => {
    if (defaultValue !== undefined) return defaultValue;
    return type === 'multiple' ? [] : '';
  });
  const triggersRef = useRef<(HTMLButtonElement | null)[]>([]);

  const activeValue = controlledValue ?? internalValue;

  const isOpen = useCallback(
    (itemValue: string): boolean => {
      if (Array.isArray(activeValue)) {
        return activeValue.includes(itemValue);
      }
      return activeValue === itemValue;
    },
    [activeValue]
  );

  const handleToggle = useCallback(
    (itemValue: string) => {
      let nextValue: string | string[];

      if (type === 'multiple') {
        const current = Array.isArray(activeValue) ? activeValue : [];
        if (current.includes(itemValue)) {
          nextValue = current.filter((v) => v !== itemValue);
        } else {
          nextValue = [...current, itemValue];
        }
      } else {
        if (activeValue === itemValue) {
          nextValue = collapsible ? '' : itemValue;
        } else {
          nextValue = itemValue;
        }
      }

      if (controlledValue === undefined) {
        setInternalValue(nextValue);
      }
      onChange?.(nextValue);
    },
    [type, activeValue, collapsible, controlledValue, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const enabledIndices = items
        .map((item, i) => (!item.disabled ? i : -1))
        .filter((i) => i !== -1);
      const currentTrigger = e.target as HTMLElement;
      const currentIndex = triggersRef.current.indexOf(
        currentTrigger as HTMLButtonElement
      );
      const enabledPosition = enabledIndices.indexOf(currentIndex);

      if (enabledPosition === -1) return;

      let nextPosition = enabledPosition;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        nextPosition = (enabledPosition + 1) % enabledIndices.length;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        nextPosition =
          (enabledPosition - 1 + enabledIndices.length) %
          enabledIndices.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextPosition = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextPosition = enabledIndices.length - 1;
      } else {
        return;
      }

      triggersRef.current[enabledIndices[nextPosition]]?.focus();
    },
    [items]
  );

  return (
    <div data-size={size} className={styles.accordion}>
      {items.map((item, index) => {
        const open = isOpen(item.value);
        return (
          <div
            key={item.value}
            className={styles.item}
            data-disabled={item.disabled || undefined}
          >
            <h3 className={styles.header}>
              <button
                ref={(el) => {
                  triggersRef.current[index] = el;
                }}
                type="button"
                id={`accordion-trigger-${item.value}`}
                aria-expanded={open}
                aria-controls={`accordion-panel-${item.value}`}
                disabled={item.disabled}
                className={styles.trigger}
                onClick={() => handleToggle(item.value)}
                onKeyDown={handleKeyDown}
              >
                <span className={styles.triggerText}>{item.label}</span>
                <span className={styles.icon} aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={`accordion-panel-${item.value}`}
              role="region"
              aria-labelledby={`accordion-trigger-${item.value}`}
              className={styles.panel}
              data-open={open || undefined}
            >
              <div className={styles.panelContent}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
