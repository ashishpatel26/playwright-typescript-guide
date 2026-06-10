# Wave 1a — Site Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deployable Playwright Handbook site shell on GitHub Pages — theme, layouts, content collections, landing page, level hubs, topic pages, static components, search, CI/CD.

**Architecture:** Astro 5 static site with content collections (zod-validated MDX). Midnight Ember theme via CSS custom properties in a global stylesheet. Dynamic routes generate level hubs and topic pages from collection entries. Pagefind indexes the built site. GitHub Actions builds and deploys to Pages.

**Tech Stack:** Astro 5, @astrojs/mdx, @astrojs/react, React 18, TypeScript, Pagefind, @playwright/test, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-06-10-playwright-handbook-website-design.md`

**Conventions used throughout:**
- Base path: `/playwright-typescript-guide` — ALL internal links must be prefixed with `import.meta.env.BASE_URL` (exposed as `base` variable in each file).
- React widgets are NOT in this plan (Plan B). `CodeTabs` and `CmdTable` are static Astro components.
- Commit after every task.

---

### Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (placeholder), `.gitignore`

- [ ] **Step 1: Scaffold into the existing repo root**

Run from `d:\Projects\playwright-typescript-guide`:

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
```

If the wizard complains directory not empty, allow "Yes, continue" (existing files: README, LICENSE, OUTLINE.md, docs/ are preserved; if the wizard refuses, scaffold into `temp-astro/` and move `package.json`, `tsconfig.json`, `astro.config.mjs`, `src/` to root, then delete `temp-astro/`).

- [ ] **Step 2: Install dependencies**

```bash
npm install
npx astro add react mdx --yes
npm install pagefind
npm install -D @playwright/test
```

- [ ] **Step 3: Write `astro.config.mjs`**

```js
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
```

- [ ] **Step 4: Update `.gitignore`**

Append (create if missing):

```
node_modules/
dist/
.astro/
.superpowers/
test-results/
playwright-report/
```

- [ ] **Step 5: Add build script with Pagefind to `package.json` scripts**

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pagefind --site dist",
    "preview": "astro preview",
    "check": "astro check",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 6: Placeholder index page** — `src/pages/index.astro`:

```astro
---
---
<html lang="en"><body><h1>Playwright Handbook</h1></body></html>
```

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: `astro build` succeeds, Pagefind runs and reports indexed pages, `dist/` exists.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro 5 project with react, mdx, pagefind"
```

---

### Task 2: Theme tokens + global stylesheet

**Files:**
- Create: `src/theme/tokens.ts`
- Create: `src/styles/global.css`

- [ ] **Step 1: Write `src/theme/tokens.ts`** (single source of truth; used later by MUI theme in Plan B)

```ts
export const tokens = {
  bg: '#0C1018',
  panel: '#121927',
  panel2: '#0F1520',
  line: '#202B3D',
  ink: '#E8EDF5',
  muted: '#8A96A8',
  faint: '#5A6678',
  ember: '#F05133',
  emberSoft: '#FF7B5C',
  blue: '#6BB5FF',
  amber: '#FFB454',
  green: '#7EE787',
  pink: '#F778BA',
  violet: '#A5A0FF',
  cyan: '#56D4DD',
  codeAccent: '#FFD9A0',
} as const;

export type Tokens = typeof tokens;
```

- [ ] **Step 2: Write `src/styles/global.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');

:root {
  --bg: #0C1018; --panel: #121927; --panel2: #0F1520; --line: #202B3D;
  --ink: #E8EDF5; --muted: #8A96A8; --faint: #5A6678;
  --ember: #F05133; --ember-soft: #FF7B5C;
  --c-blue: #6BB5FF; --c-amber: #FFB454; --c-green: #7EE787;
  --c-pink: #F778BA; --c-violet: #A5A0FF; --c-cyan: #56D4DD;
  --code-accent: #FFD9A0;
  --mono: 'IBM Plex Mono', ui-monospace, Menlo, monospace;
  --body: 'Inter', system-ui, sans-serif;
  --disp: 'Bricolage Grotesque', 'Inter', system-ui, sans-serif;
  --r: 14px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--ink); font-family: var(--body); font-size: 16px; line-height: 1.65; }
