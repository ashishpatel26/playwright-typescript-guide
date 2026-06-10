import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  // Trailing slash matters: relative paths like 'levels/0/' resolve against
  // the base path. An absolute '/levels/0/' would drop /playwright-typescript-guide.
  use: { baseURL: 'http://localhost:4321/playwright-typescript-guide/' },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321/playwright-typescript-guide/',
    reuseExistingServer: !process.env.CI,
  },
});
