# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: manage-me.spec.ts >> full project lifecycle: create, edit, move, and delete
- Location: tests\manage-me.spec.ts:19:1

# Error details

```
Error: locator.click: Error: strict mode violation: locator('div, section, article').filter({ has: getByRole('heading', { name: /TEST PROJECT/i }) }).getByRole('button', { name: /edit/i }) resolved to 2 elements:
    1) <button class="btn btn-primary btn-sm">Edit</button> aka getByRole('button', { name: 'Edit' }).first()
    2) <button class="btn btn-primary btn-sm">Edit</button> aka getByRole('button', { name: 'Edit' }).nth(1)

Call log:
  - waiting for locator('div, section, article').filter({ has: getByRole('heading', { name: /TEST PROJECT/i }) }).getByRole('button', { name: /edit/i })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e6]:
      - button "Dark" [ref=e7] [cursor=pointer]
      - generic [ref=e8]:
        - generic [ref=e9]: Playwright Tester, admin
        - button "🔔 2" [ref=e10] [cursor=pointer]:
          - text: 🔔
          - generic [ref=e11]: "2"
        - button "Users" [ref=e12] [cursor=pointer]
        - button "Home" [ref=e13] [cursor=pointer]
        - button "Logout" [ref=e14] [cursor=pointer]
  - generic [ref=e15]:
    - heading "ManageMe" [level=1] [ref=e16]
    - generic [ref=e17]:
      - heading "Add project" [level=3] [ref=e18]
      - generic [ref=e19]:
        - textbox "Project Name" [ref=e20]
        - textbox "Project Description" [ref=e21]
        - button "Add project" [ref=e22] [cursor=pointer]
    - generic [ref=e24]:
      - generic [ref=e25]:
        - 'heading "Name: TEST PROJECT" [level=5] [ref=e26]'
        - text: "Description: TEST PROJECT DESC"
      - generic [ref=e27]:
        - button "Select" [ref=e28] [cursor=pointer]
        - button "Edit" [ref=e29] [cursor=pointer]
        - button "Delete" [ref=e30] [cursor=pointer]
    - heading "Stories" [level=2] [ref=e31]
    - generic [ref=e32]:
      - heading "Add Story" [level=4] [ref=e33]
      - generic [ref=e34]:
        - textbox "Story name" [ref=e35]
        - textbox "Story Description" [ref=e36]
        - combobox [ref=e37]:
          - option "Low" [selected]
          - option "Medium"
          - option "High"
        - button "Add Story" [ref=e38] [cursor=pointer]
    - generic [ref=e39]:
      - generic [ref=e41]:
        - heading "TODO" [level=4] [ref=e42]
        - generic [ref=e44]:
          - generic [ref=e45]: "Name: TEST STORY"
          - generic [ref=e46]: "Priority: low"
          - generic [ref=e47]:
            - button "Select" [ref=e48] [cursor=pointer]
            - button "Edit" [ref=e49] [cursor=pointer]
            - button "Delete" [ref=e50] [cursor=pointer]
            - combobox [ref=e51]:
              - option "Todo" [selected]
              - option "Doing"
              - option "Done"
            - combobox [ref=e52]:
              - option "Low" [selected]
              - option "Medium"
              - option "High"
      - heading "DOING" [level=4] [ref=e55]
      - heading "DONE" [level=4] [ref=e58]
    - heading "Tasks" [level=3] [ref=e59]
    - generic [ref=e60]:
      - heading "Add task" [level=3] [ref=e61]
      - generic [ref=e62]:
        - textbox "Task Name" [ref=e63]
        - textbox "Task Description" [ref=e64]
        - spinbutton [ref=e65]: "1"
        - combobox [ref=e66]:
          - option "Low"
          - option "Medium" [selected]
          - option "High"
        - button "Add task" [active] [ref=e67] [cursor=pointer]
    - generic [ref=e69]:
      - generic [ref=e70]:
        - heading "todo" [level=4] [ref=e71]
        - generic [ref=e73]:
          - generic [ref=e74]:
            - text: TEST TASK
            - generic [ref=e75]: medium
          - generic [ref=e76]: TEST TASK DESC
          - generic [ref=e77]:
            - strong [ref=e78]: "est:"
            - text: 1h •
            - strong [ref=e79]: "spent:"
            - text: 0h
          - generic [ref=e80]:
            - combobox [ref=e81]:
              - option "Assign user" [selected]
              - option "Playwright Tester (admin)"
            - button "Mark done" [ref=e82] [cursor=pointer]
            - button "Delete" [ref=e83] [cursor=pointer]
          - generic [ref=e85]: "created: 5/14/2026, 11:29:08 PM"
      - heading "doing" [level=4] [ref=e87]
      - heading "done" [level=4] [ref=e89]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | declare global {
  4   |   interface Window {
  5   |     __PLAYWRIGHT_TEST_USER__?: boolean;
  6   |   }
  7   | }
  8   | 
  9   | test.beforeEach(async ({ page }) => {
  10  |   await page.addInitScript(() => {
  11  |     window.__PLAYWRIGHT_TEST_USER__ = true;
  12  |   });
  13  | 
  14  |   await page.goto("http://localhost:5173");
  15  | 
  16  |   await expect(page.getByRole('heading', { name: /manageme/i })).toBeVisible();
  17  | });
  18  | 
  19  | test('full project lifecycle: create, edit, move, and delete', async ({ page }) => {
  20  |   
  21  |   // ==========================================
  22  |   // 1. CREATION SECTION
  23  |   // ==========================================
  24  |   
  25  |   // Create Project
  26  |   await page.getByPlaceholder(/project name/i).fill('TEST PROJECT');
  27  |   await page.getByPlaceholder(/project description/i).fill('TEST PROJECT DESC');
  28  |   await page.getByRole('button', { name: /add project/i }).click();
  29  | 
  30  | 
  31  |   const projectHeading = page.getByRole('heading', { name: /TEST PROJECT/i });
  32  |   await expect(projectHeading).toBeVisible();
  33  | 
  34  |   const projectCard = page.locator('div').filter({ has: projectHeading });
  35  |   await projectCard.getByRole('button', { name: /select/i }).click();
  36  | 
  37  |   // Create Story
  38  |   await page.getByPlaceholder(/story name/i).fill('TEST STORY');
  39  |   await page.getByRole('button', { name: /add story/i }).click();
  40  |   
  41  |   const storyCard = page.locator('.border', { hasText: 'TEST STORY' });
  42  |   await expect(storyCard).toBeVisible();
  43  | 
  44  |   // Select the Story to reveal Tasks
  45  |   await storyCard.getByRole('button', { name: /select/i }).click();
  46  | 
  47  |   // Create Task
  48  |   await page.getByPlaceholder(/task name/i).fill('TEST TASK');
  49  |   await page.getByPlaceholder(/task description/i).fill('TEST TASK DESC');
  50  |   await page.getByRole('button', { name: /add task/i }).click();
  51  |   
  52  |   const taskCard = page.locator('.card', { hasText: 'TEST TASK' });
  53  | 
  54  | 
  55  |   // ==========================================
  56  |   // 2. EDIT & STATUS CHANGE SECTION
  57  |   // ==========================================
  58  | 
  59  |   // Prepare Dialog Handler BEFORE clicking Edit
  60  | const projectCardMain = page.locator('div, section, article') // Scope to the generic container
  61  |   .filter({ has: page.getByRole('heading', { name: /TEST PROJECT/i }) });
  62  | 
  63  | // Prepare Dialog Handler BEFORE clicking Edit
  64  | page.on('dialog', async dialog => {
  65  |   if (dialog.message().toLowerCase().includes('name')) {
  66  |     await dialog.accept('UPDATED TEST PROJECT');
  67  |   } else {
  68  |     await dialog.accept('UPDATED DESC'); 
  69  |   }
  70  | });
  71  | 
  72  | // Trigger Edit on the Project Card, not the Heading
> 73  | await projectCardMain.getByRole('button', { name: /edit/i }).click();
      |                                                              ^ Error: locator.click: Error: strict mode violation: locator('div, section, article').filter({ has: getByRole('heading', { name: /TEST PROJECT/i }) }).getByRole('button', { name: /edit/i }) resolved to 2 elements:
  74  |   await expect(page.getByText('UPDATED TEST PROJECT')).toBeVisible();
  75  | 
  76  |   // Change Task Status
  77  |   const statusDropdown = taskCard.locator('select');
  78  |   await statusDropdown.selectOption('doing');
  79  |   
  80  |   // Verify it moved to the "DOING" column
  81  |   const doingSection = page.locator('.col-md-4', { hasText: 'DOING' });
  82  |   await expect(doingSection.locator('text=TEST TASK')).toBeVisible();
  83  | 
  84  | 
  85  |   // ==========================================
  86  |   // 3. DELETION SECTION
  87  |   // ==========================================
  88  |   
  89  |   // Delete Task
  90  |   await taskCard.getByRole('button', { name: /delete/i }).click();
  91  |   await expect(page.getByText('TEST TASK')).not.toBeVisible();
  92  | 
  93  |   // Delete Story
  94  |   await storyCard.getByRole('button', { name: /delete/i }).click();
  95  |   await expect(page.getByText('TEST STORY')).not.toBeVisible();
  96  | 
  97  |   // Delete Project (using updated name)
  98  |   const updatedProjectItem = page.locator('.list-group-item', { hasText: 'UPDATED TEST PROJECT' });
  99  |   await updatedProjectItem.getByRole('button', { name: /delete/i }).click();
  100 |   await expect(page.getByText('UPDATED TEST PROJECT')).not.toBeVisible();
  101 | });
```