::selection { background: #f0513355; color: #fff; }
.wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.eyebrow { font-family: var(--mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--ember); margin-bottom: 14px; }
.eyebrow span { color: var(--faint); }
h1, h2, h3 { font-family: var(--disp); letter-spacing: -.01em; }
h2 { font-size: clamp(28px, 4vw, 42px); font-weight: 800; line-height: 1.1; margin-bottom: 14px; }
h3 { font-size: 21px; font-weight: 600; margin: 36px 0 10px; }
.lede { color: var(--muted); max-width: 680px; font-size: 17px; }
code:not(pre code) { font-family: var(--mono); font-size: .88em; background: var(--panel); border: 1px solid var(--line); padding: 2px 7px; border-radius: 6px; color: var(--code-accent); }
pre { background: #0A0E15 !important; border: 1px solid var(--line); border-radius: var(--r); padding: 16px; overflow-x: auto; font-size: 13.5px; line-height: 1.7; }
a { color: var(--c-blue); }
.panel { background: var(--panel); border: 1px solid var(--line); border-radius: var(--r); padding: 22px; }
.tip { border-left: 3px solid var(--ember); background: var(--panel); border-radius: 0 var(--r) var(--r) 0; padding: 14px 18px; margin-top: 22px; font-size: 14.5px; color: var(--muted); }
.tip b { color: var(--ink); }
:focus-visible { outline: 2px solid var(--ember); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } html { scroll-behavior: auto; } }
```

- [ ] **Step 3: Verify build** — `npm run build` passes.

- [ ] **Step 4: Commit**

```bash
git add src/theme/tokens.ts src/styles/global.css
git commit -m "feat: add Midnight Ember theme tokens and global stylesheet"
```

---

### Task 3: Levels metadata

**Files:**
- Create: `src/data/levels.ts`

- [ ] **Step 1: Write `src/data/levels.ts`** — drives landing roadmap, hub pages, breadcrumbs:

```ts
export interface LevelMeta {
  num: number;
  slug: string;
  title: string;
  description: string;
  hours: number; // estimated learner hours
}

export const levels: LevelMeta[] = [
  { num: 0,  slug: 'testing-fundamentals',    title: 'Testing Fundamentals',                description: 'Why testing exists, test design techniques, and the thinking that separates engineers from script writers.', hours: 12 },
  { num: 1,  slug: 'typescript',              title: 'TypeScript for Automation Engineers', description: 'Core and advanced TypeScript with real coding exercises — the language layer under every framework you will build.', hours: 20 },
  { num: 2,  slug: 'playwright-fundamentals', title: 'Playwright Fundamentals',             description: 'Locators, actions, assertions, and wait strategies practiced on real demo applications.', hours: 16 },
  { num: 3,  slug: 'advanced-playwright',     title: 'Advanced Playwright',                 description: 'Contexts, frames, shadow DOM, network interception, auth, and everything production suites need.', hours: 18 },
  { num: 4,  slug: 'framework-design',        title: 'Production Framework Design',         description: 'POM to Screenplay, design patterns, SOLID — architecture that survives 5,000 tests.', hours: 20 },
  { num: 5,  slug: 'api-testing',             title: 'API Testing',                         description: 'REST, GraphQL, auth flows, contract testing, and hybrid UI+API end-to-end flows.', hours: 16 },
  { num: 6,  slug: 'database-testing',        title: 'Database Testing',                    description: 'SQL and NoSQL validation strategies that close the loop on data integrity.', hours: 12 },
  { num: 7,  slug: 'ci-cd',                   title: 'CI/CD for Automation',                description: 'Pipelines on GitHub Actions, Jenkins, GitLab — parallel execution, artifacts, reporting.', hours: 14 },
  { num: 8,  slug: 'docker-containers',       title: 'Docker & Containers',                 description: 'Containerized test execution from docker run to Kubernetes.', hours: 10 },
  { num: 9,  slug: 'cloud-testing',           title: 'Cloud Testing',                       description: 'AWS, Azure, GCP infrastructure plus BrowserStack, LambdaTest, Sauce Labs grids.', hours: 10 },
  { num: 10, slug: 'performance-testing',     title: 'Performance Testing Awareness',       description: 'Load, stress, spike, endurance — with JMeter, k6, and Locust.', hours: 8 },
  { num: 11, slug: 'security-testing',        title: 'Security Testing Awareness',          description: 'OWASP Top 10, XSS, CSRF, injection — what automation engineers must catch.', hours: 8 },
  { num: 12, slug: 'observability',           title: 'Observability',                       description: 'Logs, metrics, traces, OpenTelemetry — debugging failures like a production engineer.', hours: 8 },
  { num: 13, slug: 'ai-test-automation',      title: 'AI in Test Automation',               description: 'MCP, agentic testing, Playwright MCP, self-healing tests, LLM test generation.', hours: 10 },
  { num: 14, slug: 'interview-prep',          title: 'Interview Preparation',               description: 'Framework design, architecture reviews, scalability, and leadership scenarios for SDET to Staff QE.', hours: 12 },
];

export const levelByNum = (n: number): LevelMeta | undefined => levels.find(l => l.num === n);
```

- [ ] **Step 2: Verify** — `npm run check` passes (no type errors).

- [ ] **Step 3: Commit**

```bash
git add src/data/levels.ts
git commit -m "feat: add levels metadata for all 15 levels"
```

---

### Task 4: Content collections + seed topics

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/levels/level-00/why-testing-exists.mdx`
- Create: `src/content/levels/level-00/testing-pyramid.mdx`
- Create: `src/content/levels/level-02/locators.mdx`
- Create: `src/content/levels/level-02/actions.mdx` (draft — proves draft filtering)

- [ ] **Step 1: Write `src/content.config.ts`** (Astro 5 content layer):

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const topics = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/levels' }),
  schema: z.object({
    title: z.string(),
    level: z.number().int().min(0).max(14),
    order: z.number().int(),
    description: z.string(),
    practiceSite: z.object({ name: z.string(), url: z.string().url() }).optional(),
    widgets: z.array(z.enum(['ts-playground', 'locator-lab', 'pw-runner', 'diagram', 'quiz'])).optional(),
    duration: z.string().optional(),
    status: z.enum(['complete', 'draft']).default('draft'),
  }),
});

const domains = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/domains' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    demoSite: z.object({ name: z.string(), url: z.string().url() }).optional(),
    features: z.array(z.string()),
    status: z.enum(['complete', 'draft']).default('draft'),
  }),
});

