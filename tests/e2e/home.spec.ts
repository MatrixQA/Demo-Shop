import { expect, test } from '@playwright/test';

test.describe('home', () => {
  test('shows intro content and seeded test account hints', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'UI automation practice site' })).toBeVisible();
    await expect(page.getByTestId('home-accounts')).toContainText('user / user123');
    await expect(page.getByTestId('home-accounts')).toContainText('admin / admin123');
  });

  test('"Go to Catalog" navigates to the catalog', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('home-cta').click();

    await expect(page).toHaveURL(/\/catalog$/);
    await expect(page.getByTestId('catalog-grid')).toBeVisible();
  });
});
