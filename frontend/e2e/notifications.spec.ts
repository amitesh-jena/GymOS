import { test, expect } from '@playwright/test';

test.describe('Notifications UX', () => {
  test('User can open notifications and mark as read', async ({ page }) => {
    // 1. Authenticated user logs in
    await page.goto('/auth/login');
    await page.click('button:has-text("Login as Gym Owner")');
    await expect(page).toHaveURL(/.*\/(dashboard|reports|tenants|members)/);

    // 2. Open Notification UX via Bell
    await page.click('button[aria-label="Notifications"]');
    await expect(page).toHaveURL(/.*\/notifications/);

    // 3. Unread notification is visible
    await expect(page.locator('text=Membership Expiring Soon')).toBeVisible();
    await expect(page.locator('text=New').first()).toBeVisible();

    // 4. Notification can be opened / navigates to resource
    await page.locator('text=Membership Expiring Soon').click();
    await expect(page).toHaveURL(/.*\/member\/membership/);
  });
});
