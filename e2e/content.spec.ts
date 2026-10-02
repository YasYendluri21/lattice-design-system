import { expect, test } from '@playwright/test';

/**
 * Content rendering and the API behind it. Platform-independent, so unlike the keyboard suite
 * these run on every project including mobile — a block that fails to render at 390px wide is
 * exactly the kind of thing worth catching.
 */

test.describe('Content', () => {
  test('the page renders from the CMS, including blocks below the fold', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Components your editors');
    await expect(page.getByRole('heading', { name: 'How it fits together' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Questions we get' })).toBeVisible();
  });

  test('the GraphQL endpoint answers the same query the page uses', async ({ request }) => {
    const response = await request.post('/api/graphql', {
      data: { query: '{ page(slug: "home") { title blocks { __typename } } }' }
    });

    expect(response.ok()).toBeTruthy();
    const body = (await response.json()) as {
      data: { page: { title: string; blocks: Array<{ __typename: string }> } };
    };

    expect(body.data.page.title).toContain('Lattice');
    expect(body.data.page.blocks.map((b) => b.__typename)).toEqual([
      'HeroBlock',
      'MetricsBlock',
      'FeatureGridBlock',
      'FaqBlock',
      'CtaBlock'
    ]);
  });
});
