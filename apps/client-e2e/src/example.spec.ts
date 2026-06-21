import { test, expect } from '@playwright/test';

test.describe('PrepForge E2E Flows', () => {
  const testEmail = `user-e2e-${Date.now()}@example.com`;
  const testPassword = 'password123';
  const testName = 'E2E Tester';

  test('should register a new user, log in, navigate the application, and use the admin panel', async ({ page }) => {
    // 1. Go to login page and click register link
    await page.goto('/');
    await page.waitForURL('**/auth/login');
    await page.click('#link-register');
    await page.waitForURL('**/auth/register');
    await expect(page.locator('.auth-title')).toHaveText('Create Account');

    // 2. Fill the registration form
    await page.fill('#register-name', testName);
    await page.fill('#register-email', testEmail);
    await page.fill('#register-password', testPassword);
    await page.click('#btn-register');

    // 3. Should land on dashboard after registration redirects
    await page.waitForURL('**/dashboard');
    await expect(page.locator('.dash-greeting')).toContainText('E2E');

    // 4. Click Angular Qs navigation in sidebar
    await page.click('#nav-angular');
    await page.waitForURL('**/questions/angular');
    await expect(page.locator('.filter-count')).toBeVisible();

    // 5. Open a question detail
    const firstQuestionCard = page.locator('.question-card').first();
    await expect(firstQuestionCard).toBeVisible();
    await firstQuestionCard.click();

    // 6. Check that question details are shown and answer can be toggled
    const answerPanel = page.locator('.answer-content');
    const revealBtn = page.locator('#btn-reveal-answer');
    await expect(revealBtn).toBeVisible();
    await revealBtn.click();
    await expect(answerPanel).toBeVisible();

    // 7. Go to Notes page
    await page.click('#nav-notes');
    await page.waitForURL('**/notes');
    await expect(page.locator('.notes-title')).toContainText('My Notes');

    // 8. Go to Admin Panel
    await page.click('#nav-admin');
    await page.waitForURL('**/admin');
    await expect(page.locator('.admin-title')).toContainText('Admin Panel');

    const uniqueTitle = `What is E2E Testing? ${Date.now()}`;

    // 9. Create a new question
    await page.click('#btn-add-question');
    await page.fill('#form-topic', 'E2E Testing Topic');
    await page.fill('#form-title', uniqueTitle);
    await page.fill('#form-description', 'E2E testing description');
    await page.fill('#form-answer', 'E2E testing is a technique that tests the entire software flow from start to finish.');
    await page.fill('#form-tags', 'testing, playwright, e2e');
    await page.click('#btn-save-question');

    // Wait for modal to close
    await expect(page.locator('.modal-overlay')).toBeHidden();

    // 10. Check if the newly created question appears in the list
    await page.fill('#admin-search', uniqueTitle);
    const questionRow = page.locator('.admin-table tbody tr').first();
    await expect(questionRow).toContainText(uniqueTitle);

    // 11. Delete the created question
    const qIdMatch = await questionRow.locator('.btn-del').getAttribute('id');
    const qId = qIdMatch?.replace('btn-delete-', '');
    expect(qId).toBeDefined();

    await questionRow.locator('.btn-del').click();
    await page.click('#btn-confirm-delete');

    // 12. Check that it is deleted
    await expect(page.locator('.admin-table tbody tr')).toHaveCount(0);
  });
});
