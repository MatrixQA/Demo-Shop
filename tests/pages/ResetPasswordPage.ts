import type { Locator, Page } from '@playwright/test';

/** Reset password route (`/reset-password`). */
export class ResetPasswordPage {
  readonly password: Locator;
  readonly submit: Locator;

  constructor(readonly page: Page) {
    this.password = page.getByLabel('New password');
    this.submit = page.getByRole('button', { name: 'Update password' });
  }

  async goto(token?: string): Promise<void> {
    const qs = token ? `?token=${encodeURIComponent(token)}` : '';
    await this.page.goto(`/reset-password${qs}`);
  }
}
