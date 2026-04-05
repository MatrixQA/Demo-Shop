import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly table: Locator;
  readonly total: Locator;
  readonly checkout: Locator;

  constructor(readonly page: Page) {
    this.table = page.getByTestId('cart-table');
    this.total = page.getByTestId('cart-total');
    this.checkout = page.getByTestId('cart-checkout');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart');
  }

  qtyInput(productId: string): Locator {
    return this.page.getByTestId(`cart-qty-${productId}`);
  }

  removeButton(productId: string): Locator {
    return this.page.getByTestId(`cart-remove-${productId}`);
  }

  continueShopping(): Locator {
    return this.page.getByRole('link', { name: 'Continue shopping' });
  }
}
