import { test, expect } from '@playwright/test';

// baseURL ends with a trailing slash, so all paths here are RELATIVE
// ('levels/0/', not '/levels/0/') — an absolute path would resolve against
// the origin and drop the /playwright-typescript-guide base path.

test('landing page renders hero and roadmap', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('production way');
  await expect(page.locator('.level-card')).toHaveCount(18);
});

test('level hub lists topics', async ({ page }) => {
  await page.goto('levels/0/');
  await expect(page.getByRole('heading', { name: 'Testing Fundamentals' })).toBeVisible();
  await expect(page.locator('.topic-card')).toHaveCount(5);
});

test('topic page has sidebar, TOC, and next nav', async ({ page }) => {
  await page.goto('levels/0/why-testing-exists/');
  await expect(page.locator('.side-link.on')).toHaveText('Why Testing Exists');
  await expect(page.locator('.toc a').first()).toBeVisible();
  await page.getByRole('link', { name: /Testing Pyramid →/ }).click();
  await expect(page).toHaveURL(/testing-pyramid/);
});

test('non-existent topic returns 404', async ({ page }) => {
  const res = await page.goto('levels/99/does-not-exist/');
  expect(res!.status()).toBe(404);
});

test('search returns results', async ({ page }) => {
  await page.goto('search/');
  await page.locator('.pagefind-ui__search-input').fill('locator');
  await expect(page.locator('.pagefind-ui__result').first()).toBeVisible();
});

test('code tabs switch', async ({ page }) => {
  await page.goto('levels/2/locators/');
  await page.getByRole('tab', { name: 'login.page.ts' }).click();
  await expect(page.locator('.ct-panel.on')).toContainText('class LoginPage');
});
