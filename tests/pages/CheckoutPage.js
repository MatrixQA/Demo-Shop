class CheckoutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.form = page.getByTestId('checkout-form');
    this.fullName = page.getByTestId('checkout-fullName');
    this.address = page.getByTestId('checkout-address');
    this.city = page.getByTestId('checkout-city');
    this.postalCode = page.getByTestId('checkout-postalCode');
    this.cardNumber = page.getByTestId('checkout-cardNumber');
    this.submit = page.getByTestId('checkout-submit');
    this.error = page.getByTestId('checkout-error');
  }

  async goto() {
    await this.page.goto('/checkout');
  }
}

module.exports = { CheckoutPage };