const capstones = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/capstones' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    order: z.number().int(),
    status: z.enum(['complete', 'draft']).default('draft'),
  }),
});

export const collections = { topics, domains, capstones };
```

Note: create empty placeholder dirs `src/content/domains/` and `src/content/capstones/` with a `.gitkeep` each so glob loaders don't warn.

- [ ] **Step 2: Write seed topic `src/content/levels/level-00/why-testing-exists.mdx`**

```mdx
---
title: Why Testing Exists
level: 0
order: 1
description: Software fails in expensive ways. Testing is the engineering discipline that finds failure before users do.
duration: 20 min
status: complete
---

## The cost of a bug

A bug caught in a code review costs minutes. The same bug in production costs
incident calls, rollbacks, customer trust, and sometimes regulatory fines.
Testing exists because the cost of failure grows exponentially with how late
you find it.

## What testing is — and is not

Testing is **risk reduction through evidence**. It is not proof of correctness:
no test suite can prove the absence of bugs, only demonstrate presence of
expected behavior under known conditions.

## Production reality

Every topic in this handbook ends with how it fails in production. Start
building that reflex now: for every feature you ever test, ask *"what is the
most expensive way this could break?"*
```

- [ ] **Step 3: Write `src/content/levels/level-00/testing-pyramid.mdx`**

```mdx
---
title: Testing Pyramid
level: 0
order: 2
description: Unit tests at the base, E2E at the peak — and why inverting the pyramid produces unmaintainable suites.
duration: 25 min
status: complete
---

## The shape

Many fast, cheap unit tests at the bottom. Fewer integration tests in the
middle. A thin layer of end-to-end tests at the top.

## Why E2E is the peak, not the base

E2E tests are the most realistic and the most expensive: slowest to run,
hardest to debug, most prone to flakiness. A suite of 5,000 E2E tests and no
unit tests is an inverted pyramid — an ice cream cone — and it melts in CI.

## Where Playwright fits

Playwright lives at the top two layers. Your job as an automation engineer is
to keep that top layer thin, fast, and trustworthy.
```

- [ ] **Step 4: Write `src/content/levels/level-02/locators.mdx`**

```mdx
---
title: Locators
level: 2
order: 1
description: getByRole, getByText, CSS, XPath, test IDs — and which to choose for tests that survive refactors.
practiceSite: { name: SauceDemo, url: "https://www.saucedemo.com" }
duration: 40 min
status: complete
---

## Locator priority

Playwright's guidance, in order: `getByRole` → `getByLabel` → `getByText` →
`getByTestId` → CSS → XPath. Role-based locators assert accessibility for free
and survive markup refactors.

```ts
// Resilient: tied to user-visible semantics
await page.getByRole('button', { name: 'Login' }).click();

// Fragile: tied to implementation details
await page.locator('#root > div > div:nth-child(2) > button').click();
```

## Strict mode

Every Playwright locator must resolve to exactly one element when actioned.
Two matches throw — by design. Disambiguate with `filter()`, `nth()`, or a
more specific role/name.

## Practice on SauceDemo

1. Log in using only `getByRole` and `getByLabel` locators.
2. Add the first inventory item to the cart without using CSS selectors.
3. Find a locator that matches two elements and fix it with `filter()`.
```

- [ ] **Step 5: Write `src/content/levels/level-02/actions.mdx`** (draft):

```mdx
---
title: Actions
level: 2
order: 2
description: Click, fill, select, hover, drag — Playwright's auto-waiting action APIs.
status: draft
---

Coming soon.
```

- [ ] **Step 6: Verify** — `npm run check` passes; `npm run build` passes.

- [ ] **Step 7: Commit**

```bash
git add src/content.config.ts src/content/
git commit -m "feat: add content collections with zod schemas and seed topics"
```

---

### Task 5: Base layout, Nav, Footer

**Files:**
- Create: `src/layouts/Base.astro`
- Create: `src/components/astro/Nav.astro`
- Create: `src/components/astro/Footer.astro`

- [ ] **Step 1: Write `src/components/astro/Nav.astro`**

```astro
---
const base = import.meta.env.BASE_URL;
---
<nav class="nav">
  <div class="nav-in">
    <a class="logo" href={base}>pw<b>·handbook</b></a>
    <div class="nav-links">
      <a href={`${base}#levels`}>Levels</a>
      <a href={`${base}#domains`}>Domain Projects</a>
      <a href={`${base}#capstones`}>Capstones</a>
      <a href={`${base}search/`}>Search</a>
      <a href="https://github.com/ashishpatel26/playwright-typescript-guide" rel="noopener">GitHub</a>
    </div>
  </div>
