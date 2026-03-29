class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.table = page.getByTestId('cart-table');
    this.total = page.getByTestId('cart-total');
    this.checkout = page.getByTestId('cart-checkout');
  }

  async goto() {
    await this.page.goto('/cart');
  }

  qtyInput(productId) {
    return this.page.getByTestId(`cart-qty-${productId}`);
  }

  removeButton(productId) {
    return this.page.getByTestId(`cart-remove-${productId}`);
  }
}

module.exports = { CartPage };

