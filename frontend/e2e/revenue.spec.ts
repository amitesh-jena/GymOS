import { test, expect } from '@playwright/test';

test.describe('Revenue E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    // Ensure mock renders firmly
    await page.waitForSelector('text=Authentication Simulator', { state: 'visible' });
    if (await page.isVisible('button:has-text("Login as")')) {
        await page.click('button:has-text("Login as Gym Owner")');
    }
    await page.waitForURL('**/dashboard');
  });

  test('navigates through revenue screens', async ({ page }) => {
    // Payments
    await page.click('a:has-text("Payments")');
    await expect(page.locator('h2:has-text("Payments")')).toBeVisible();
    
    // Check Add Payment dialog
    await page.click('button:has-text("Record Payment")');
    await expect(page.locator('h2:has-text("Record New Payment")').first()).toBeVisible();
    await page.keyboard.press('Escape');

    // Invoices
    await page.click('a:has-text("Invoices")');
    await expect(page.locator('h2:has-text("Invoices")')).toBeVisible();

    // Receipts
    await page.click('a:has-text("Receipts")');
    await expect(page.locator('h2:has-text("Receipts")')).toBeVisible();
  });
});