</nav>
<style>
.nav { position: sticky; top: 0; z-index: 50; background: #0c1018e6; backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
.nav-in { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; gap: 24px; height: 58px; }
.logo { font-family: var(--mono); font-weight: 600; font-size: 15px; color: var(--ink); text-decoration: none; white-space: nowrap; }
.logo b { color: var(--ember); }
.nav-links { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }
.nav-links a { font-family: var(--mono); font-size: 12.5px; color: var(--muted); text-decoration: none; padding: 6px 10px; border-radius: 8px; white-space: nowrap; }
.nav-links a:hover, .nav-links a:focus-visible { color: var(--ink); background: var(--panel); }
</style>
```

- [ ] **Step 2: Write `src/components/astro/Footer.astro`**

```astro
---
const base = import.meta.env.BASE_URL;
---
<footer>
  <div class="wrap">
    pw<b style="color:var(--ember)">·handbook</b> — production-grade Playwright engineering, level by level.<br />
    <a href={base}>Home</a> · <a href="https://playwright.dev" rel="noopener">Playwright Docs</a> · MIT License
  </div>
</footer>
<style>
footer { padding: 48px 0 80px; color: var(--faint); font-family: var(--mono); font-size: 13px; border-top: 1px solid var(--line); margin-top: 72px; }
footer a { color: var(--muted); }
</style>
```

- [ ] **Step 3: Write `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';
import Nav from '../components/astro/Nav.astro';
import Footer from '../components/astro/Footer.astro';

interface Props { title: string; description?: string; }
const { title, description = 'Production-grade Playwright + TypeScript engineering handbook.' } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title} · Playwright Handbook</title>
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Verify** — `npm run build` passes.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Base.astro src/components/astro/Nav.astro src/components/astro/Footer.astro
git commit -m "feat: add base layout with nav and footer"
```

---

### Task 6: Landing page

**Files:**
- Modify: `src/pages/index.astro` (replace placeholder)

- [ ] **Step 1: Write `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import { levels } from '../data/levels';
import { getCollection } from 'astro:content';

const base = import.meta.env.BASE_URL;
const allTopics = await getCollection('topics', t => t.data.status === 'complete');
const topicCount = (n: number) => allTopics.filter(t => t.data.level === n).length;
const totalHours = levels.reduce((s, l) => s + l.hours, 0);
---
<Base title="Learn production-grade Playwright">
  <header class="hero">
    <div class="wrap">
      <span class="hero-pill"><i></i>15 levels · {totalHours}+ hours · real demo apps</span>
      <h1>Playwright engineering, <em>the production way.</em></h1>
      <p class="lede">
        Not another tutorial. A complete roadmap from testing fundamentals to Staff-QE-level
        framework architecture — every topic practiced on real applications, with failure
        scenarios and interview questions built in.
      </p>
      <a class="cta" href={`${base}levels/0/`}>Start Level 0</a>
      <a class="cta ghost" href={`${base}#levels`}>Browse the roadmap</a>
    </div>
  </header>

  <section id="levels">
    <div class="wrap">
      <div class="eyebrow">the roadmap <span>/ 15 levels</span></div>
      <h2>From fundamentals to leadership</h2>
      <div class="level-grid">
        {levels.map(l => (
          <a class="level-card" href={`${base}levels/${l.num}/`}>
            <span class="lnum">L{String(l.num).padStart(2, '0')}</span>
            <h3>{l.title}</h3>
            <p>{l.description}</p>
            <span class="lmeta">{topicCount(l.num)} topics · ~{l.hours}h</span>
          </a>
        ))}
      </div>
    </div>
  </section>

  <section id="domains">
    <div class="wrap">
      <div class="eyebrow">apply it <span>/ 16 domain projects</span></div>
      <h2>Real domains, real test strategies</h2>
      <p class="lede">E-commerce, banking, healthcare, fintech and 12 more — each with feature
      test matrices and production failure scenarios. Coming as content waves land.</p>
    </div>
  </section>

  <section id="capstones">
    <div class="wrap">
      <div class="eyebrow">prove it <span>/ 5 capstones</span></div>
      <h2>Portfolio-grade capstone frameworks</h2>
      <p class="lede">Five end-to-end frameworks — from a Magento e-commerce suite to an
      AI-powered QE platform. Coming as content waves land.</p>
    </div>
  </section>
</Base>

<style>
.hero { padding: 88px 0 64px; border-bottom: 1px solid var(--line); }
.hero h1 { font-size: clamp(40px, 6vw, 68px); font-weight: 800; line-height: 1.02; letter-spacing: -.02em; margin: 18px 0; max-width: 800px; }
.hero h1 em { font-style: normal; color: var(--ember); }
.hero .lede { font-size: 18px; margin-bottom: 28px; }
.hero-pill { display: inline-flex; gap: 8px; align-items: center; font-family: var(--mono); font-size: 12px; color: var(--muted); border: 1px solid var(--line); border-radius: 99px; padding: 5px 12px; }
.hero-pill i { width: 7px; height: 7px; border-radius: 99px; background: var(--c-green); display: inline-block; }
.cta { display: inline-block; font-family: var(--mono); font-size: 14px; font-weight: 600; color: #0C1018; background: var(--ember); padding: 13px 22px; border-radius: 10px; text-decoration: none; margin-right: 10px; }
.cta:hover { background: var(--ember-soft); }
.cta.ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); }
section { padding: 72px 0; border-bottom: 1px solid var(--line); }
.level-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 28px; }
.level-card { background: var(--panel); border: 1px solid var(--line); border-radius: var(--r); padding: 22px; text-decoration: none; color: var(--ink); display: block; transition: border-color .15s; }
.level-card:hover { border-color: var(--ember); }
.level-card .lnum { font-family: var(--mono); font-size: 12px; color: var(--ember); }
.level-card h3 { margin: 8px 0 6px; font-size: 18px; }
.level-card p { font-size: 13.5px; color: var(--muted); }
.level-card .lmeta { display: block; margin-top: 12px; font-family: var(--mono); font-size: 11.5px; color: var(--faint); }
@media (max-width: 920px) { .level-grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 2: Verify visually** — `npm run dev`, open `http://localhost:4321/playwright-typescript-guide/`. Hero renders, 15 level cards present, theme correct.

- [ ] **Step 3: Verify build** — `npm run build` passes.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add landing page with hero and level roadmap"
```

---

### Task 7: Level hub pages

**Files:**
- Create: `src/pages/levels/[level]/index.astro`

- [ ] **Step 1: Write `src/pages/levels/[level]/index.astro`**

```astro
---
import Base from '../../../layouts/Base.astro';
import { levels, levelByNum } from '../../../data/levels';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  return levels.map(l => ({ params: { level: String(l.num) } }));
}

