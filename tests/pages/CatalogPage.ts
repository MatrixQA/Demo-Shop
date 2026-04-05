import type { Locator, Page } from '@playwright/test';

/** Catalog route page object (see tests/e2e/catalog.spec.ts). */
export class CatalogPage {
  readonly search: Locator;
  readonly grid: Locator;
  readonly category: Locator;
  readonly sort: Locator;
  readonly emptyState: Locator;

  constructor(readonly page: Page) {
    this.search = page.getByTestId('catalog-search');
    this.grid = page.getByTestId('catalog-grid');
    this.category = page.getByTestId('catalog-category');
    this.sort = page.getByTestId('catalog-sort');
    this.emptyState = page.getByTestId('catalog-empty');
  }

  async goto(): Promise<void> {
    await this.page.goto('/catalog');
  }

  async searchFor(text: string): Promise<void> {
    await this.search.fill(text);
  }

  productCard(productId: string): Locator {
    return this.page.getByTestId(`product-card-${productId}`);
  }

  productPrice(productId: string): Locator {
    return this.page.getByTestId(`product-price-${productId}`);
  }

  addToCartButton(productId: string): Locator {
    return this.page.getByTestId(`add-to-cart-${productId}`);
  }

  viewLink(productId: string): Locator {
    return this.page.getByTestId(`view-${productId}`);
  }
}
