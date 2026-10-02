import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Lattice Design System', template: '%s · Lattice' },
  description:
    'An accessible React component library driven by design tokens, with pages composed from a headless CMS.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // lang is required for screen readers to pick the right pronunciation rules (WCAG 3.1.1).
    <html lang="en">
      <body className="bg-neutral-0 font-sans text-neutral-900 antialiased">
        <a href="#main" className="skip-link rounded-md bg-brand-700 px-4 py-2 text-neutral-0">
          Skip to content
        </a>

        <header className="border-b border-neutral-200">
          <nav aria-label="Main" className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-neutral-900 no-underline">
              <span aria-hidden="true" className="size-5 rounded bg-brand-600" />
              Lattice
            </Link>
            <div className="ml-auto flex gap-5 text-base">
              <Link href="/" className="text-neutral-600 no-underline hover:text-brand-700">
                Overview
              </Link>
              <Link href="/components" className="text-neutral-600 no-underline hover:text-brand-700">
                Components
              </Link>
            </div>
          </nav>
        </header>

        <main id="main">{children}</main>

        <footer className="border-t border-neutral-200 py-10">
          <div className="mx-auto max-w-5xl px-6 text-sm text-neutral-500">
            Built with Next.js, TypeScript and Tailwind. Content served over GraphQL.
          </div>
        </footer>
      </body>
    </html>
  );
}
