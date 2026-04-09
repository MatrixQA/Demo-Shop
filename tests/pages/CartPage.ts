import type { Locator, Page } from '@playwright/test';

/** Cart route page object (see tests/e2e/cart.spec.ts). */
export class CartPage {
  readonly table: Locator;
  readonly total: Locator;
  readonly checkout: Locator;

  constructor(readonly page: Page) {
    this.table = page.getByTestId('cart-table');
    this.total = page.getByTestId('cart-total');
    this.checkout = page.getByTestId('cart-checkout');
  }

  /** Open the cart page. */
  async goto(): Promise<void> {
    await this.page.goto('/cart');
  }

  /** Quantity input for a cart row by product id. */
  qtyInput(productId: string): Locator {
    return this.page.getByTestId(`cart-qty-${productId}`);
  }

  /** Remove button for a cart row by product id. */
  removeButton(productId: string): Locator {
    return this.page.getByTestId(`cart-remove-${productId}`);
  }

  /** "Continue shopping" link (typically navigates back to catalog). */
  continueShopping(): Locator {
    return this.page.getByRole('link', { name: 'Continue shopping' });
  }
}
