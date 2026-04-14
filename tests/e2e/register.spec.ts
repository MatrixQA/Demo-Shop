import { expect, test } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('register', () => {
  test.beforeEach(async ({ page }) => {
    // Keep tests independent: start from an empty localStorage for this origin.
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('happy path: register -> verify email -> login', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();
    await expect(register.form).toBeVisible();

    const username = 'newuser';
    const email = 'newuser@example.com';
    const password = 'password123';

    await register.register(username, email, password);

    await expect(page.getByTestId('toast-ok').first()).toBeVisible();
    await expect(register.verifyEmail).toBeVisible();

    await register.verifyEmail.click();
    await expect(page.getByTestId('toast-ok').first()).toBeVisible();
    await expect(page.getByText('You can now log in.')).toBeVisible();

    const login = new LoginPage(page);
    await login.goto();
    await login.login(username, password);

    await expect(page.getByTestId('auth-user')).toContainText(username);
    await expect(page.getByTestId('toast-ok').first()).toBeVisible();
  });

  test('validation: all fields required', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();
    await expect(register.form).toBeVisible();

    await register.submit.click();

    await expect(register.error).toHaveText('All fields are required.');
    await expect(page.getByTestId('toast-err')).toBeVisible();
  });

  test('negative: username must be at least 3 characters', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();
    await expect(register.form).toBeVisible();

    await register.register('ab', 'ab@example.com', 'abcdef');

    await expect(register.error).toHaveText('Username must be at least 3 characters.');
    await expect(page.getByTestId('toast-err')).toBeVisible();
  });

  test('negative: email must contain @', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();
    await expect(register.form).toBeVisible();

    await register.register('validuser', 'not-an-email', 'abcdef');

    await expect(register.error).toHaveText('Please enter a valid email address.');
    await expect(page.getByTestId('toast-err')).toBeVisible();
  });

  test('negative: password must be at least 6 characters', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();
    await expect(register.form).toBeVisible();

    await register.register('validuser', 'validuser@example.com', '12345');

    await expect(register.error).toHaveText('Password must be at least 6 characters.');
    await expect(page.getByTestId('toast-err')).toBeVisible();
  });

  test('negative: username already taken', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();
    await expect(register.form).toBeVisible();

    await register.register('user', 'another@example.com', 'abcdef');

    await expect(register.error).toHaveText('Username is already taken.');
    await expect(page.getByTestId('toast-err')).toBeVisible();
  });

  test('negative: email already in use (case-insensitive)', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();
    await expect(register.form).toBeVisible();

    // Seeded user: user@example.com
    await register.register('someuser', 'USER@EXAMPLE.COM', 'abcdef');

    await expect(register.error).toHaveText('Email is already in use.');
    await expect(page.getByTestId('toast-err')).toBeVisible();
  });

  test('edge: username is trimmed on create', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();
    await expect(register.form).toBeVisible();

    await register.register('  spacedUser  ', 'spaced@example.com', 'abcdef');
    await expect(register.verifyEmail).toBeVisible();
    await register.verifyEmail.click();

    const login = new LoginPage(page);
    await login.goto();
    await login.login('spacedUser', 'abcdef');

    await expect(page.getByTestId('auth-user')).toContainText('spacedUser');
  });

  test('edge: email normalization prevents duplicates', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();
    await expect(register.form).toBeVisible();

    await register.register('userA', 'Test@Example.com', 'abcdef');
    await expect(register.verifyEmail).toBeVisible();

    // Second attempt with the same email (different case) should be blocked.
    await register.goto();
    await expect(register.form).toBeVisible();
    await register.register('userB', 'test@example.com', 'abcdef');

    await expect(register.error).toHaveText('Email is already in use.');
    await expect(page.getByTestId('toast-err')).toBeVisible();
  });
});

