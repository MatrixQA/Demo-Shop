import type { Locator, Page } from '@playwright/test';

/** Checkout route page object (see tests/e2e/checkout.spec.ts). */
export class CheckoutPage {
  readonly form: Locator;
  readonly fullName: Locator;
  readonly address: Locator;
  readonly city: Locator;
  readonly postalCode: Locator;
  readonly cardNumber: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(readonly page: Page) {
    this.form = page.getByTestId('checkout-form');
    this.fullName = page.getByTestId('checkout-fullName');
    this.address = page.getByTestId('checkout-address');
    this.city = page.getByTestId('checkout-city');
    this.postalCode = page.getByTestId('checkout-postalCode');
    this.cardNumber = page.getByTestId('checkout-cardNumber');
    this.submit = page.getByTestId('checkout-submit');
    this.error = page.getByTestId('checkout-error');
  }

  /** Open the checkout page. */
  async goto(): Promise<void> {
    await this.page.goto('/checkout');
  }
}
