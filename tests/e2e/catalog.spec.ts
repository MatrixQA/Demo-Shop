import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { CatalogPage } from '../pages/CatalogPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/** Product ids in default name (A→Z) order — matches `localeCompare` in CatalogPage.jsx. */
const NAME_ASC_IDS = ['p-101', 'p-102', 'p-104', 'p-105', 'p-103', 'p-100'];

async function visibleCatalogProductIds(page: Page): Promise<string[]> {
  return page
    .getByTestId('catalog-grid')
    .locator('[data-testid^="product-card-"]')
    .evaluateAll((els) =>
      els.map((el) => (el as HTMLElement).getAttribute('data-testid')!.replace('product-card-', ''))
    );
}

test.describe('catalog', () => {
  test.describe('core functionality', () => {
    test.describe('search', () => {
      test('filters visible products', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();

        await catalog.searchFor('Keyboard');

        await expect(page.getByTestId('product-card-p-101')).toBeVisible();
        await expect(page.getByTestId('product-card-p-100')).toBeHidden();
      });

      test('shows empty state when no products match the search', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();

        await catalog.searchFor('zzz-no-such-product');

        await expect(catalog.emptyState).toBeVisible();
        await expect(catalog.emptyState).toContainText('No products match your filters.');
        await expect(page.getByTestId('product-card-p-100')).toBeHidden();
      });
    });

    test.describe('sort', () => {
      test('default name A→Z orders products on first load', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();

        await expect.poll(() => visibleCatalogProductIds(page)).toEqual(NAME_ASC_IDS);
      });

      test('name A→Z orders products when selected after another sort', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();
        await catalog.sort.selectOption('price-asc');
        await catalog.sort.selectOption('name-asc');

        await expect.poll(() => visibleCatalogProductIds(page)).toEqual(NAME_ASC_IDS);
      });

      test('price low to high orders products by ascending price', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();
        await catalog.sort.selectOption('price-asc');

        await expect.poll(() => visibleCatalogProductIds(page)).toEqual([
          'p-104',
          'p-103',
          'p-100',
          'p-102',
          'p-101',
          'p-105',
        ]);
      });

      test('price high to low orders products by descending price', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();
        await catalog.sort.selectOption('price-desc');

        await expect.poll(() => visibleCatalogProductIds(page)).toEqual([
          'p-105',
          'p-101',
          'p-102',
          'p-100',
          'p-103',
          'p-104',
        ]);
      });
    });

    test.describe('category', () => {
      test('shows only products in the selected category', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();

        await catalog.category.selectOption('Books');
        await expect(page.getByTestId('product-card-p-100')).toBeVisible();
        await expect(page.getByTestId('product-card-p-104')).toBeVisible();
        await expect(page.getByTestId('product-card-p-101')).toBeHidden();

        await catalog.category.selectOption('Electronics');
        await expect(page.getByTestId('product-card-p-101')).toBeVisible();
        await expect(page.getByTestId('product-card-p-105')).toBeVisible();
        await expect(page.getByTestId('product-card-p-100')).toBeHidden();
      });

      test('combined category and search can yield no results', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();

        await catalog.category.selectOption('Books');
        await catalog.searchFor('Keyboard');

        await expect(catalog.emptyState).toBeVisible();
        await expect(page.getByTestId('product-card-p-100')).toBeHidden();
      });
    });

    test.describe('product cards', () => {
      test('shows formatted price on each visible card', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();

        await expect(catalog.productPrice('p-100')).toHaveText('$19.99');
        await expect(catalog.productPrice('p-101')).toHaveText('$49.00');
      });
    });
  });

  test.describe('catalog cart insertion', () => {
    test.describe('search', () => {
      test('adds a product that matches the search to the cart', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();
        await catalog.searchFor('Keyboard');

        await catalog.addToCartButton('p-101').click();
        await expect(page.getByTestId('toast-ok')).toBeVisible();
        await expect(page.getByTestId('nav-cart')).toContainText('(1)');

        const cart = new CartPage(page);
        await cart.goto();
        await expect(page.getByTestId('cart-row-p-101')).toBeVisible();
      });
    });

    test.describe('sort', () => {
      test('adds a product while the grid is sorted by price', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();
        await catalog.sort.selectOption('price-asc');

        await expect.poll(() => visibleCatalogProductIds(page)).toEqual([
          'p-104',
          'p-103',
          'p-100',
          'p-102',
          'p-101',
          'p-105',
        ]);

        await catalog.addToCartButton('p-104').click();
        await expect(page.getByTestId('nav-cart')).toContainText('(1)');

        const cart = new CartPage(page);
        await cart.goto();
        await expect(page.getByTestId('cart-row-p-104')).toBeVisible();
      });
    });

    test.describe('category', () => {
      test('adds a product while a category filter is applied', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();
        await catalog.category.selectOption('Electronics');

        await catalog.addToCartButton('p-105').click();
        await expect(page.getByTestId('nav-cart')).toContainText('(1)');

        const cart = new CartPage(page);
        await cart.goto();
        await expect(page.getByTestId('cart-row-p-105')).toBeVisible();
      });
    });

    test('updates line quantity from the cart after adding from the catalog', async ({ page }) => {
      const catalog = new CatalogPage(page);
      await catalog.goto();

      await catalog.addToCartButton('p-100').click();
      await expect(page.getByTestId('toast-ok')).toBeVisible();
      await expect(page.getByTestId('nav-cart')).toContainText('(1)');

      const cart = new CartPage(page);
      await cart.goto();
      await expect(cart.table).toBeVisible();
      await expect(page.getByTestId('cart-row-p-100')).toBeVisible();

      await cart.qtyInput('p-100').fill('2');
      await expect(page.getByTestId('nav-cart')).toContainText('(2)');
      await expect(page.getByTestId('cart-line-p-100')).toContainText('$39.98');
    });

    test('remove item from cart after adding from catalog', async ({ page }) => {
      const catalog = new CatalogPage(page);
      await catalog.goto();
      await catalog.addToCartButton('p-100').click();
      await expect(page.getByTestId('nav-cart')).toContainText('(1)');

      const cart = new CartPage(page);
      await cart.goto();
      await cart.removeButton('p-100').click();

      await expect(page.getByTestId('cart-empty')).toBeVisible();
      await expect(page.getByTestId('nav-cart')).toContainText('(0)');
    });
  });

  test.describe('navigation flows', () => {
    test('continue shopping returns to catalog', async ({ page }) => {
      const catalog = new CatalogPage(page);
      await catalog.goto();
      await catalog.addToCartButton('p-100').click();

      const cart = new CartPage(page);
      await cart.goto();
      await cart.continueShopping().click();

      await expect(page).toHaveURL(/\/catalog$/);
      await expect(catalog.grid).toBeVisible();
    });

    test('continue to checkout from cart after adding from catalog', async ({ page }) => {
      const catalog = new CatalogPage(page);
      await catalog.goto();
      await catalog.addToCartButton('p-100').click();
      await expect(page.getByTestId('nav-cart')).toContainText('(1)');

      const cart = new CartPage(page);
      await cart.goto();
      await cart.checkout.click();

      await expect(page).toHaveURL(/\/checkout$/);
      const checkout = new CheckoutPage(page);
      await expect(checkout.form).toBeVisible();
      await expect(page.getByTestId('checkout-total')).toContainText('$19.99');
    });

    test('product details: view, add to cart, go to cart, and back', async ({ page }) => {
      const catalog = new CatalogPage(page);
      await catalog.goto();

      await catalog.viewLink('p-100').click();
      await expect(page).toHaveURL(/\/product\/p-100$/);
      await expect(page.getByTestId('product-details')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'The Testing Handbook' })).toBeVisible();

      await page.getByTestId('product-add').click();
      await expect(page.getByTestId('toast-ok')).toBeVisible();
      await expect(page.getByTestId('nav-cart')).toContainText('(1)');

      await page.getByTestId('product-go-cart').click();
      await expect(page).toHaveURL(/\/cart$/);
      await expect(page.getByTestId('cart-row-p-100')).toBeVisible();

      await page.goto('/product/p-100');
      await page.getByTestId('product-back').click();
      await expect(page).toHaveURL(/\/catalog$/);
      await expect(catalog.grid).toBeVisible();
    });
  });
});
