import { test, expect } from '@playwright/test';

test.describe('Revenue E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Login if needed (Mock sets session automatically based on previous tests, or we just type)
    if (await page.isVisible('button:has-text("Sign in as")')) {
        await page.click('button:has-text("Sign in as Receptionist")');
    }
    await page.waitForURL('**/dashboard');
  });

  test('navigates through revenue screens', async ({ page }) => {
    // Payments
    await page.click('a:has-text("Payments")');
    await expect(page.locator('h2:has-text("Payments")')).toBeVisible();
    await expect(page.locator('text=John Doe')).toBeVisible();
    
    // Check Add Payment dialog
    await page.click('button:has-text("Record Payment")');
    await expect(page.locator('h2:has-text("Record New Payment")').first()).toBeVisible();
    await page.keyboard.press('Escape');

    // Invoices
    await page.click('a:has-text("Invoices")');
    await expect(page.locator('h2:has-text("Invoices")')).toBeVisible();
    await expect(page.locator('text=John Doe')).toBeVisible();

    // Receipts
    await page.click('a:has-text("Receipts")');
    await expect(page.locator('h2:has-text("Receipts")')).toBeVisible();
    await expect(page.locator('text=John Doe')).toBeVisible();
  });
});
