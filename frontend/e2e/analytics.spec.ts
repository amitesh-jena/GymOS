import { test, expect } from '@playwright/test';

test.describe('Analytics & Reporting Phase 8', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    // Login as a role authorized to see reports (Owner)
    await page.click('button:has-text("Login as Gym Owner")');
    await page.waitForURL('**/dashboard');
  });

  test('owner can navigate to analytics dashboard and view metrics', async ({ page }) => {
    // Navigate via Sidebar or directly
    await page.goto('/reports');

    // Make sure title exists
    await expect(page.locator('h2:has-text("Analytics & Reporting")')).toBeVisible();

    // Check that KPIs are there (the mock populates Total Members, Active Memberships)
    await expect(page.locator('text=Total Members')).toBeVisible();
    await expect(page.locator('text=Period Revenue')).toBeVisible();

    // MSW should populate numbers
    await expect(page.locator('text=405')).toBeVisible();
    await expect(page.locator('text=$28,540.00')).toBeVisible();

    // Check that the revenue trend graph container exists (can check card title)
    await expect(page.locator('h3:has-text("Revenue Trend")')).toBeVisible();
    await expect(page.locator('h3:has-text("Plan Distribution")')).toBeVisible();
  });

  test('trainers are blocked from accessing reports', async ({ page }) => {
    // Clear the session out and login as Trainer
    await page.evaluate(() => localStorage.clear());
    await page.goto('/auth/login');
    await page.click('button:has-text("Login as Trainer")');
    await page.waitForURL('**/trainer/dashboard');

    await page.goto('/reports');
    
    // RequireRole must block it
    await expect(page.locator('h3:has-text("Access Denied")')).toBeVisible();
  });
});
