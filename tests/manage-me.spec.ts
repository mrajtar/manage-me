import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173");
});

  test('test project, story and task', async ({ page }) => {
    
    // ==========================================
    // 1. CREATION SECTION
    // ==========================================
    
    await page.fill('input[placeholder*="Project name"]', 'TEST PROJECT');
    await page.fill('input[placeholder*="Description"]', 'TEST PROJECT DESC');
    await page.click('button:has-text("Add Project")');
    await expect(page.locator('text=TEST')).toBeVisible();

    await page.locator('.list-group-item:has-text("TEST PROJECT") >> text=Select').click();

    // Create Story
    await page.fill('input[placeholder*="Story name"]', 'TEST STORY');
    await page.click('button:has-text("Add Story")'); // Adjust based on your Story form button
    await expect(page.locator('text=TEST STORY')).toBeVisible();

    // Select the Story to reveal Tasks
    await page.locator('.border:has-text("TEST STORY") >> text=Select').click();

    // Create Task
    await page.fill('input[placeholder*="Task title"]', 'TEST TASK');
    await page.click('button:has-text("Add Task")');
    await expect(page.locator('text=TEST TASK')).toBeVisible();


    // ==========================================
    // 2. EDIT & STATUS CHANGE SECTION
    // ==========================================

    // Edit Project (Handling the browser prompt() we implemented earlier)
    page.on('dialog', async dialog => {
      // The prompt asks for Name first, then Description
      if (dialog.message().includes('name')) {
        await dialog.accept('UPDATED TEST PROJECT');
      } else {
        await dialog.accept('UPDATED DESC'); 
      }
    });
    
    // Trigger the edit prompt
    await page.locator('.list-group-item:has-text("TEST PROJECT") >> text=Edit').click();
    await expect(page.locator('text=UPDATED TEST PROJECT')).toBeVisible();

    // Change Task Status
    // Find the task card and locate the select dropdown inside it
    const taskCard = page.locator('.card:has-text("TEST TASK")');
    const statusDropdown = taskCard.locator('select');
    await statusDropdown.selectOption('doing');
    
    // Verify it moved to the "DOING" column/section
    const doingSection = page.locator('.col-md-4:has-text("DOING")');
    await expect(doingSection.locator('text=TEST TASK')).toBeVisible();


    // ==========================================
    // 3. DELETION SECTION
    // ==========================================
    
    // Delete Task
    await doingSection.locator('.card:has-text("TEST TASK") >> text=Delete').click();
    await expect(page.locator('text=TEST TASK')).not.toBeVisible();

    // Delete Story
    await page.locator('.border:has-text("TEST STORY") >> text=Delete').click();
    await expect(page.locator('text=TEST STORY')).not.toBeVisible();

    // Delete Project
    await page.locator('.list-group-item:has-text("UPDATED TEST PROJECT") >> text=Delete').click();
    await expect(page.locator('text=UPDATED TEST PROJECT')).not.toBeVisible();
  });
;