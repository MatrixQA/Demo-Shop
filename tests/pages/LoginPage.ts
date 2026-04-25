import type { Locator, Page } from '@playwright/test';

/** Login route page object (see tests/e2e/login.spec.ts). */
export class LoginPage {
  readonly form: Locator;
  readonly username: Locator;
  readonly password: Locator;
  /** "Remember me" checkbox controlling localStorage persistence. */
  readonly remember: Locator;
  readonly submit: Locator;
  readonly error: Locator;
  /** CTA shown when login is blocked by unverified email. */
  readonly verifyEmail: Locator;

  constructor(readonly page: Page) {
    this.form = page.getByTestId('login-form');
    this.username = page.getByTestId('login-username');
    this.password = page.getByTestId('login-password');
    this.remember = page.getByTestId('login-remember');
    this.submit = page.getByTestId('login-submit');
    this.error = page.getByTestId('login-error');
    this.verifyEmail = page.getByTestId('login-verify-cta');
  }

  /** Open the login page. */
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  /** Submit the login form with credentials. */
  async login(username: string, password: string, opts?: { remember?: boolean }): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    // Default app behavior is "remember = true", so only override when the test asks to.
    if (opts?.remember === true) await this.remember.check();
    if (opts?.remember === false) await this.remember.uncheck();
    await this.submit.click();
  }
}
