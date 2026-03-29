const { test, expect } = require('@playwright/test');
const { CheckoutPage } = require('../pages/CheckoutPage');

test.describe('checkout', () => {
  test('checkout validation (missing required fields)', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.submit.click();

    await expect(checkout.error).toHaveText('Your cart is empty.');
  });

  test('place order happy path', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('add-to-cart-p-100').click();
    await expect(page.getByTestId('nav-cart')).toContainText('(1)');

    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.fullName.fill('Test User');
    await checkout.address.fill('1 Main St');
    await checkout.city.fill('Sofia');
    await checkout.postalCode.fill('1000');
    await checkout.cardNumber.fill('1111 2222 3333 4444');
    await checkout.submit.click();

    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('toast-ok')).toBeVisible();
    await expect(page.getByTestId('nav-cart')).toContainText('(0)');
  });
});

