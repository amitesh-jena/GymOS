import { test, expect } from '@playwright/test';

test.describe('Settings & App Configuration', () => {
  test('should allow Owner to view Profile and Appearance settings', async ({ page }) => {
    await page.goto('/');

    // Proceed through auth simulation
    await expect(page.getByRole('heading', { name: 'GymOS' })).toBeVisible();
    await page.getByRole('button', { name: 'Login as Gym Owner' }).click();

    // Verify redirected to dashboard, navigation appears
    await expect(page.getByRole('navigation').first()).toBeVisible();

    // The owner's settings navigation might be grouped under 'Admin' inside config.ts
    // We will navigate directly for robust E2E execution over IA changes
    await page.goto('/settings');
    await expect(page).toHaveURL(/\/settings\/profile/);

    // Verify Profile Loads
    await expect(page.getByRole('heading', { name: 'Profile Settings' })).toBeVisible();
    
    // Check navigation tab for Appearance
    await page.getByRole('link', { name: 'Appearance' }).click();
    await expect(page).toHaveURL(/\/settings\/appearance/);
    await expect(page.getByRole('heading', { name: 'Theme Selection' })).toBeVisible();
    
    // Pick Dark Theme
    const darkButton = page.getByRole('button', { name: /Dark/i });
    await expect(darkButton).toBeVisible();
    // Simulate toggling
    await darkButton.click();
    
    // Test that the class is applied (visual logic validation)
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should hide Organization settings from non-owners', async ({ page }) => {
    await page.goto('/');

    // Login as a normal member
    await page.getByRole('button', { name: 'Login as Member' }).click();
    await expect(page.getByRole('navigation').first()).toBeVisible();

    await page.goto('/settings');
    
    // Settings for member should still redirect to profile
    await expect(page).toHaveURL(/\/settings\/profile/);
    
    // Verify Profile Loads
    await expect(page.getByRole('heading', { name: 'Profile Settings' })).toBeVisible();
    
    // Organization tab should NOT exist for Members
    await expect(page.getByRole('link', { name: 'Organization' })).not.toBeVisible();
  });
});
