import type { Locator, Page } from '@playwright/test';

/** Register route page object (see tests/e2e/register.spec.ts). */
export class RegisterPage {
  readonly form: Locator;
  readonly username: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;
  readonly verifyEmail: Locator;

  constructor(readonly page: Page) {
    this.form = page.getByTestId('register-form');
    this.username = page.getByTestId('register-username');
    this.email = page.getByTestId('register-email');
    this.password = page.getByTestId('register-password');
    this.submit = page.getByTestId('register-submit');
    this.error = page.getByTestId('register-error');
    this.verifyEmail = page.getByTestId('register-verify-email');
  }

  /** Open the register page. */
  async goto(): Promise<void> {
    await this.page.goto('/register');
  }

  async register(username: string, email: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}

