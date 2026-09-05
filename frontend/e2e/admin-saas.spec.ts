import { test, expect } from '@playwright/test';

test.describe('Platform Admin Flow', () => {
  test('should allow Super Admin to view platform tenants and access tenant details', async ({ page }) => {
    await page.goto('/');

    // Proceed through auth simulation
    await expect(page.getByRole('heading', { name: 'GymOS' })).toBeVisible();
    await page.getByRole('button', { name: 'Login as Super Admin' }).click();

    // Verify redirected to dashboard (usually falls back to global settings or tenants)
    // Wait for sidebar to appear
    await expect(page.getByRole('navigation').first()).toBeVisible();

    // Use navigation to go to Analytics (Reports) just to ensure standard navigation
    // Note: Super admins lack standard dashboards right now unless configured. We want to click 'Tenants'
    await page.getByRole('link', { name: /Tenants/i, exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/tenants/);

    // Verify Tenants List loads
    await expect(page.getByRole('heading', { name: 'Platform Tenants' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Iron Temple Gym' })).toBeVisible({ timeout: 10000 });

    // Navigate to tenant details
    await page.getByRole('cell', { name: 'Iron Temple Gym' }).click();
    await expect(page).toHaveURL(/\/admin\/tenants\/tnt-gym-001/);

    // Verify tenant details load
    await expect(page.getByRole('heading', { name: 'Iron Temple Gym' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Plan Entitlements')).toBeVisible();
    await expect(page.getByText('Limit: 3')).toBeVisible();
  });

  test('should block Owner from accessing Super Admin tenants route', async ({ page }) => {
    await page.goto('/');

    // Login as Gym Owner instead
    await page.getByRole('button', { name: 'Login as Gym Owner' }).click();
    await expect(page.getByRole('navigation').first()).toBeVisible();

    // Directly navigate to admin route
    await page.goto('/admin/tenants');
    
    // Expect unauthorized redirection
    await expect(page).toHaveURL(/\/403|\/404/);
  });
});
