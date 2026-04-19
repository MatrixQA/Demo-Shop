import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../fixtures/users';

test.describe('admin products', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('guest is redirected to login when visiting admin', async ({ page }) => {
    await page.goto('/admin/products');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('standard user cannot access admin (redirects home)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.user.username, users.user.password);

    await page.goto('/admin/products');

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: 'UI automation practice site' })).toBeVisible();
  });

  test('admin sees products table and can add a product', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.admin.username, users.admin.password);

    await page.goto('/admin/products');

    await expect(page.getByRole('heading', { name: 'Admin: Products' })).toBeVisible();
    await expect(page.getByTestId('admin-products-table')).toBeVisible();

    await page.getByTestId('admin-add').click();
    await expect(page.getByTestId('admin-modal')).toBeVisible();

    const productName = `E2E product ${Date.now()}`;
    await page.getByTestId('admin-name').fill(productName);
    await page.getByTestId('admin-description').fill('Added by Playwright');
    await page.getByTestId('admin-save').click();

    await expect(page.getByTestId('admin-modal')).toBeHidden();
    await expect(page.getByTestId('toast-ok').first()).toBeVisible();
    await expect(page.getByRole('row', { name: new RegExp(productName) })).toBeVisible();
  });
});
