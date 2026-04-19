import { expect, test } from '@playwright/test';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';

test.describe('reset password', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('missing token shows error on submit', async ({ page }) => {
    const reset = new ResetPasswordPage(page);
    await reset.goto();

    await reset.password.fill('abcdef');
    await reset.submit.click();

    await expect(page.getByRole('alert')).toHaveText('Missing token.');
    await expect(page.getByTestId('toast-err').first()).toBeVisible();
  });

  test('invalid token shows error', async ({ page }) => {
    const reset = new ResetPasswordPage(page);
    await reset.goto('00000000-0000-0000-0000-000000000000');

    await reset.password.fill('newpass123');
    await reset.submit.click();

    await expect(page.getByRole('alert')).toHaveText('Invalid or expired reset link.');
    await expect(page.getByTestId('toast-err').first()).toBeVisible();
  });

  test('password must be at least 6 characters when token is valid', async ({ page }) => {
    const username = `rpShort${Date.now()}`;
    const email = `${username}@example.com`;

    const register = new RegisterPage(page);
    await register.goto();
    await register.register(username, email, 'initial1');

    const forgot = new ForgotPasswordPage(page);
    await forgot.goto();
    await forgot.requestReset(email);
    await expect(forgot.demoCard).toBeVisible();

    await forgot.resetLink.click();
    await expect(page).toHaveURL(/\/reset-password\?token=/);

    const reset = new ResetPasswordPage(page);
    await reset.password.fill('12345');
    await reset.submit.click();

    await expect(page.getByRole('alert')).toHaveText('Password must be at least 6 characters.');
    await expect(page.getByTestId('toast-err').first()).toBeVisible();
  });

  test('happy path: forgot link → reset password → login with new password', async ({ page }) => {
    const username = `rpHappy${Date.now()}`;
    const email = `${username}@example.com`;
    const newPassword = 'rotated9';

    const register = new RegisterPage(page);
    await register.goto();
    await register.register(username, email, 'initial1');
    await register.verifyEmail.click();
    await expect(page.getByText('You can now log in.')).toBeVisible();

    const forgot = new ForgotPasswordPage(page);
    await forgot.goto();
    await forgot.requestReset(email);
    await forgot.resetLink.click();

    const reset = new ResetPasswordPage(page);
    await reset.password.fill(newPassword);
    await reset.submit.click();

    await expect(page.getByText('Password updated. Redirecting to login…')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/, { timeout: 10_000 });

    const login = new LoginPage(page);
    await expect(login.form).toBeVisible();
    await login.login(username, newPassword);

    await expect(page.getByTestId('auth-user')).toContainText(username);
    await expect(page.getByTestId('toast-ok').first()).toBeVisible();
  });
});
