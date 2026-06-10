import { test, expect } from '@playwright/test';

// baseURL = 'http://localhost:4321/playwright-typescript-guide/' — use relative paths
test.describe('Widget smoke tests', () => {
  test('QuizCard renders on why-testing-exists', async ({ page }) => {
    await page.goto('levels/0/why-testing-exists/');
    await expect(page.locator('[data-testid="quiz-card"]')).toBeVisible({ timeout: 15000 });
  });

  test('ConceptDiagram renders on testing-pyramid', async ({ page }) => {
    await page.goto('levels/0/testing-pyramid/');
    // ConceptDiagram testing-pyramid SVG has role="img" with aria-label
    await expect(page.locator('svg[aria-label*="Testing pyramid"]')).toBeVisible({ timeout: 15000 });
  });

  test('TsPlayground renders on locators page', async ({ page }) => {
    await page.goto('levels/2/locators/');
    await expect(page.locator('.monaco-editor').first()).toBeVisible({ timeout: 20000 });
  });

  test('LocatorLab renders on locators page', async ({ page }) => {
    await page.goto('levels/2/locators/');
    // LocatorLab iframe shows login.html — verify the username field is present
    await expect(page.frameLocator('iframe[title="practice page"]').locator('[data-testid="username"]')).toBeVisible({ timeout: 15000 });
  });

  test('PwRunner renders on locators page', async ({ page }) => {
    await page.goto('levels/2/locators/');
    // PwRunner has a Run button
    await expect(page.getByRole('button', { name: /Run/i }).first()).toBeVisible({ timeout: 20000 });
  });
});
