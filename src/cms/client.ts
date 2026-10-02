import { execute, parse } from 'graphql';
import { schema } from './schema';
import type { Page } from './content';

/**
 * The query the page renderer runs.
 *
 * Written as a document with inline fragments per block type — the shape a headless CMS expects —
 * rather than fetching a page and reaching into it. That keeps the over-fetching honest: the page
 * asks for exactly the fields it renders, and adding a block type means adding a fragment here.
 */
export const PAGE_QUERY = /* GraphQL */ `
  query Page($slug: ID!) {
    page(slug: $slug) {
      slug
      title
      description
      blocks {
        __typename
        ... on HeroBlock {
          eyebrow
          heading
          body
          primaryCta {
            label
            href
          }
          secondaryCta {
            label
            href
          }
        }
        ... on FeatureGridBlock {
          heading
          features {
            id
            title
            body
            badge
          }
        }
        ... on MetricsBlock {
          heading
          metrics {
            id
            value
            label
          }
        }
        ... on FaqBlock {
          heading
          questions {
            id
            question
            answer
          }
        }
        ... on CtaBlock {
          heading
          body
          cta {
            label
            href
          }
        }
      }
    }
  }
`;

/**
 * Fetch a page.
 *
 * With CMS_GRAPHQL_ENDPOINT set this POSTs to the real CMS. Without it, the same document is
 * executed against the local schema in-process — no HTTP, no server to start, and server
 * components can call it directly during rendering.
 */
export async function getPage(slug: string): Promise<Page | null> {
  const endpoint = process.env.CMS_GRAPHQL_ENDPOINT;

  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.CMS_TOKEN ? { Authorization: `Bearer ${process.env.CMS_TOKEN}` } : {})
      },
      body: JSON.stringify({ query: PAGE_QUERY, variables: { slug } }),
      // Content is revalidated rather than cached forever, so an editor's change appears without
      // a redeploy.
      next: { revalidate: 60, tags: [`page:${slug}`] }
    });

    if (!response.ok) throw new Error(`CMS responded ${response.status}`);

    const json = (await response.json()) as { data?: { page: Page | null }; errors?: unknown[] };
    if (json.errors?.length) throw new Error(`CMS query failed: ${JSON.stringify(json.errors)}`);

    return json.data?.page ?? null;
  }

  const result = await execute({
    schema,
    document: parse(PAGE_QUERY),
    variableValues: { slug }
  });

  if (result.errors?.length) throw new Error(`Content query failed: ${result.errors[0]?.message}`);

  return ((result.data as { page: Page | null } | undefined)?.page) ?? null;
}
