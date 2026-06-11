import { test, expect } from '@playwright/test';

// baseURL = 'http://localhost:4321/playwright-typescript-guide/' — use relative paths
test.describe('Widget smoke tests', () => {
  test('QuizCard renders on why-testing-exists', async ({ page }) => {
    await page.goto('levels/0/why-testing-exists/');
    await expect(page.locator('[data-testid="quiz-card"]')).toBeVisible({ timeout: 15000 });
  });

  test('ConceptDiagram renders on testing-pyramid', async ({ page }) => {
    await page.goto('levels/0/testing-pyramid/');
    await expect(page.locator('svg[aria-label*="Testing pyramid"]')).toBeVisible({ timeout: 15000 });
  });

  test('TsPlayground renders on locators page', async ({ page }) => {
    await page.goto('levels/2/locators/');
    await expect(page.locator('.monaco-editor').first()).toBeVisible({ timeout: 20000 });
  });

  test('LocatorLab renders on locators page', async ({ page }) => {
    await page.goto('levels/2/locators/');
    await expect(page.frameLocator('iframe[title="practice page"]').locator('[data-testid="username"]')).toBeVisible({ timeout: 15000 });
  });

  test('PwRunner renders on locators page', async ({ page }) => {
    await page.goto('levels/2/locators/');
    await expect(page.getByRole('button', { name: /Run/i }).first()).toBeVisible({ timeout: 20000 });
  });

  test('L1 TsPlayground renders on variables-and-types', async ({ page }) => {
    await page.goto('levels/1/variables-and-types/');
    await expect(page.locator('.monaco-editor').first()).toBeVisible({ timeout: 20000 });
  });

  test('L0 quiz renders on test-trophy', async ({ page }) => {
    await page.goto('levels/0/test-trophy/');
    await expect(page.locator('[data-testid="quiz-card"]')).toBeVisible({ timeout: 15000 });
  });

  test('L2 first-test page renders', async ({ page }) => {
    await page.goto('levels/2/first-test/');
    await expect(page.getByRole('heading', { name: 'Your First Playwright Test' })).toBeVisible();
  });

  test('L2 waiting page renders with ConceptDiagram', async ({ page }) => {
    await page.goto('levels/2/waiting/');
    await expect(page.locator('svg[aria-label*="Retry timeline"]')).toBeVisible({ timeout: 15000 });
  });

  test('L3 browser-contexts renders with ConceptDiagram', async ({ page }) => {
    await page.goto('levels/3/browser-contexts/');
    await expect(page.locator('svg[aria-label*="Browser"]')).toBeVisible({ timeout: 15000 });
  });

  test('L3 debugging page renders with quiz', async ({ page }) => {
    await page.goto('levels/3/debugging-and-tracing/');
    await expect(page.locator('[data-testid="quiz-card"]')).toBeVisible({ timeout: 15000 });
  });
});
