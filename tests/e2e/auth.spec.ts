import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../fixtures/users';
import { RegisterPage } from '../pages/RegisterPage';

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

  // Persistence: when "Remember me" is enabled, the auth state is written to localStorage
  // and should survive a reload/navigation.
  test('remember me persists login across reload', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login(users.user.username, users.user.password, { remember: true });
    await expect(page.getByTestId('auth-user')).toContainText('user');

    await page.reload();
    await expect(page.getByTestId('auth-user')).toContainText('user');
    await expect(page.getByTestId('auth-login-link')).toBeHidden();
  });

  // Non-persistence: when "Remember me" is disabled, we keep the user logged in only in memory
  // for the current SPA session; a full reload should log the user out.
  test('without remember me, login does not persist across reload', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login(users.user.username, users.user.password, { remember: false });
    await expect(page.getByTestId('auth-user')).toContainText('user');

    await page.reload();
    await expect(page.getByTestId('auth-user')).toBeHidden();
    await expect(page.getByTestId('auth-login-link')).toBeVisible();
  });

  // Gate: newly registered users are unverified; login should fail with a dedicated message
  // and offer a demo "Verify email" CTA. Clicking it should verify and then allow login.
  test('login before verify shows CTA; verify then login succeeds', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();

    const register = new RegisterPage(page);
    await register.goto();

    const username = `uv${Date.now()}`;
    const email = `${username}@example.com`;
    const password = 'password123';
    await register.register(username, email, password);
    await expect(page.getByTestId('toast-ok').first()).toBeVisible();
    await expect(register.verifyEmail).toBeVisible();

    const login = new LoginPage(page);
    await login.goto();
    await login.login(username, password);

    await expect(login.error).toHaveText('Please verify your email first.');
    await expect(page.getByTestId('toast-err')).toBeVisible();
    await expect(login.verifyEmail).toBeVisible();

    await login.verifyEmail.click();
    await expect(page).toHaveURL(/\/verify-email\?token=/);
    await expect(page.getByTestId('toast-ok').first()).toBeVisible();
    await expect(page.getByText('You can now log in.')).toBeVisible();

    await page.getByTestId('verify-go-login').click();
    await expect(page).toHaveURL('/login');
    await login.login(username, password, { remember: true });
    await expect(page.getByTestId('auth-user')).toContainText(username);
  });
});
