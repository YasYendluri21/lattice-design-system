import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  /** Announce the badge to screen readers with a prefix, e.g. "Status: Active". */
  label?: string;
}

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-neutral-100 text-neutral-700',
  brand: 'bg-brand-50 text-brand-700',
  success: 'bg-success-100 text-success-500',
  warning: 'bg-warning-100 text-warning-500',
  danger: 'bg-danger-100 text-danger-500',
  info: 'bg-info-100 text-info-500'
};

/**
 * A status marker. Colour alone never carries the meaning — the text does, which is what keeps it
 * usable for colour-blind readers and satisfies WCAG 1.4.1.
 */
export function Badge({ tone = 'neutral', children, label }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        TONES[tone]
      )}
    >
      {label && <span className="sr-only">{label}: </span>}
      {children}
    </span>
  );
}
