const { test, expect } = require('@playwright/test');
const { CatalogPage } = require('../pages/CatalogPage');
const { CartPage } = require('../pages/CartPage');

test.describe('catalog', () => {
  test('search filters visible products', async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.goto();

    await catalog.searchFor('Keyboard');

    await expect(page.getByTestId('product-card-p-101')).toBeVisible();
    await expect(page.getByTestId('product-card-p-100')).toBeHidden();
  });

  test('add to cart from catalog and update cart qty', async ({ page }) => {
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
});

