import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';

async function addOneItemToCart(page: Page): Promise<void> {
  await page.goto('/catalog');
  await page.getByTestId('add-to-cart-p-100').click();
  await expect(page.getByTestId('nav-cart')).toContainText('(1)');
}

test.describe('checkout', () => {
  // Empty cart: submit shows cart error before any field validation runs.
  test('checkout validation (missing required fields)', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.submit.click();

    await expect(checkout.error).toHaveText('Your cart is empty.');
  });

  // Partial form: multiple required fields left empty → one aggregate required message.
  test('validation: several empty fields shows a single required-fields message', async ({ page }) => {
    await addOneItemToCart(page);
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.fullName.fill('Test User');
    await checkout.address.fill('1 Main St');

    await checkout.submit.click();

    await expect(checkout.error).toHaveText('All fields are required.');
  });

  // Single omission: all fields filled except one → same required-fields message.
  test('validation: one missed field among otherwise filled inputs', async ({ page }) => {
    await addOneItemToCart(page);
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.fullName.fill('Test User');
    await checkout.address.fill('1 Main St');
    await checkout.city.fill('Sofia');
    await checkout.postalCode.fill('1000');

    await checkout.submit.click();

    await expect(checkout.error).toHaveText('All fields are required.');
  });

  // Card too short (<12 digits): text fields valid → dedicated card length error.
  test('validation: short card when name, address, city, and postal are valid', async ({ page }) => {
    await addOneItemToCart(page);
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.fullName.fill('Test User');
    await checkout.address.fill('1 Main St');
    await checkout.city.fill('Sofia');
    await checkout.postalCode.fill('1000');
    await checkout.cardNumber.fill('4242 4242');

    await checkout.submit.click();

    await expect(checkout.error).toHaveText('Card number looks too short.');
  });

  // Missing field + invalid card: required-fields check runs before card length.
  test('validation: missing fields take precedence over short card', async ({ page }) => {
    await addOneItemToCart(page);
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.fullName.fill('Test User');
    await checkout.address.fill('1 Main St');
    await checkout.city.fill('Sofia');
    await checkout.cardNumber.fill('123');

    await checkout.submit.click();

    await expect(checkout.error).toHaveText('All fields are required.');
  });

  // Full valid checkout: redirects home, success toast, cart cleared.
  test('place order happy path', async ({ page }) => {
    await addOneItemToCart(page);

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
