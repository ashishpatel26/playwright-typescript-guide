import { test, expect } from '@playwright/test';

const BASE = '/playwright-typescript-guide';

test.describe('Widget smoke tests', () => {
  test('QuizCard renders on why-testing-exists', async ({ page }) => {
    await page.goto(`${BASE}/levels/level-00/why-testing-exists/`);
    await expect(page.locator('[data-testid="quiz-card"]')).toBeVisible({ timeout: 10000 });
  });

  test('ConceptDiagram renders on testing-pyramid', async ({ page }) => {
    await page.goto(`${BASE}/levels/level-00/testing-pyramid/`);
    // ConceptDiagram testing-pyramid SVG contains labelled text nodes
    await expect(page.locator('svg[aria-label*="Testing pyramid"]')).toBeVisible({ timeout: 10000 });
  });

  test('TsPlayground renders on locators page', async ({ page }) => {
    await page.goto(`${BASE}/levels/level-02/locators/`);
    await expect(page.locator('.monaco-editor').first()).toBeVisible({ timeout: 15000 });
  });

  test('LocatorLab renders on locators page', async ({ page }) => {
    await page.goto(`${BASE}/levels/level-02/locators/`);
    // LocatorLab iframe shows login.html — verify the username field is present
    await expect(page.frameLocator('iframe[title="practice page"]').locator('[data-testid="username"]')).toBeVisible({ timeout: 10000 });
  });

  test('PwRunner renders on locators page', async ({ page }) => {
    await page.goto(`${BASE}/levels/level-02/locators/`);
    // PwRunner has a Run button
    await expect(page.getByRole('button', { name: /Run/i }).first()).toBeVisible({ timeout: 15000 });
  });
});
