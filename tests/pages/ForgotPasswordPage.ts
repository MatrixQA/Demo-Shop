import type { Locator, Page } from '@playwright/test';

/** Forgot password route page object. */
export class ForgotPasswordPage {
  readonly form: Locator;
  readonly email: Locator;
  readonly submit: Locator;
  readonly error: Locator;
  readonly backToLogin: Locator;
  readonly demoCard: Locator;
  readonly resetLink: Locator;

  constructor(readonly page: Page) {
    this.form = page.getByTestId('forgot-password-form');
    this.email = page.getByTestId('forgot-password-email');
    this.submit = page.getByTestId('forgot-password-submit');
    this.error = page.getByTestId('forgot-password-error');
    this.backToLogin = page.getByTestId('forgot-password-back-login');
    this.demoCard = page.getByTestId('forgot-password-demo-card');
    this.resetLink = page.getByTestId('forgot-password-reset-link');
  }

  async goto(): Promise<void> {
    await this.page.goto('/forgot-password');
  }

  async requestReset(email: string): Promise<void> {
    await this.email.fill(email);
    await this.submit.click();
  }
}

