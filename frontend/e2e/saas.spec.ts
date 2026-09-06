import { test, expect } from '@playwright/test';

test.describe('SaaS Subscription E2E', () => {
  test.beforeEach(async ({ page }) => {
    // We navigate directly to the settings/subscription URL
    await page.goto('/auth/login');
    await page.waitForSelector('text=Authentication Simulator', { state: 'visible' });

    // Click to login as owner
    if (await page.isVisible('button:has-text("Login as Gym Owner")')) {
      await page.click('button:has-text("Login as Gym Owner")');
    }

    await page.waitForURL('**/dashboard');
  });

  test('owner can reach the subscription settings experience', async ({ page }) => {
    // Click Settings from Sidebar
    await page.click('nav a:has-text("Settings")');
    
    // There are multiple Settings routes in the nested list, but wait, the nav link might have the label "Settings".
    // Since we added Subscription in the config, let's just use the direct sidebar link if it exists.
    // The "Subscription" link has icon CreditCard.
    await page.click('nav a:has-text("Subscription")');

    await expect(page.locator('h2:has-text("SaaS Subscription")')).toBeVisible();

    // Verify current status block is loaded
    await expect(page.locator('h3:has-text("Current Status")')).toBeVisible();
    await expect(page.locator('text=Professional').first()).toBeVisible();

    // Check available plans
    await expect(page.locator('h3:has-text("Available Plans")')).toBeVisible();
    await expect(page.locator('text=Enterprise').first()).toBeVisible();

    // Test that cancellation opens a dialog
    if (await page.isVisible('button:has-text("Cancel Subscription")')) {
      await page.click('button:has-text("Cancel Subscription")');
      await expect(page.locator('text=Are you absolutely sure?')).toBeVisible();
      await page.click('button:has-text("Keep Subscription")'); // Dismis dialog
    }
  });

  test('unauthorized roles cannot access the owner SaaS experience', async ({ page }) => {
    // Clear the owner session from beforeEach
    await page.evaluate(() => localStorage.clear());
    
    // Relogin as a Trainer
    await page.goto('/auth/login');
    await page.click('button:has-text("Login as Trainer")');
    await page.waitForURL('**/trainer/dashboard');

    // Attempt to navigate to the SaaS configuration route directly
    await page.goto('/settings/subscription');
    
    // The RequireRole auth guard should block and render the 403 screen or layout mock
    await expect(page.locator('h3:has-text("Access Denied")')).toBeVisible();
  });
});
