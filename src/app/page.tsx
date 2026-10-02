import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/blocks/BlockRenderer';
import { getPage } from '@/cms/client';

/**
 * The marketing page, composed entirely from CMS content.
 *
 * A server component: the content query runs during render, so the HTML ships complete and the
 * only JavaScript the visitor downloads is for the components that genuinely need it — the
 * accordion in the FAQ block, and nothing else on this page.
 */

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('home');
  if (!page) return {};
  return { title: page.title, description: page.description };
}

export default async function HomePage() {
  const page = await getPage('home');
  if (!page) notFound();

  return <BlockRenderer blocks={page.blocks} />;
}
