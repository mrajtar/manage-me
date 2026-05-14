import { test, expect } from '@playwright/test';

declare global {
  interface Window {
    __PLAYWRIGHT_TEST_USER__?: boolean;
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__PLAYWRIGHT_TEST_USER__ = true;
  });

  await page.goto("http://localhost:5173");

  await expect(page.getByRole('heading', { name: /manageme/i })).toBeVisible();
});

test('full project lifecycle: create, edit, move, and delete', async ({ page }) => {
  
  // ==========================================
  // 1. CREATION SECTION
  // ==========================================
  
  // Create Project
  await page.getByPlaceholder(/project name/i).fill('TEST PROJECT');
  await page.getByPlaceholder(/project description/i).fill('TEST PROJECT DESC');
  await page.getByRole('button', { name: /add project/i }).click();


  const projectHeading = page.getByRole('heading', { name: /TEST PROJECT/i });
  await expect(projectHeading).toBeVisible();

  const projectCard = page.locator('div').filter({ has: projectHeading });
  await projectCard.getByRole('button', { name: /select/i }).click();

  // Create Story
  await page.getByPlaceholder(/story name/i).fill('TEST STORY');
  await page.getByRole('button', { name: /add story/i }).click();
  
  const storyCard = page.locator('.border', { hasText: 'TEST STORY' });
  await expect(storyCard).toBeVisible();

  // Select the Story to reveal Tasks
  await storyCard.getByRole('button', { name: /select/i }).click();

  // Create Task
  await page.getByPlaceholder(/task name/i).fill('TEST TASK');
  await page.getByPlaceholder(/task description/i).fill('TEST TASK DESC');
  await page.getByRole('button', { name: /add task/i }).click();
  
  const taskCard = page.locator('.card', { hasText: 'TEST TASK' });


  // ==========================================
  // 2. EDIT & STATUS CHANGE SECTION
  // ==========================================

  // Prepare Dialog Handler BEFORE clicking Edit
  page.on('dialog', async dialog => {
    if (dialog.message().toLowerCase().includes('name')) {
      await dialog.accept('UPDATED TEST PROJECT');
    } else {
      await dialog.accept('UPDATED DESC'); 
    }
  });
  
  // Trigger Edit on Project
  await projectHeading.getByRole('button', { name: /edit/i }).click();
  await expect(page.getByText('UPDATED TEST PROJECT')).toBeVisible();

  // Change Task Status
  const statusDropdown = taskCard.locator('select');
  await statusDropdown.selectOption('doing');
  
  // Verify it moved to the "DOING" column
  const doingSection = page.locator('.col-md-4', { hasText: 'DOING' });
  await expect(doingSection.locator('text=TEST TASK')).toBeVisible();


  // ==========================================
  // 3. DELETION SECTION
  // ==========================================
  
  // Delete Task
  await taskCard.getByRole('button', { name: /delete/i }).click();
  await expect(page.getByText('TEST TASK')).not.toBeVisible();

  // Delete Story
  await storyCard.getByRole('button', { name: /delete/i }).click();
  await expect(page.getByText('TEST STORY')).not.toBeVisible();

  // Delete Project (using updated name)
  const updatedProjectItem = page.locator('.list-group-item', { hasText: 'UPDATED TEST PROJECT' });
  await updatedProjectItem.getByRole('button', { name: /delete/i }).click();
  await expect(page.getByText('UPDATED TEST PROJECT')).not.toBeVisible();
});