# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> App routing and responsive navigation flow
- Location: e2e\navigation.spec.ts:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('.hidden.sm\\:flex').locator('text=My Dashboard')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.hidden.sm\\:flex').locator('text=My Dashboard')
    14 × locator resolved to <span role="link" aria-current="page" aria-disabled="true" class="font-normal text-foreground">My Dashboard</span>
       - unexpected value "hidden"

```

```yaml
- banner:
  - button "Toggle Navigation"
  - button "MO"
- main:
  - heading "Member Dashboard" [level=2]
  - paragraph: Architecture Placeholder View
  - heading "Danger Zone" [level=3]
  - heading "Delete Workspace" [level=4]
  - paragraph: This action cannot be undone. All data will be lost.
  - button "Delete"
  - heading "Records" [level=2]
  - paragraph: Manage data using standard list architecture.
  - button "Create New"
  - searchbox "Search records..."
  - combobox: "Status: All"
  - button
  - text: "[ Data Table Placeholder ]"
- region "Notifications (F8)":
  - list
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('App routing and responsive navigation flow', async ({ page }) => {
  4  |   await page.setViewportSize({ width: 1280, height: 720 });
  5  |   
  6  |   // 1. Visit root, should redirect to login because we are unauthenticated.
  7  |   await page.goto('/');
  8  |   await expect(page).toHaveURL(/.*\/auth\/login/);
  9  |   await expect(page.locator('text=Authentication Simulator')).toBeVisible();
  10 | 
  11 |   // 2. Login as Member
  12 |   await page.click('button:has-text("Login as Member")');
  13 | 
  14 |   // Should redirect to role dashboard (Member -> /member/dashboard)
  15 |   await expect(page).toHaveURL(/.*\/member\/dashboard/);
  16 |   await expect(page.locator('h2', { hasText: 'Member Dashboard' })).toBeVisible();
  17 | 
  18 |   // 3. Test Breadcrumbs
  19 |   // Breadcrumb should show Home > Member > Dashboard. Let's just check Home and Member Dashboard are visible
> 20 |   await expect(page.locator('.hidden.sm\\:flex').locator('text=My Dashboard')).toBeVisible();
     |                                                                                ^ Error: expect(locator).toBeVisible() failed
  21 | 
  22 |   // 4. Navigate using Sidebar
  23 |   // Sidebar should have "My Workouts" for Member
  24 |   await page.click('text=My Workouts');
  25 |   await expect(page).toHaveURL(/.*\/member\/workouts/);
  26 |   await expect(page.locator('h2', { hasText: 'My Workouts' })).toBeVisible();
  27 | 
  28 |   // 5. Test 404
  29 |   await page.goto('/some-fake-route-404-test');
  30 |   await expect(page.locator('h3', { hasText: '404 - Page Not Found' })).toBeVisible();
  31 |   await page.click('button:has-text("Go Back")');
  32 | 
  33 |   // 6. Test 403 (Unauthorized Route)
  34 |   // Member trying to hit /dashboard (Owner route)
  35 |   await page.goto('/dashboard');
  36 |   await expect(page.locator('h3', { hasText: 'Not Authorized' })).toBeVisible();
  37 | });
  38 | 
```