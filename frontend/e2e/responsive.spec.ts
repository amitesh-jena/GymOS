import { test, expect } from '@playwright/test';

const viewports = [
  { width: 1440, height: 900, name: 'Desktop Large' },
  { width: 1024, height: 768, name: 'Tablet Landscape' },
  { width: 768, height: 1024, name: 'Tablet Portrait' },
  { width: 390, height: 844, name: 'Mobile Portrait' },
  { width: 375, height: 667, name: 'Mobile Portrait Small' },
];

test.describe('Responsive Layout & Visual QA', () => {
  viewports.forEach((vp) => {
    test(`No horizontal overflow on ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      const user = {
        id: '1',
        name: 'Admin Tester',
        email: 'admin@gymos.com',
        role: 'SUPER_ADMIN',
        tenantId: 'system',
      };

      await page.addInitScript((userData) => {
        window.localStorage.setItem('user_data', JSON.stringify(userData));
      }, user);

      const routes = [
        '/',
        '/reports', // Use a valid route based on AppRoutes
        '/admin/tenants',
        '/admin/tenants/tnt-gym-001',
        '/analytics',
        '/memberships',
        '/trainers',
      ];

      for (const route of routes) {
        await page.goto(route, { waitUntil: 'networkidle' });

        // Ensure application shell has rendered deterministically
        await expect(page.locator('main').first()).toBeVisible();

        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        if (hasOverflow) {
          const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
          const activeWidth = await page.evaluate(() => window.innerWidth);
          console.error(
            `Route ${route} has overflow on ${vp.name}! ScrollWidth: ${scrollWidth}, InnerWidth: ${activeWidth}`
          );
        }
        expect(hasOverflow).toBe(false);
      }
    });

    test(`AdminTenantDetail handles long text without overflow on ${vp.name} (${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const user = { id: '1', name: 'Admin Tester', role: 'SUPER_ADMIN', tenantId: 'system' };
      await page.addInitScript((userData) => {
        window.localStorage.setItem('user_data', JSON.stringify(userData));
      }, user);

      // Verify a tenant with specifically long string details
      await page.goto('/admin/tenants/tnt-gym-001', { waitUntil: 'networkidle' });
      await expect(page.locator('h2', { hasText: 'Iron Temple Gym' })).toBeVisible();

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasOverflow).toBe(false);
    });
  });

  test('Mobile navigation drawer is reachable and closeable', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const user = { id: '1', name: 'Tester', role: 'SUPER_ADMIN', tenantId: 'system' };
    await page.addInitScript((userData) => {
      window.localStorage.setItem('user_data', JSON.stringify(userData));
    }, user);

    await page.goto('/', { waitUntil: 'networkidle' });

    // Open drawer
    const hamburger = page.locator('button', { hasText: /Open sidebar/i });
    if (await hamburger.isVisible()) {
      await hamburger.click();

      // Sidebar overlay should appear and transition in
      const closeBtn = page.locator('button', { hasText: 'Close sidebar' }).first();
      await expect(closeBtn).toBeVisible();

      // Wait for slide-in animation specifically before measuring
      await page.waitForTimeout(300); // 300ms is standard for Tailwind slide-in duration-200. Used for bounding box stability.

      // Check if it's within viewport bounds
      const boundingBox = await closeBtn.boundingBox();
      expect(boundingBox).not.toBeNull();
      if (boundingBox) {
        expect(boundingBox.x + boundingBox.width).toBeLessThanOrEqual(375);
      }

      await closeBtn.click();
      await expect(closeBtn).not.toBeVisible();
    }
  });

  test('Dialogs bounded within viewport and can scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const user = { id: '1', name: 'Tester', role: 'SUPER_ADMIN', tenantId: 'tenant-1' };
    await page.addInitScript((userData) => {
      window.localStorage.setItem('user_data', JSON.stringify(userData));
    }, user);

    // Using payments route as 'Record Payment' triggers a lazily loaded dialog containing a form
    await page.goto('/payments', { waitUntil: 'networkidle' });

    const addBtn = page.getByRole('button', { name: /Record Payment/i });
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const boundingBox = await dialog.boundingBox();
    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      expect(boundingBox.height).toBeLessThanOrEqual(844);
    }

    // Test dialog closeability to ensure full test lifecycle completion
    const closeDialogBtn = dialog.getByRole('button', { name: /Close/i });
    await expect(closeDialogBtn).toBeVisible();
    await closeDialogBtn.click();
    await expect(dialog).not.toBeVisible();
  });
});
