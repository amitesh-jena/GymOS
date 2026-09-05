import { test, expect } from '@playwright/test';

test.describe('Core Operations Mocks (Phase 4)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    // Go to Auth simulator and login
    await page.goto('/auth/login');
    await page.click('button:has-text("Login as Gym Owner")');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('navigate through core business modules', async ({ page }) => {
    // Navigate to Members
    await page.click('nav >> text=Members');
    await expect(page).toHaveURL(/.*\/members/);
    await expect(page.locator('h2', { hasText: 'Members' })).toBeVisible();
    await expect(page.locator('tr:has-text("Alex Chen")')).toBeVisible();

    // Open member detail
    await page.locator('tr:has-text("Alex Chen")').click();
    await expect(page).toHaveURL(/.*\/members\/mem-101/);
    await expect(page.locator('h2', { hasText: 'Alex Chen' })).toBeVisible();

    // Navigate to Trainers
    await page.click('nav >> text=Trainers');
    await expect(page).toHaveURL(/.*\/trainers/);
    await expect(page.locator('h2', { hasText: 'Trainers' })).toBeVisible();

    // Navigate to Membership Plans
    await page.click('nav >> text=Settings'); // assuming Plans are somewhere, maybe reachable directly
    await page.goto('/plans');
    await expect(page).toHaveURL(/.*\/plans/);
    await expect(page.locator('h2', { hasText: 'Membership Plans' })).toBeVisible();

    // Navigate to Memberships
    await page.goto('/memberships');
    await expect(page.locator('h2', { hasText: 'Memberships' })).toBeVisible();

    // Navigate to Attendance
    await page.click('nav >> text=Attendance');
    await expect(page).toHaveURL(/.*\/attendance/);
    await expect(page.locator('h2', { hasText: 'Attendance' })).toBeVisible();

    // Interact with form Check In
    await page.getByRole('button', { name: /Manual Check-in/i }).click();
    await expect(page).toHaveURL(/.*\/attendance\/checkin/);
  });
});
