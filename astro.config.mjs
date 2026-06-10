// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://ashishpatel26.github.io',
  base: '/playwright-typescript-guide',
  integrations: [react(), mdx()],
  markdown: {
    shikiConfig: { theme: 'github-dark-default' },
  },
});
