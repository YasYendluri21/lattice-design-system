'use client';

import { useId, forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cx, focusRing } from '@/lib/cx';

interface FieldShellProps {
  label: string;
  /** Guidance shown under the label. Wired to the control with aria-describedby. */
  hint?: string;
  /** Validation message. Replaces the hint in the accessible description and marks the control invalid. */
  error?: string;
  required?: boolean;
  children: (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
}

/**
 * The shared label / hint / error scaffolding behind every form control.
 *
 * The wiring is the whole point: a visible label tied by `htmlFor`, hint and error text linked
 * through `aria-describedby`, and `aria-invalid` set from the error. Done in one place, every
 * control in the library inherits it — done per-component, one of them always gets it wrong.
 */
function FieldShell({ label, hint, error, required, children }: FieldShellProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  // Error supersedes hint in the description, so a screen reader doesn't read stale guidance
  // ahead of the actual problem.
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-800">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="ml-0.5 text-danger-500">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>

      {hint && !error && (
        <p id={hintId} className="text-sm text-neutral-500">
          {hint}
        </p>
      )}

      {children({ id, describedBy, invalid: Boolean(error) })}

      {error && (
        <p id={errorId} className="text-sm font-medium text-danger-500">
          {error}
        </p>
      )}
    </div>
  );
}

const CONTROL =
  'h-10 w-full rounded-md border bg-neutral-0 px-3 text-base text-neutral-900 placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400';

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className' | 'required'> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, required, ...props },
  ref
) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      {({ id, describedBy, invalid }) => (
        <input
          ref={ref}
          id={id}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cx(CONTROL, focusRing, invalid ? 'border-danger-500' : 'border-neutral-300')}
          {...props}
        />
      )}
    </FieldShell>
  );
});

export interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'className' | 'required'> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, hint, error, required, options, ...props },
  ref
) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      {({ id, describedBy, invalid }) => (
        <select
          ref={ref}
          id={id}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cx(CONTROL, focusRing, invalid ? 'border-danger-500' : 'border-neutral-300')}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
});

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className' | 'type'> {
  label: string;
  hint?: string;
}

export function Checkbox({ label, hint, ...props }: CheckboxProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className="flex gap-2.5">
      <input
        id={id}
        type="checkbox"
        aria-describedby={hint ? hintId : undefined}
        className={cx(
          'mt-0.5 size-4 shrink-0 rounded-sm border-neutral-300 text-brand-600 accent-brand-600',
          focusRing
        )}
        {...props}
      />
      <div className="flex flex-col gap-0.5">
        <label htmlFor={id} className="text-sm text-neutral-800">
          {label}
        </label>
        {hint && (
          <p id={hintId} className="text-sm text-neutral-500">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
