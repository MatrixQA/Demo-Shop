import { expect, test } from '@playwright/test';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';

test.describe('forgot password', () => {
  test.beforeEach(async ({ page }) => {
    // Keep tests independent: start from an empty localStorage for this origin.
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  // Client-side guard: empty submit shows required email message.
  test('negative: validation (email is required)', async ({ page }) => {
    const fp = new ForgotPasswordPage(page);
    await fp.goto();
    await expect(fp.form).toBeVisible();

    await fp.submit.click();

    await expect(fp.error).toHaveText('Email is required.');
  });

  // Anti-enumeration: unknown email still returns a generic success UX.
  test('negative: unknown email still shows success (no enumeration)', async ({ page }) => {
    const fp = new ForgotPasswordPage(page);
    await fp.goto();

    await fp.requestReset('unknown@example.com');

    await expect(page.getByTestId('toast-ok').first()).toBeVisible();
    await expect(fp.demoCard).toBeHidden();
  });

  // Demo path: known email shows reset link and navigates to reset-password.
  test('positive: known email shows demo reset link', async ({ page }) => {
    const fp = new ForgotPasswordPage(page);
    await fp.goto();

    // Seeded user: user@example.com
    await fp.requestReset('user@example.com');

    await expect(page.getByTestId('toast-ok').first()).toBeVisible();
    await expect(fp.demoCard).toBeVisible();
    await expect(fp.resetLink).toBeVisible();

    await fp.resetLink.click();
    await expect(page).toHaveURL(/\/reset-password\?token=/);
  });
});