const base = import.meta.env.BASE_URL;
const num = Number(Astro.params.level);
const meta = levelByNum(num)!;
const topics = (await getCollection('topics', t => t.data.level === num && t.data.status === 'complete'))
  .sort((a, b) => a.data.order - b.data.order);
const topicSlug = (id: string) => id.split('/').pop()!.replace(/\.mdx$/, '');
---
<Base title={`Level ${num} — ${meta.title}`} description={meta.description}>
  <section>
    <div class="wrap">
      <div class="eyebrow">level {String(num).padStart(2, '0')} <span>/ {meta.slug}</span></div>
      <h2>{meta.title}</h2>
      <p class="lede">{meta.description}</p>

      {topics.length === 0 && (
        <div class="tip" style="margin-top:32px"><b>Content in progress.</b> Topics for this level land in an upcoming wave. The roadmap on the home page shows what is coming.</div>
      )}

      <div class="topic-grid">
        {topics.map(t => (
          <a class="topic-card" href={`${base}levels/${num}/${topicSlug(t.id)}/`}>
            <h3>{t.data.title}</h3>
            <p>{t.data.description}</p>
            <span class="tmeta">
              {t.data.duration && <span>{t.data.duration}</span>}
              {t.data.practiceSite && <span>practice: {t.data.practiceSite.name}</span>}
            </span>
          </a>
        ))}
      </div>
    </div>
  </section>
</Base>

