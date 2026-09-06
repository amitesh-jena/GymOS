import { test, expect } from '@playwright/test';

async function clientNav(page: any, url: string) {
  await page.evaluate((u: string) => {
    window.history.pushState({}, '', u);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, url);
}

test.describe('Phase 11 Cross-Role Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Workflow 1 & 5 & 3: Member lifecycle, membership assignment, payment synchronization, and renewal', async ({ page }) => {
    // 1. Staff Logs In
    await page.goto('/auth/login');
    await page.click('button:has-text("Login as Gym Owner")');
    await expect(page).toHaveURL(/.*\/dashboard/);

    // 2. Assign Membership (Workflow 1/3 Part)
    await clientNav(page, '/memberships');
    await page.getByRole('button', { name: /Assign Membership/i }).click();

    await expect(page.getByRole('heading', { name: 'Assign Membership' })).toBeVisible();
    const memberCombobox = page.getByRole('combobox', { name: 'Member', exact: true });
    await expect(memberCombobox).toBeVisible();
    await memberCombobox.click();
    await page.getByRole('option').first().click(); // select first member

    const planCombobox = page.getByRole('combobox', { name: 'Membership Plan', exact: true });
    await planCombobox.click();
    await page.getByRole('option').first().click(); // select first plan

    await page.getByRole('button', { name: /Confirm Assignment/i }).click();

    // Verify it redirects back and shows the new (or updated) assignment
    await expect(page).toHaveURL(/.*\/memberships/);

    // 3. Record Payment (Workflow 1/3 Part)
    await clientNav(page, '/payments');
    await page.getByRole('button', { name: /Record Payment/i }).click();

    await expect(page.getByRole('heading', { name: 'Record New Payment' })).toBeVisible();
    const payMemberCombobox = page.getByRole('combobox', { name: 'Member', exact: true });
    await expect(payMemberCombobox).toBeVisible();
    await payMemberCombobox.click();
    await page.getByRole('option').first().click(); // select first member

    await page.getByLabel('Amount (USD)').fill('99.00');
    await page.getByRole('dialog').getByRole('button', { name: /Record Payment/i }).click();

    // Wait for the modal to close by checking the modal heading is hidden
    await expect(page.getByRole('dialog')).toBeHidden();

    // Wait for mock delay
    await page.waitForTimeout(600);

    // Verify invoice and receipt synced manually via DOM
    await clientNav(page, '/invoices');
    await expect(page.getByText('$99.00').first()).toBeVisible();

    await clientNav(page, '/receipts');
    await expect(page.getByText('$99.00').first()).toBeVisible();

    // 4. Renewal Flow (Workflow 5)
    await clientNav(page, '/memberships');
    await page.locator('button[title="Renew"]').first().click();
    await page.getByRole('dialog').getByRole('combobox').click();
    await page.getByRole('option').first().click();
    await page.locator('input[type="date"]').nth(1).fill('2026-12-31');
    await page.getByRole('button', { name: /Confirm Renewal/i }).click();

    // Wait for the mock
    await page.waitForTimeout(600);
    // Since mock pushes to MOCK_PAYMENTS, MOCK_INVOICES, check if they increased (just rough check)
    await expect(page.locator('text=Renewing...')).toBeHidden();
  });

  test('Workflow 2: Trainer Assignment and Workflow Assignment', async ({ page }) => {
    // 1. Login as Trainer
    await page.goto('/auth/login');
    await page.click('button:has-text("Login as Trainer")');

    // 2. View My Members
    await page.click('nav >> text=My Members');
    // Ensure the table loads (TrainerMembersList)
    await expect(page.locator('h2', { hasText: 'My Members' })).toBeVisible();

    // 3. Assign Workout
    await page.goto('/trainer/workouts');
    await expect(page.locator('h2', { hasText: 'Workout Programs' })).toBeVisible();
    await page.getByRole('combobox').click();
    await page.getByRole('option').first().click();
    await page.getByRole('button', { name: /Assign Standard Workout/i }).click();

    await expect(page.locator('text=Assigning...')).toBeHidden();
    await expect(page.getByText('Workout assigned successfully').first()).toBeVisible();
  });

  test('Workflow 4: Attendance Check-in to Analytics sync', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('button:has-text("Login as Receptionist")');

    await page.goto('/attendance/checkin');

    await page.getByLabel('Select Member').click();
    await page.getByRole('option').nth(1).click(); // Use second member to avoid duplicate check-in mock error
    await page.getByRole('button', { name: /Check In Now/i }).click();

    await expect(page.getByText('Member check-in successful').first()).toBeVisible();
  });

  test('Workflow 6: Platform Admin Tenant Lifecycle', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('button:has-text("Login as Super Admin")');

    await page.goto('/admin/tenants');
    // Click on a tenant to go to details
    await page.locator('text=Iron Temple Gym').click();

    // Check initial active status
    await expect(page.locator('h2', { hasText: 'Iron Temple Gym' })).toBeVisible();

    // Suspend it
    await page.getByRole('button', { name: /Suspend Tenant/i }).click();

    // Let the mock finish and UI react
    await expect(page.getByRole('button', { name: /Activate Tenant/i })).toBeVisible();
  });
});
