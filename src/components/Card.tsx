import type { ElementType, ReactNode } from 'react';
import { cx } from '@/lib/cx';

export interface CardProps {
  children: ReactNode;
  /** Adds hover elevation. Use only when the whole card is a link or button. */
  interactive?: boolean;
  /** Override the element — `article` for standalone content, `li` inside a list. */
  as?: ElementType;
  className?: string;
}

export function Card({ children, interactive = false, as: Tag = 'div', className }: CardProps) {
  return (
    <Tag
      className={cx(
        'rounded-lg border border-neutral-200 bg-neutral-0 p-6 shadow-sm',
        interactive && 'transition-shadow hover:shadow-md focus-within:shadow-md',
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function CardTitle({ children, as: Tag = 'h3' }: { children: ReactNode; as?: ElementType }) {
  return <Tag className="text-lg font-semibold text-neutral-900">{children}</Tag>;
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div className="mt-2 text-base leading-relaxed text-neutral-600">{children}</div>;
}