<style>
section { padding: 72px 0; }
.topic-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 28px; }
.topic-card { background: var(--panel); border: 1px solid var(--line); border-radius: var(--r); padding: 22px; text-decoration: none; color: var(--ink); transition: border-color .15s; }
.topic-card:hover { border-color: var(--ember); }
.topic-card h3 { margin: 0 0 6px; font-size: 17px; }
.topic-card p { font-size: 13.5px; color: var(--muted); }
.tmeta { display: flex; gap: 14px; margin-top: 12px; font-family: var(--mono); font-size: 11.5px; color: var(--faint); }
@media (max-width: 920px) { .topic-grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 2: Verify** — `npm run dev`; visit `/playwright-typescript-guide/levels/0/` (2 topic cards) and `/playwright-typescript-guide/levels/2/` (1 card — draft excluded) and `/playwright-typescript-guide/levels/5/` (empty-state tip).

- [ ] **Step 3: Verify build** — `npm run build` passes; `dist/levels/0/index.html` … `dist/levels/14/index.html` all exist.

- [ ] **Step 4: Commit**

```bash
git add src/pages/levels
git commit -m "feat: add level hub pages with topic cards and empty states"
```

---

### Task 8: Topic pages (docs layout with sidebar + TOC + prev/next)

**Files:**
- Create: `src/layouts/Topic.astro`
- Create: `src/pages/levels/[level]/[topic].astro`

- [ ] **Step 1: Write `src/layouts/Topic.astro`**

```astro
---
import Base from './Base.astro';
import { levelByNum } from '../data/levels';
import type { MarkdownHeading } from 'astro';

interface SidebarItem { title: string; slug: string; order: number; }
interface NavRef { title: string; href: string; }
interface Props {
  title: string;
  description: string;
  level: number;
  headings: MarkdownHeading[];
  sidebar: SidebarItem[];
  currentSlug: string;
  prev?: NavRef;
  next?: NavRef;
  practiceSite?: { name: string; url: string };
}
const { title, description, level, headings, sidebar, currentSlug, prev, next, practiceSite } = Astro.props;
const base = import.meta.env.BASE_URL;
const meta = levelByNum(level)!;
const h2s = headings.filter(h => h.depth === 2);
---
<Base title={title} description={description}>
  <div class="wrap docs">
    <aside class="sidebar">
      <a class="side-level" href={`${base}levels/${level}/`}>L{String(level).padStart(2, '0')} · {meta.title}</a>
      <nav>
        {sidebar.map(s => (
          <a class:list={['side-link', { on: s.slug === currentSlug }]} href={`${base}levels/${level}/${s.slug}/`}>{s.title}</a>
        ))}
      </nav>
    </aside>

    <article data-pagefind-body>
      <div class="eyebrow">level {String(level).padStart(2, '0')} <span>/ {currentSlug}</span></div>
      <h1>{title}</h1>
      <p class="lede">{description}</p>
      {practiceSite && (
        <p class="practice">practice site: <a href={practiceSite.url} rel="noopener">{practiceSite.name}</a></p>
      )}
      <slot />
      <nav class="pn">
        {prev ? <a class="pn-link" href={prev.href}>← {prev.title}</a> : <span />}
        {next ? <a class="pn-link next" href={next.href}>{next.title} →</a> : <span />}
      </nav>
    </article>

    <aside class="toc">
      {h2s.length > 0 && <><div class="toc-title">On this page</div>
      {h2s.map(h => <a href={`#${h.slug}`}>{h.text}</a>)}</>}
    </aside>
  </div>
</Base>

<style>
.docs { display: grid; grid-template-columns: 220px minmax(0, 1fr) 180px; gap: 40px; padding-top: 48px; }
.sidebar { position: sticky; top: 80px; align-self: start; }
.side-level { display: block; font-family: var(--mono); font-size: 12px; color: var(--ember); text-decoration: none; margin-bottom: 14px; }
.side-link { display: block; font-size: 13.5px; color: var(--muted); text-decoration: none; padding: 5px 10px; border-left: 2px solid var(--line); }
.side-link:hover { color: var(--ink); }
.side-link.on { color: var(--ink); border-left-color: var(--ember); }
article h1 { font-size: clamp(30px, 4vw, 44px); font-weight: 800; margin-bottom: 12px; }
article :global(h2) { font-size: 24px; margin: 40px 0 12px; }
article :global(p) { max-width: 720px; margin-bottom: 12px; }
article :global(pre) { margin: 16px 0; }
article :global(ol), article :global(ul) { padding-left: 24px; margin-bottom: 12px; }
.practice { font-family: var(--mono); font-size: 13px; color: var(--faint); margin-bottom: 8px; }
.toc { position: sticky; top: 80px; align-self: start; font-size: 12.5px; }
.toc-title { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: var(--faint); margin-bottom: 8px; }
.toc a { display: block; color: var(--muted); text-decoration: none; padding: 3px 0; }
.toc a:hover { color: var(--ink); }
.pn { display: flex; justify-content: space-between; margin-top: 56px; border-top: 1px solid var(--line); padding-top: 20px; }
.pn-link { font-family: var(--mono); font-size: 13px; color: var(--c-blue); text-decoration: none; }
@media (max-width: 1020px) { .docs { grid-template-columns: 1fr; } .sidebar, .toc { position: static; } }
</style>
```

- [ ] **Step 2: Write `src/pages/levels/[level]/[topic].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import Topic from '../../../layouts/Topic.astro';

export async function getStaticPaths() {
  const topics = await getCollection('topics', t => t.data.status === 'complete');
  return topics.map(t => ({
    params: {
      level: String(t.data.level),
      topic: t.id.split('/').pop()!.replace(/\.mdx$/, ''),
    },
    props: { entry: t },
  }));
}

const base = import.meta.env.BASE_URL;
const { entry } = Astro.props;
const { Content, headings } = await render(entry);

const siblings = (await getCollection('topics',
  t => t.data.level === entry.data.level && t.data.status === 'complete'))
  .sort((a, b) => a.data.order - b.data.order);

const slugOf = (id: string) => id.split('/').pop()!.replace(/\.mdx$/, '');
const sidebar = siblings.map(s => ({ title: s.data.title, slug: slugOf(s.id), order: s.data.order }));
const idx = siblings.findIndex(s => s.id === entry.id);
const toRef = (s: typeof siblings[number]) =>
  ({ title: s.data.title, href: `${base}levels/${s.data.level}/${slugOf(s.id)}/` });
const prev = idx > 0 ? toRef(siblings[idx - 1]) : undefined;
const next = idx < siblings.length - 1 ? toRef(siblings[idx + 1]) : undefined;
---
<Topic
  title={entry.data.title}
  description={entry.data.description}
  level={entry.data.level}
  headings={headings}
  sidebar={sidebar}
  currentSlug={slugOf(entry.id)}
  prev={prev}
  next={next}
  practiceSite={entry.data.practiceSite}
>
  <Content />
</Topic>
```

- [ ] **Step 3: Verify** — `npm run dev`; visit `/playwright-typescript-guide/levels/0/why-testing-exists/`. Sidebar shows both L0 topics with current highlighted, TOC lists h2s, next link points to Testing Pyramid. Visit `/levels/2/locators/` — code block Shiki-highlighted, practice-site link present, no prev/next siblings beyond itself.

- [ ] **Step 4: Verify build** — `npm run build`; confirm `dist/levels/2/actions/` does NOT exist (draft excluded).

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Topic.astro src/pages/levels
git commit -m "feat: add docs-style topic pages with sidebar, TOC, prev/next"
```

---

### Task 9: CmdTable + Tip static components

**Files:**
- Create: `src/components/astro/CmdTable.astro`
- Create: `src/components/astro/Tip.astro`

- [ ] **Step 1: Write `src/components/astro/CmdTable.astro`**

```astro
---
interface Row { c: string; d: string; }
interface Props { rows: Row[]; }
const { rows } = Astro.props;
---
<div class="cmdtable">
  {rows.map(r => (
    <div class="cmdrow">
      <div class="c">{r.c}</div>
      <div class="d" set:html={r.d} />
    </div>
  ))}
</div>
<style>
.cmdtable { margin: 18px 0; border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; }
.cmdrow { display: grid; grid-template-columns: minmax(220px, 340px) 1fr; border-top: 1px solid var(--line); background: var(--panel); }
.cmdrow:first-child { border-top: 0; }
.cmdrow:nth-child(even) { background: var(--panel2); }
.cmdrow > div { padding: 11px 16px; font-size: 14px; }
.cmdrow .c { font-family: var(--mono); font-size: 13px; color: var(--code-accent); word-break: break-word; }
.cmdrow .d { color: var(--muted); }
@media (max-width: 680px) { .cmdrow { grid-template-columns: 1fr; } .cmdrow .d { padding-top: 0; } }
</style>
```

- [ ] **Step 2: Write `src/components/astro/Tip.astro`**

```astro
---
interface Props { label?: string; }
const { label = 'Key insight:' } = Astro.props;
---
<div class="tip"><b>{label}</b> <slot /></div>
```

- [ ] **Step 3: Use both in `locators.mdx`** — add below the "Locator priority" section:

```mdx
import CmdTable from '../../../components/astro/CmdTable.astro';
import Tip from '../../../components/astro/Tip.astro';

<CmdTable rows={[
  { c: "page.getByRole('button', { name: 'Login' })", d: 'Accessible role + name. First choice.' },
  { c: "page.getByLabel('Username')", d: 'Form fields by their label.' },
  { c: "page.getByText('Welcome back')", d: 'Visible text. Good for non-interactive elements.' },
  { c: "page.getByTestId('cart-badge')", d: 'Stable hook when semantics are unavailable.' },
  { c: "page.locator('.btn-primary')", d: 'CSS. Last resort — couples test to styling.' },
]} />

<Tip>Role-based locators double as accessibility checks — if <code>getByRole</code> cannot find your button, neither can a screen reader.</Tip>
```

(Import lines go directly under the frontmatter block.)

- [ ] **Step 4: Verify** — dev server: `/levels/2/locators/` renders table + tip in theme.

- [ ] **Step 5: Verify build** — `npm run build` passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/astro/CmdTable.astro src/components/astro/Tip.astro src/content/levels/level-02/locators.mdx
git commit -m "feat: add CmdTable and Tip components, use in locators topic"
```

---

### Task 10: CodeTabs component

**Files:**
- Create: `src/components/astro/CodeTabs.astro`

- [ ] **Step 1: Write `src/components/astro/CodeTabs.astro`** — tabbed code via named slots + small inline script:

```astro
---
interface Props { labels: string[]; }
const { labels } = Astro.props;
const uid = Math.random().toString(36).slice(2, 8);
---
<div class="codetabs" data-codetabs={uid}>
  <div class="ct-bar" role="tablist">
    {labels.map((l, i) => (
      <button class:list={['ct-tab', { on: i === 0 }]} role="tab" aria-selected={i === 0 ? 'true' : 'false'} data-tab={i}>{l}</button>
    ))}
  </div>
  {labels.map((_, i) => (
    <div class:list={['ct-panel', { on: i === 0 }]} role="tabpanel" data-panel={i}>
      <slot name={`tab-${i}`} />
    </div>
  ))}
</div>
<script>
  document.querySelectorAll('[data-codetabs]').forEach((root) => {
    root.querySelectorAll<HTMLButtonElement>('.ct-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = btn.dataset.tab;
        root.querySelectorAll('.ct-tab').forEach(b => { b.classList.toggle('on', b === btn); b.setAttribute('aria-selected', String(b === btn)); });
        root.querySelectorAll<HTMLElement>('.ct-panel').forEach(p => p.classList.toggle('on', p.dataset.panel === i));
      });
    });
  });
