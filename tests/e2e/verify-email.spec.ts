import { expect, test } from '@playwright/test';

test.describe('verify email (direct URL)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('missing token shows validation error', async ({ page }) => {
    await page.goto('/verify-email');

    await expect(page.getByRole('alert')).toHaveText('Missing token.');
    await expect(page.getByTestId('toast-err').first()).toBeVisible();
  });

  test('invalid token shows error', async ({ page }) => {
    await page.goto('/verify-email?token=00000000-0000-0000-0000-000000000000');

    await expect(page.getByRole('alert')).toHaveText('Invalid or expired verification link.');
    await expect(page.getByTestId('toast-err').first()).toBeVisible();
  });
});
