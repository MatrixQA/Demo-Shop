import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../fixtures/users';

test.describe('auth', () => {
  // Happy path: valid credentials show user in header and success toast.
  test('login success', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login(users.user.username, users.user.password);

    await expect(page.getByTestId('auth-user')).toContainText('user');
    await expect(page.getByTestId('toast-ok')).toBeVisible();
  });

  // Client-side guard: submit with empty fields shows inline validation (no server call).
  test('login validation (empty fields)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.submit.click();

    await expect(login.error).toHaveText('Username and password are required.');
  });

  // Known user + bad password: error message, error toast, still logged out in UI.
  test('login fails (wrong password)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login(users.user.username, 'wrong-password');

    await expect(login.error).toHaveText('Invalid credentials');
    await expect(page.getByTestId('toast-err')).toBeVisible();
    await expect(page.getByTestId('auth-user')).toBeHidden();
  });

  // Unknown username: same failure surface as wrong password (invalid credentials).
  test('login fails (wrong username)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login('wrong-user', users.user.password);

    await expect(login.error).toHaveText('Invalid credentials');
    await expect(page.getByTestId('toast-err')).toBeVisible();
    await expect(page.getByTestId('auth-user')).toBeHidden();
  });

  // Both fields invalid: same failure UX as the single-field invalid tests.
  test('login fails (wrong username and password)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login('wrong-user', 'wrong-password');

    await expect(login.error).toHaveText('Invalid credentials');
    await expect(page.getByTestId('toast-err')).toBeVisible();
    await expect(page.getByTestId('auth-user')).toBeHidden();
  });

  // Logout removes session: header shows Login again and hides user chip.
  test('user logout', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.user.username, users.user.password);

    await page.getByTestId('auth-logout').click();

    await expect(page.getByTestId('auth-user')).toBeHidden();
    await expect(page.getByTestId('auth-login-link')).toBeVisible();
  });

  // Admin credentials: role appears in header; success toast on redirect.
  test('admin login success', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login(users.admin.username, users.admin.password);

    await expect(page.getByTestId('auth-user')).toHaveText('admin (admin)');
    await expect(page.getByTestId('toast-ok')).toBeVisible();
  });

  // Wrong password for the admin account: same invalid-credentials path as regular user.
  test('admin login fails (wrong password)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login(users.admin.username, 'wrong-admin-password');

    await expect(login.error).toHaveText('Invalid credentials');
    await expect(page.getByTestId('toast-err')).toBeVisible();
    await expect(page.getByTestId('auth-user')).toBeHidden();
  });

  test('admin logout', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.admin.username, users.admin.password);

    await page.getByTestId('auth-logout').click();

    await expect(page.getByTestId('auth-user')).toBeHidden();
    await expect(page.getByTestId('auth-login-link')).toBeVisible();
  });
});
