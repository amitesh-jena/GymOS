import { test, expect } from '@playwright/test';

test('App routing and responsive navigation flow', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  
  // 1. Visit root, should redirect to login because we are unauthenticated.
  await page.goto('/');
  await expect(page).toHaveURL(/.*\/auth\/login/);
  await expect(page.locator('text=Authentication Simulator')).toBeVisible();

  // 2. Login as Member
  await page.click('button:has-text("Login as Member")');

  // Should redirect to role dashboard (Member -> /member/dashboard)
  await expect(page).toHaveURL(/.*\/member\/dashboard/);
  await expect(page.locator('h2', { hasText: 'Member Dashboard' })).toBeVisible();

  // 3. Test Breadcrumbs
  // Breadcrumb should show Home > Member > Dashboard. Let's just check Home and Member Dashboard are in DOM
  await expect(page.locator('nav').locator('text=My Dashboard').first()).toBeAttached();

  // 4. Navigate using Sidebar
  // Sidebar should have "My Workouts" for Member
  await page.click('text=My Workouts');
  await expect(page).toHaveURL(/.*\/member\/workouts/);
  await expect(page.locator('h2', { hasText: 'My Workouts' })).toBeVisible();

  // 5. Test 404
  await page.goto('/some-fake-route-404-test');
  await expect(page.locator('h3', { hasText: '404 - Page Not Found' })).toBeVisible();
  await page.click('button:has-text("Go Back")');

  // 6. Test 403 (Unauthorized Route)
  // Member trying to hit /dashboard (Owner route)
  await page.goto('/dashboard');
  await expect(page.locator('h3', { hasText: 'Not Authorized' })).toBeVisible();
});
