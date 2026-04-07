import type { Locator, Page } from '@playwright/test';

/** Login route page object (see tests/e2e/login.spec.ts). */
export class LoginPage {
  readonly form: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(readonly page: Page) {
    this.form = page.getByTestId('login-form');
    this.username = page.getByTestId('login-username');
    this.password = page.getByTestId('login-password');
    this.submit = page.getByTestId('login-submit');
    this.error = page.getByTestId('login-error');
  }

  /** Open the login page. */
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  /** Submit the login form with credentials. */
  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }
}
