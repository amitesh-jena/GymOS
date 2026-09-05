import { test, expect } from '@playwright/test';

test.describe('Member Experience E2E', () => {
  test('Member layout, routing, and interactions', async ({ page }) => {
    // 1. Authenticate as Member
    await page.goto('/auth/login');
    // Ensure mock renders
    await page.waitForSelector('text=Authentication Simulator', { state: 'visible' });
    await page.click('button:has-text("Login as Member")');

    // 2. Navigate to Dashboard
    await page.waitForURL('/member/dashboard');
    await expect(page.locator('h2')).toContainText('Welcome Back!');

    // 3. Navigate to Membership
    await page.click('a[href="/member/membership"]');
    await expect(page.locator('h2')).toContainText('My Subscription');

    // 4. Navigate to Payments
    await page.click('a[href="/member/payments"]');
    await expect(page.locator('h2')).toContainText('Billing History');

    // 5. Navigate to Attendance
    await page.click('a[href="/member/attendance"]');
    await expect(page.locator('h2')).toContainText('Check-in History');

    // 6. Navigate to Workouts
    await page.click('a[href="/member/workouts"]');
    await expect(page.locator('h2')).toContainText('My Workouts');

    // Wait for the workout to load
    await expect(page.locator('text=Upper Body Power')).toBeVisible();

    // 10. Exercise documented interaction (Complete Workout)
    const completeBtn = page.locator('button:has-text("Mark Workout Complete")');
    await completeBtn.click();
    await expect(completeBtn).toHaveCount(0);
    // Assuming toast appears or status changes; we'll look for success toast
    await expect(page.locator('text=Workout marked as complete').first()).toBeVisible();

    // 7. Navigate to Diet
    await page.click('a[href="/member/diet"]');
    await expect(page.locator('h2')).toContainText('My Diet Plan');
    await expect(page.locator('text=Cutting Phase')).toBeVisible();

    // 8. Navigate to Progress
    await page.click('a[href="/member/progress"]');
    await expect(page.locator('h2')).toContainText('My Progress');
    await expect(page.locator('text=Weight Trend')).toBeVisible();

    // Mobile layout test
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/member/dashboard');
    const toggleButton = page.locator('button[aria-label="Toggle navigation"]');
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await expect(page.locator('a[href="/member/workouts"]')).toBeVisible();
    }
  });
});
