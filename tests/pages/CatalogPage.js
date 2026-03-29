class CatalogPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.search = page.getByTestId('catalog-search');
    this.grid = page.getByTestId('catalog-grid');
  }

  async goto() {
    await this.page.goto('/catalog');
  }

  async searchFor(text) {
    await this.search.fill(text);
  }

  productCard(productId) {
    return this.page.getByTestId(`product-card-${productId}`);
  }

  addToCartButton(productId) {
    return this.page.getByTestId(`add-to-cart-${productId}`);
  }
}

module.exports = { CatalogPage };

