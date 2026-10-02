/**
 * Join class names, dropping anything falsy.
 *
 * Deliberately not `clsx` or `tailwind-merge`: the components below never build conflicting
 * utilities, because variants are looked up from a record rather than concatenated conditionally.
 * A merge library would paper over that design, and it's one more dependency for ~8 lines.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** The focus ring every interactive component shares, so keyboard users get one consistent signal. */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0';
