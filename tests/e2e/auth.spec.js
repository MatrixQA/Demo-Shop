const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const users = require('../fixtures/users');

test.describe('auth', () => {
  test('login success', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login(users.user.username, users.user.password);

    await expect(page.getByTestId('auth-user')).toContainText('user');
    await expect(page.getByTestId('toast-ok')).toBeVisible();
  });

  test('login validation (empty fields)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.submit.click();

    await expect(login.error).toHaveText('Username and password are required.');
  });

  test('login fails (wrong password)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login(users.user.username, 'wrong-password');

    await expect(login.error).toHaveText('Invalid credentials');
    await expect(page.getByTestId('toast-err')).toBeVisible();
    await expect(page.getByTestId('auth-user')).toBeHidden();
  });

  test('login fails (wrong username)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login('wrong-user', users.user.password);

    await expect(login.error).toHaveText('Invalid credentials');
    await expect(page.getByTestId('toast-err')).toBeVisible();
    await expect(page.getByTestId('auth-user')).toBeHidden();
  });

  test('login fails (wrong username and password)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login('wrong-user', 'wrong-password');

    await expect(login.error).toHaveText('Invalid credentials');
    await expect(page.getByTestId('toast-err')).toBeVisible();
    await expect(page.getByTestId('auth-user')).toBeHidden();
  });
});

