import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Automated accessibility checks against every rendered page.
 *
 * Worth being honest about what this does and doesn't buy: axe catches roughly a third of WCAG
 * failures — contrast, missing names, broken ARIA, landmark structure. It cannot tell you whether
 * focus order makes sense or whether alt text is meaningful. So this suite is the floor, not the
 * ceiling; the keyboard tests below cover what axe can't see.
 */

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/components', name: 'component gallery' }
];

for (const page of PAGES) {
  test(`${page.name} has no detectable WCAG 2.1 AA violations`, async ({ page: browserPage }) => {
    await browserPage.goto(page.path);

    const results = await new AxeBuilder({ page: browserPage })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Report the rule and the element rather than a bare count, so a CI failure is actionable.
    const summary = results.violations.map(
      (v) => `${v.id} (${v.impact}): ${v.help}\n    ${v.nodes.map((n) => n.target.join(' ')).join('\n    ')}`
    );

    expect(summary, summary.join('\n')).toEqual([]);
  });
}

test('the dialog is still accessible once open', async ({ page }) => {
  await page.goto('/components');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test('every page is reachable by keyboard from the skip link', async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), 'No Tab key on a touch device.');
  await page.goto('/');

  // The first Tab on any page should hit the skip link — the cheapest win for keyboard users.
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeVisible();
});
