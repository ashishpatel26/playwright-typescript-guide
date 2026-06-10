# Playwright Handbook

Production-grade Playwright + TypeScript engineering handbook — 15 levels from
testing fundamentals to Staff-QE architecture, 16 domain projects, 5 capstones.

**Live site:** https://ashishpatel26.github.io/playwright-typescript-guide/

## Development

```bash
npm install
npm run dev        # http://localhost:4321/playwright-typescript-guide/
npm run build      # static build + Pagefind search index
npm run preview    # serve dist/
npm run test:e2e   # Playwright smoke tests against preview
```

## Content authoring

Topics live in `src/content/levels/level-NN/*.mdx`. Frontmatter is validated
by zod (`src/content.config.ts`). Set `status: draft` to keep a page out of
the build; flip to `complete` to publish. Routes, sidebars, hubs, and
prev/next navigation generate automatically.

## Structure

See `docs/superpowers/specs/2026-06-10-playwright-handbook-website-design.md`
and `OUTLINE.md` for the full content roadmap.
