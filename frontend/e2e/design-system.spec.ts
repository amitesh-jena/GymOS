import { test, expect } from '@playwright/test';

test('design system showcase loads successfully with themes', async ({ page }) => {
  await page.goto('/_design');

  // Verify showcase title exists
  await expect(page.locator('h1', { hasText: 'GymOS Design System' })).toBeVisible();

  // Verify theme toggle button exists
  const toggleBtn = page.locator('button', { hasText: 'Toggle Theme' });
  await expect(toggleBtn).toBeVisible();

  // Switch from 'light' to 'dark'
  await toggleBtn.click();
  
  // Checking that HTML gets the 'dark' class
  await expect(page.locator('html')).toHaveClass(/dark/);
  
  // Switch to 'tinted'
  await toggleBtn.click();
  await expect(page.locator('html')).toHaveClass(/tinted/);

  // Verify generic component rendered safely (e.g. Card)
  await expect(page.locator('h3', { hasText: 'Buttons & Tags' })).toBeVisible();
});
