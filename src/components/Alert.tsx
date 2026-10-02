import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
}

const TONES: Record<AlertTone, { box: string; icon: string; path: string }> = {
  info: {
    box: 'bg-info-100 border-info-500/30 text-neutral-800',
    icon: 'text-info-500',
    path: 'M10 9v5m0-8h.01'
  },
  success: {
    box: 'bg-success-100 border-success-500/30 text-neutral-800',
    icon: 'text-success-500',
    path: 'm6.5 10.5 2.5 2.5 4.5-5'
  },
  warning: {
    box: 'bg-warning-100 border-warning-500/30 text-neutral-800',
    icon: 'text-warning-500',
    path: 'M10 6.5v4m0 3h.01'
  },
  danger: {
    box: 'bg-danger-100 border-danger-500/30 text-neutral-800',
    icon: 'text-danger-500',
    path: 'm7 7 6 6m0-6-6 6'
  }
};

/**
 * A page-level message.
 *
 * `danger` and `warning` announce assertively because they interrupt what the user was doing;
 * `info` and `success` use a polite live region so they wait for a pause in speech. Getting that
 * backwards is a common and genuinely disruptive accessibility bug.
 */
export function Alert({ tone = 'info', title, children }: AlertProps) {
  const style = TONES[tone];
  const urgent = tone === 'danger' || tone === 'warning';

  return (
    <div
      role={urgent ? 'alert' : 'status'}
      aria-live={urgent ? 'assertive' : 'polite'}
      className={cx('flex gap-3 rounded-md border p-4', style.box)}
    >
      <svg className={cx('mt-0.5 size-5 shrink-0', style.icon)} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
        <path d={style.path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        {children && <div className="mt-1 text-sm leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}