</script>
<style>
.codetabs { margin: 18px 0; border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; }
.ct-bar { display: flex; gap: 0; background: var(--panel2); border-bottom: 1px solid var(--line); }
.ct-tab { font-family: var(--mono); font-size: 12.5px; color: var(--muted); background: transparent; border: 0; padding: 10px 16px; cursor: pointer; border-bottom: 2px solid transparent; }
.ct-tab.on { color: var(--code-accent); border-bottom-color: var(--ember); }
.ct-panel { display: none; }
.ct-panel.on { display: block; }
.ct-panel :global(pre) { border: 0; border-radius: 0; margin: 0; }
</style>
```

- [ ] **Step 2: Use in `locators.mdx`** — add a section "One flow, three layers":

```mdx
import CodeTabs from '../../../components/astro/CodeTabs.astro';

## One flow, three layers

<CodeTabs labels={['login.spec.ts', 'login.page.ts', 'playwright.config.ts']}>
  <Fragment slot="tab-0">
```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './login.page';

test('standard user can log in', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.signIn('standard_user', 'secret_sauce');
  await expect(page.getByText('Products')).toBeVisible();
});
```
  </Fragment>
  <Fragment slot="tab-1">
```ts
import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}
  async goto() { await this.page.goto('https://www.saucedemo.com'); }
  async signIn(user: string, pass: string) {
    await this.page.getByPlaceholder('Username').fill(user);
    await this.page.getByPlaceholder('Password').fill(pass);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
```
  </Fragment>
  <Fragment slot="tab-2">
```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: { baseURL: 'https://www.saucedemo.com', trace: 'on-first-retry' },
  retries: process.env.CI ? 2 : 0,
});
```
  </Fragment>
