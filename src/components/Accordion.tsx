'use client';

import { useId, useState, type ReactNode } from 'react';
import { cx, focusRing } from '@/lib/cx';

export interface AccordionItem {
  id: string;
  question: string;
  answer: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow several panels open at once. Single mode still lets the open panel be closed. */
  multiple?: boolean;
  /** Heading level for each trigger, so the accordion fits the page's outline. */
  headingLevel?: 2 | 3 | 4;
}

/**
 * A disclosure group following the WAI-ARIA accordion pattern.
 *
 * Each trigger is a real `<button>` inside a heading of the caller's chosen level, so screen-reader
 * users can navigate the accordion from the headings list. `aria-expanded` carries the state and
 * `aria-controls` points at the panel. Native buttons mean Enter and Space work without any
 * keyboard handling of our own — writing one would only risk breaking what the platform already
 * does correctly.
 *
 * Panels are unmounted when closed rather than hidden, so collapsed content is not reachable by
 * Tab. `hidden` alone would be enough for assistive tech but leaves focusable children in the tab
 * order in some browsers.
 */
export function Accordion({ items, multiple = false, headingLevel = 3 }: AccordionProps) {
  const base = useId();
  const [open, setOpen] = useState<Set<string>>(new Set());
  const Heading = `h${headingLevel}` as const;

  function toggle(id: string) {
    setOpen((current) => {
      const next = new Set(multiple ? current : []);
      if (current.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {items.map((item) => {
        const expanded = open.has(item.id);
        const triggerId = `${base}-${item.id}-trigger`;
        const panelId = `${base}-${item.id}-panel`;

        return (
          <div key={item.id}>
            <Heading className="m-0">
              <button
                type="button"
                id={triggerId}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className={cx(
                  'flex w-full items-center justify-between gap-4 py-4 text-left',
                  'text-base font-medium text-neutral-900 hover:text-brand-700',
                  focusRing
                )}
              >
                {item.question}
                <svg
                  className={cx('size-5 shrink-0 text-neutral-400 transition-transform', expanded && 'rotate-180')}
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Heading>

            {expanded && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="pb-5 pr-8 text-base leading-relaxed text-neutral-600"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
