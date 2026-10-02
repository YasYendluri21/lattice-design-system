'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cx, focusRing } from '@/lib/cx';
import { Button } from './Button';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A modal dialog — the component where accessibility is genuinely hard, and where most
 * implementations get at least one of these four things wrong:
 *
 * 1. **Focus moves in.** On open, focus goes to the dialog, not left behind on the page underneath.
 * 2. **Focus is trapped.** Tab and Shift+Tab cycle within the dialog; they cannot reach the page
 *    behind it, which from a screen reader's perspective no longer exists.
 * 3. **Focus is restored.** On close, focus returns to the element that opened it. Skipping this
 *    dumps a keyboard user back at the top of the document with no idea where they are.
 * 4. **Escape closes it**, and the background does not scroll underneath.
 *
 * `aria-modal` plus `role="dialog"` tells assistive tech the rest of the page is inert, and the
 * title and description are linked so both are announced on open.
 */
export function Dialog({ open, onClose, title, description, children, footer }: DialogProps) {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    // Remember where focus came from before moving it.
    restoreTo.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;

      // Wrap at both ends so Tab can never escape the dialog.
      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      // Return focus to whatever opened the dialog.
      restoreTo.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Clicking the backdrop closes. It is aria-hidden because the close button is the
          accessible route out — a div with a click handler is not a control. */}
      <div className="absolute inset-0 bg-neutral-950/40" aria-hidden="true" onClick={onClose} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-description` : undefined}
        tabIndex={-1}
        className={cx(
          'relative w-full max-w-lg rounded-xl bg-neutral-0 p-6 shadow-lg',
          focusRing
        )}
      >
        <h2 id={`${id}-title`} className="text-xl font-semibold text-neutral-900">
          {title}
        </h2>

        {description && (
          <p id={`${id}-description`} className="mt-2 text-base text-neutral-600">
            {description}
          </p>
        )}

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex justify-end gap-3">
          {footer ?? (
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
