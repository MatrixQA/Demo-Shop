/** Catalog route page object (see tests/e2e/catalog.spec.js). */
class CatalogPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    /** Search input locator. */
    this.search = page.getByTestId('catalog-search');
    /** Product grid container. */
    this.grid = page.getByTestId('catalog-grid');
    /** Category filter `<select>`. */
    this.category = page.getByTestId('catalog-category');
    /** Sort `<select>`. */
    this.sort = page.getByTestId('catalog-sort');
  }

  /** Opens `/catalog` (resolved with Playwright `baseURL`). */
  async goto() {
    await this.page.goto('/catalog');
  }

  /** Fills the search field (filters the grid). */
  async searchFor(text) {
    await this.search.fill(text);
  }

  /** `product-card-{productId}` */
  productCard(productId) {
    return this.page.getByTestId(`product-card-${productId}`);
  }

  /** `add-to-cart-{productId}` */
  addToCartButton(productId) {
    return this.page.getByTestId(`add-to-cart-${productId}`);
  }

  /** `view-{productId}` (opens product details). */
  viewLink(productId) {
    return this.page.getByTestId(`view-${productId}`);
  }
}

module.exports = { CatalogPage };

