'use client';

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx, focusRing } from '@/lib/cx';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  /** Tab selected on first render. Defaults to the first item. */
  defaultTab?: string;
  'aria-label': string;
}

/**
 * Tabs implementing the WAI-ARIA pattern, including roving tabindex.
 *
 * The behaviour people usually miss: a tab list is **one** tab stop, not one per tab. Only the
 * selected tab has `tabIndex={0}`; the rest are `-1`, and arrow keys move between them. Without
 * that, a user tabbing through a page with eight tabs takes eight presses to get past them.
 *
 * Arrow keys wrap, Home and End jump to the ends, and focus follows selection — which is the
 * correct choice here because panels render instantly. Were a panel expensive to load, selection
 * should decouple from focus and require Enter or Space.
 */
export function Tabs({ items, defaultTab, 'aria-label': ariaLabel }: TabsProps) {
  const base = useId();
  const [selected, setSelected] = useState(defaultTab ?? items[0]?.id ?? '');
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  function select(id: string) {
    setSelected(id);
    tabRefs.current.get(id)?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = items.length - 1;
    let next: number | null = null;

    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;

    if (next !== null) {
      event.preventDefault();
      const target = items[next];
      if (target) select(target.id);
    }
  }

  return (
    <div>
      <div role="tablist" aria-label={ariaLabel} className="flex gap-1 border-b border-neutral-200">
        {items.map((item, index) => {
          const active = item.id === selected;

          return (
            <button
              key={item.id}
              ref={(node) => {
                if (node) tabRefs.current.set(item.id, node);
                else tabRefs.current.delete(item.id);
              }}
              type="button"
              role="tab"
              id={`${base}-${item.id}-tab`}
              aria-selected={active}
              aria-controls={`${base}-${item.id}-panel`}
              // Roving tabindex: the tab list is a single stop in the page's tab order.
              tabIndex={active ? 0 : -1}
              onClick={() => select(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cx(
                '-mb-px border-b-2 px-4 py-2.5 text-base font-medium transition-colors',
                focusRing,
                active
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-800'
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${base}-${item.id}-panel`}
          aria-labelledby={`${base}-${item.id}-tab`}
          hidden={item.id !== selected}
          // The panel takes focus when tabbed to, so keyboard users reach its content directly
          // rather than landing on the first focusable thing inside it.
          tabIndex={0}
          className={cx('py-6 text-base leading-relaxed text-neutral-600', focusRing)}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
