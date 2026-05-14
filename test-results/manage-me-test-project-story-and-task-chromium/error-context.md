# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: manage-me.spec.ts >> test project, story and task
- Location: tests\manage-me.spec.ts:15:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=TEST PROJECT')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=TEST PROJECT')

```

```yaml
- navigation:
  - button "Dark"
  - text: Playwright Tester, admin
  - button "🔔"
  - button "Users"
  - button "Home"
  - button "Logout"
- heading "ManageMe" [level=1]
- heading "Add project" [level=3]
- textbox "Project Name"
- textbox "Project Description"
- button "Add project"
- paragraph: Choose project
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | declare global {
  3  |   interface Window {
  4  |     __PLAYWRIGHT_TEST_USER__?: boolean;
  5  |   }
  6  | }
  7  | 
  8  | test.beforeEach(async ({ page }) => {
  9  |     await page.addInitScript(() => {
  10 |     window.__PLAYWRIGHT_TEST_USER__ = true;
  11 |   });
  12 |   await page.goto("http://localhost:5173");
  13 | });
  14 | 
  15 |   test('test project, story and task', async ({ page }) => {
  16 |     
  17 |     // ==========================================
  18 |     // 1. CREATION SECTION
  19 |     // ==========================================
  20 |     
  21 |     await page.fill('input[placeholder*="Project Name"]', 'TEST PROJECT');
  22 |     await page.fill('input[placeholder*="Project Description"]', 'TEST PROJECT DESC');
  23 |     await page.click('button:has-text("Add Project")');
> 24 |     await expect(page.locator('text=TEST PROJECT')).toBeVisible();
     |                                                     ^ Error: expect(locator).toBeVisible() failed
  25 | 
  26 |     await page.locator('.list-group-item:has-text("TEST PROJECT") >> text=Select').click();
  27 | 
  28 |     // Create Story
  29 |     await page.fill('input[placeholder*="Story name"]', 'TEST STORY');
  30 |     await page.click('button:has-text("Add Story")'); // Adjust based on your Story form button
  31 |     await expect(page.locator('text=TEST STORY')).toBeVisible();
  32 | 
  33 |     // Select the Story to reveal Tasks
  34 |     await page.locator('.border:has-text("TEST STORY") >> text=Select').click();
  35 | 
  36 |     // Create Task
  37 |     await page.fill('input[placeholder*="Task title"]', 'TEST TASK');
  38 |     await page.click('button:has-text("Add Task")');
  39 |     await expect(page.locator('text=TEST TASK')).toBeVisible();
  40 | 
  41 | 
  42 |     // ==========================================
  43 |     // 2. EDIT & STATUS CHANGE SECTION
  44 |     // ==========================================
  45 | 
  46 |     // Edit Project (Handling the browser prompt() we implemented earlier)
  47 |     page.on('dialog', async dialog => {
  48 |       // The prompt asks for Name first, then Description
  49 |       if (dialog.message().includes('name')) {
  50 |         await dialog.accept('UPDATED TEST PROJECT');
  51 |       } else {
  52 |         await dialog.accept('UPDATED DESC'); 
  53 |       }
  54 |     });
  55 |     
  56 |     // Trigger the edit prompt
  57 |     await page.locator('.list-group-item:has-text("TEST PROJECT") >> text=Edit').click();
  58 |     await expect(page.locator('text=UPDATED TEST PROJECT')).toBeVisible();
  59 | 
  60 |     // Change Task Status
  61 |     // Find the task card and locate the select dropdown inside it
  62 |     const taskCard = page.locator('.card:has-text("TEST TASK")');
  63 |     const statusDropdown = taskCard.locator('select');
  64 |     await statusDropdown.selectOption('doing');
  65 |     
  66 |     // Verify it moved to the "DOING" column/section
  67 |     const doingSection = page.locator('.col-md-4:has-text("DOING")');
  68 |     await expect(doingSection.locator('text=TEST TASK')).toBeVisible();
  69 | 
  70 | 
  71 |     // ==========================================
  72 |     // 3. DELETION SECTION
  73 |     // ==========================================
  74 |     
  75 |     // Delete Task
  76 |     await doingSection.locator('.card:has-text("TEST TASK") >> text=Delete').click();
  77 |     await expect(page.locator('text=TEST TASK')).not.toBeVisible();
  78 | 
  79 |     // Delete Story
  80 |     await page.locator('.border:has-text("TEST STORY") >> text=Delete').click();
  81 |     await expect(page.locator('text=TEST STORY')).not.toBeVisible();
  82 | 
  83 |     // Delete Project
  84 |     await page.locator('.list-group-item:has-text("UPDATED TEST PROJECT") >> text=Delete').click();
  85 |     await expect(page.locator('text=UPDATED TEST PROJECT')).not.toBeVisible();
  86 |   });
  87 | ;
```