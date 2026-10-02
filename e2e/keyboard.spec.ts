import { expect, test } from '@playwright/test';

/**
 * The behaviour axe cannot see.
 *
 * Automated scanners check that ARIA attributes are present and coherent. They cannot check that
 * Tab goes somewhere sensible, that focus comes back where it should, or that a trap actually
 * traps. These tests drive the keyboard the way a user without a mouse would.
 */

// Keyboard traversal is a desktop concern: the mobile project emulates a touch device with no
// physical keyboard, where Tab focus movement does not apply. The axe scans still run there,
// because contrast and structure very much do.
test.skip(({ isMobile }) => Boolean(isMobile), 'Keyboard traversal does not apply to a touch device.');

test.describe('Tabs', () => {
  test('the whole tab list is one stop in the tab order', async ({ page }) => {
    await page.goto('/components');

    const tablist = page.getByRole('tablist', { name: 'Implementation details' });
    await tablist.getByRole('tab', { name: 'Tokens' }).focus();

    // Arrow keys move between tabs...
    await page.keyboard.press('ArrowRight');
    await expect(tablist.getByRole('tab', { name: 'Content' })).toBeFocused();

    // ...and a single Tab leaves the list entirely rather than stepping to the next tab.
    await page.keyboard.press('Tab');
    await expect(tablist.getByRole('tab', { name: 'Testing' })).not.toBeFocused();
  });

  test('selection wraps at both ends', async ({ page }) => {
    await page.goto('/components');

    const tablist = page.getByRole('tablist', { name: 'Implementation details' });
    await tablist.getByRole('tab', { name: 'Tokens' }).focus();

    await page.keyboard.press('ArrowLeft');
    await expect(tablist.getByRole('tab', { name: 'Testing' })).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowRight');
    await expect(tablist.getByRole('tab', { name: 'Tokens' })).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('Dialog', () => {
  test('traps focus, closes on Escape, and restores focus to the trigger', async ({ page }) => {
    await page.goto('/components');

    const trigger = page.getByRole('button', { name: 'Open dialog' });
    await trigger.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Tab repeatedly; focus must stay inside the dialog every time.
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      const insideDialog = await dialog.evaluate((node) => node.contains(document.activeElement));
      expect(insideDialog, `focus escaped the dialog after ${i + 1} tabs`).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('does not scroll the page behind it', async ({ page }) => {
    await page.goto('/components');
    await page.getByRole('button', { name: 'Open dialog' }).click();

    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

    await page.keyboard.press('Escape');
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  });
});

test.describe('Accordion', () => {
  test('toggles with the keyboard and keeps collapsed content untabbable', async ({ page }) => {
    await page.goto('/components');

    const trigger = page.getByRole('button', { name: 'Does it support multiple open panels?' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
