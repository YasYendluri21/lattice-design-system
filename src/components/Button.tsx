import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx, focusRing } from '@/lib/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders a spinner, disables the button, and announces the state to screen readers. */
  loading?: boolean;
  /** Stretches to the width of its container. */
  block?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-neutral-0 hover:bg-brand-700 active:bg-brand-800',
  secondary:
    'bg-neutral-0 text-neutral-800 border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
  danger: 'bg-danger-500 text-neutral-0 hover:brightness-110 active:brightness-95'
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-base gap-2',
  lg: 'h-12 px-6 text-lg gap-2.5'
};

/**
 * The library's primary action control.
 *
 * Two accessibility decisions worth noting. A loading button stays focusable rather than becoming
 * `disabled`, because a disabled element drops out of the tab order mid-interaction and silently
 * moves the user's focus — `aria-disabled` plus a click guard keeps focus where the user put it.
 * And decorative icons are hidden from assistive tech, so the accessible name is the label alone.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, block = false, iconLeft, iconRight, children, disabled, onClick, ...props },
  ref
) {
  const inert = disabled || loading;

  return (
    <button
      ref={ref}
      // Genuinely disabled buttons use the attribute; busy ones only report as disabled, so they
      // keep focus and the state change is announced rather than silently swallowed.
      disabled={disabled}
      aria-disabled={inert || undefined}
      aria-busy={loading || undefined}
      onClick={(event) => {
        if (inert) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      className={cx(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
        focusRing,
        VARIANTS[variant],
        SIZES[size],
        block && 'w-full'
      )}
      {...props}
    >
      {loading ? (
        <svg className="size-4 animate-spin" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
          <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        iconLeft && <span aria-hidden="true">{iconLeft}</span>
      )}

      {children}

      {iconRight && !loading && <span aria-hidden="true">{iconRight}</span>}
    </button>
  );
});