</CodeTabs>
```

- [ ] **Step 3: Verify** — dev server: tabs switch, code highlighted, first tab active by default.

- [ ] **Step 4: Verify build** — `npm run build` passes.

- [ ] **Step 5: Commit**

```bash
git add src/components/astro/CodeTabs.astro src/content/levels/level-02/locators.mdx
git commit -m "feat: add CodeTabs component with tabbed code example"
```

---

### Task 11: Search page (Pagefind)

**Files:**
- Create: `src/pages/search.astro`

- [ ] **Step 1: Write `src/pages/search.astro`**

```astro
---
import Base from '../layouts/Base.astro';
const base = import.meta.env.BASE_URL;
---
<Base title="Search">
  <section>
    <div class="wrap">
      <div class="eyebrow">search <span>/ all topics</span></div>
      <h2>Find anything</h2>
      <div id="search" class="searchbox"></div>
    </div>
  </section>
</Base>

<link rel="stylesheet" href={`${base}pagefind/pagefind-ui.css`} />
<script is:inline define:vars={{ base }}>
  const s = document.createElement('script');
  s.src = `${base}pagefind/pagefind-ui.js`;
  s.onload = () => new PagefindUI({ element: '#search', showSubResults: true });
  document.head.appendChild(s);
</script>

<style>
section { padding: 72px 0; min-height: 60vh; }
.searchbox { margin-top: 24px; --pagefind-ui-primary: var(--ember); --pagefind-ui-text: var(--ink); --pagefind-ui-background: var(--panel); --pagefind-ui-border: var(--line); --pagefind-ui-font: var(--body); }
</style>
```

Note: Pagefind assets exist only after `npm run build` — search 404s in dev; that is expected.

- [ ] **Step 2: Verify** — `npm run build && npm run preview`; open `/playwright-typescript-guide/search/`, search "locator" → locators topic returned.

- [ ] **Step 3: Commit**

```bash
git add src/pages/search.astro
git commit -m "feat: add Pagefind search page"
```

---

### Task 12: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify YAML locally** — `npm run check && npm run build` both pass (same commands CI runs).

- [ ] **Step 3: Commit and push**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deploy workflow"
git push
```

- [ ] **Step 4: One-time manual step (tell the user):** repo Settings → Pages → Build and deployment → Source = **GitHub Actions**. Then confirm the workflow run goes green and `https://ashishpatel26.github.io/playwright-typescript-guide/` serves the landing page.

---

### Task 13: Playwright e2e smoke tests

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/smoke.spec.ts`
- Modify: `.github/workflows/deploy.yml` (add e2e step)

- [ ] **Step 1: Install browsers**

```bash
npx playwright install chromium
```

- [ ] **Step 2: Write `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:4321/playwright-typescript-guide' },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321/playwright-typescript-guide/',
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 3: Write failing-first test `e2e/smoke.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('landing page renders hero and roadmap', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('production way');
  await expect(page.locator('.level-card')).toHaveCount(15);
});

test('level hub lists topics', async ({ page }) => {
  await page.goto('/levels/0/');
  await expect(page.getByRole('heading', { name: 'Testing Fundamentals' })).toBeVisible();
  await expect(page.locator('.topic-card')).toHaveCount(2);
});

test('topic page has sidebar, TOC, and next nav', async ({ page }) => {
  await page.goto('/levels/0/why-testing-exists/');
  await expect(page.locator('.side-link.on')).toHaveText('Why Testing Exists');
  await expect(page.locator('.toc a').first()).toBeVisible();
  await page.getByRole('link', { name: /Testing Pyramid →/ }).click();
  await expect(page).toHaveURL(/testing-pyramid/);
});

test('draft topics are not built', async ({ page }) => {
  const res = await page.goto('/levels/2/actions/');
  expect(res!.status()).toBe(404);
});

test('search returns results', async ({ page }) => {
  await page.goto('/search/');
  await page.locator('.pagefind-ui__search-input').fill('locator');
  await expect(page.locator('.pagefind-ui__result').first()).toBeVisible();
});

test('code tabs switch', async ({ page }) => {
  await page.goto('/levels/2/locators/');
  await page.getByRole('tab', { name: 'login.page.ts' }).click();
  await expect(page.locator('.ct-panel.on')).toContainText('class LoginPage');
});
```

- [ ] **Step 4: Run tests** — `npm run build && npm run test:e2e`
Expected: all 6 PASS. (If 404 test fails because preview serves a custom 404 with status 200, assert on page content `Not found` instead.)

- [ ] **Step 5: Add e2e to CI** — in `.github/workflows/deploy.yml` `build` job, after `npm run build` insert:

```yaml
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

- [ ] **Step 6: Commit and push**

```bash
git add playwright.config.ts e2e/ .github/workflows/deploy.yml
git commit -m "test: add e2e smoke suite, run in CI before deploy"
git push
```

- [ ] **Step 7: Confirm CI green** — `rtk gh run list` shows latest workflow succeeded; site live.

---

### Task 14: README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Rewrite `README.md`**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for site development workflow"
git push
```

---

## Done criteria

- `https://ashishpatel26.github.io/playwright-typescript-guide/` serves landing page with 15 level cards
- Hubs for all levels; topic pages render with sidebar/TOC/prev-next; drafts excluded
- Search works on built site
- CI: check → build → e2e → deploy, all green
- Next plans: Plan B (React widgets), then content waves
