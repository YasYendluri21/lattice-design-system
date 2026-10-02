import Link from 'next/link';
import type { ReactNode } from 'react';
import { cx, focusRing } from '@/lib/cx';
import type { ButtonSize, ButtonVariant } from './Button';

export interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  /** Set for links leaving the site. Adds the security rel and announces the new tab. */
  external?: boolean;
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
 * A link that looks like a button.
 *
 * Separate from `Button` on purpose. Something that navigates must be an `<a>`: it belongs in the
 * browser's link list, it works with middle-click and "open in new tab", and screen readers
 * announce it as a link rather than a control. A `<button onClick={router.push}>` looks identical
 * and breaks all three.
 */
export function ButtonLink({ href, variant = 'primary', size = 'md', children, external }: ButtonLinkProps) {
  const className = cx(
    'inline-flex items-center justify-center rounded-md font-medium no-underline transition-colors',
    focusRing,
    VARIANTS[variant],
    SIZES[size]
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
