# Playwright Handbook — Website Design Spec

**Date:** 2026-06-10
**Status:** Approved design, pending implementation plan
**Source outline:** [OUTLINE.md](../../../OUTLINE.md)

## Goal

A production-grade learning website covering the full Playwright Engineering Handbook outline — 15 levels, 16 domain projects, 5 capstones — hosted on GitHub Pages. A learner who completes it should be able to design, build, maintain, debug, scale, and lead Playwright automation in production environments.

## Decisions (locked)

| Decision | Choice |
|---|---|
| Stack | Astro 4 + React 18 islands + MUI v6, static export |
| Layout model | Hybrid: VisualGit-style landing → level hub pages → docs-style topic pages |
| Interactivity | Polished static code blocks + teaching widgets + Monaco editors (real TS execution, real locator matching, honestly-simulated PW runner) |
| Theme | Midnight Ember — navy `#0C1018`, ember `#F05133`, palette from visualgit.html inspiration |
| Scope | Everything full depth, built in 7 deployable waves |
| Name | Playwright Handbook (`pw·handbook` logo mark) |
| Search | Pagefind (static, post-build index) |
| Deploy | This repo's GitHub Pages via GitHub Actions, base `/playwright-typescript-guide` |

## Architecture

### Stack & build

```
Astro 4 (static output)
├── React 18 islands        ← interactive widgets only
├── MUI v6 (dark theme)     ← themed to Midnight Ember tokens
├── MDX                     ← all topic content
├── Monaco Editor (lazy)    ← TS playground, PW editor
├── Shiki                   ← build-time syntax highlighting (zero JS static code)
├── Mermaid (build-time SVG)← architecture diagrams
└── Pagefind                ← post-build static search index
```

### Repo structure

```
playwright-typescript-guide/
├── astro.config.mjs            # site, base path, MDX, React integrations
├── src/
│   ├── theme/tokens.ts         # Midnight Ember palette, single source of truth
│   ├── layouts/
│   │   ├── Base.astro          # html shell, nav, footer, Pagefind
│   │   ├── Landing.astro       # hero layout
│   │   ├── LevelHub.astro      # level overview w/ topic cards
│   │   └── Topic.astro         # sidebar + content + TOC (docs page)
│   ├── components/
│   │   ├── astro/              # static: Nav, Footer, TopicCard, CmdTable, Tip…
│   │   └── react/              # islands: TsPlayground, LocatorLab, PwRunner,
│   │                           #   ConceptDiagram, QuizCard
│   ├── content/                # Astro content collections
│   │   ├── config.ts           # zod schemas: topic, domain, capstone
│   │   ├── levels/             # level-00/ … level-14/  *.mdx topics
│   │   ├── domains/            # 16 domain project pages
│   │   └── capstones/          # 5 capstone pages
│   └── pages/
│       ├── index.astro         # landing
│       ├── levels/[level]/     # hub + [topic] dynamic routes
│       ├── domains/[domain].astro
│       └── capstones/[slug].astro
├── public/practice-pages/      # self-hosted mock HTML pages widgets target
└── .github/workflows/deploy.yml
```

### Key architectural decisions

1. **Content collections + zod schema** — every topic MDX carries frontmatter; routes, sidebars, hubs, prev/next nav all generated from it. Adding a file updates everything.
2. **Islands discipline** — static pages ship ~0 JS. Monaco lazy-loads via `client:visible` only on pages that declare it. Keeps ~157 pages fast.
3. **Self-hosted practice pages** — small mock pages (login form, table, iframe page, shadow-DOM page, upload form) in `public/practice-pages/` so widgets work offline and never break when external demo sites change. External sites remain linked for real practice.
4. **Per-topic MDX template** enforces outline deliverables: Concept → Code → Widget → Practice-site task → Failure scenarios → Interview questions.

## Interactive Widgets (7 components — 5 React islands + 2 static Astro)

React islands lazy-load, themed via MUI tokens, wrapped in error boundaries. CmdTable and CodeTabs are static Astro components.

1. **`TsPlayground`** (L1) — Monaco + Run. TypeScript compiled in-browser (TS compiler API in web worker), executed in sandboxed iframe, `console.*` captured to output panel. Real execution. Exercises pass starter code + optional output assertions.
2. **`LocatorLab`** (L2–3) — split view: mock page iframe left, locator input right. Supports `getByRole/getByText/getByLabel/getByTestId`, CSS, XPath. Real DOM queries + ARIA role resolution. Live highlight + count badge with strict-mode warnings.
3. **`PwRunner`** (L2–5) — simulated test runner, VisualGit-terminal style. Editable Monaco test code; Run animates steps against visible mock page (pointer moves, fills, assertion ticks). Pre-scripted step engine per exercise, explicitly labeled "simulation". Includes deliberate-failure exercises (learner fixes locator/wait). API mode for L5: request/response panels instead of mock page.
4. **`ConceptDiagram`** — data-driven interactive SVGs in VisualGit style: testing pyramid, test→context→browser hierarchy, retry/wait timelines, CI pipeline flows.
5. **`CmdTable`** (Astro, static, zero JS) — VisualGit-style command/API reference tables.
6. **`QuizCard`** — interview Q&A, click-to-reveal answer + senior-answer rubric, localStorage progress.
7. **`CodeTabs`** (Astro + minimal JS) — tabbed code blocks (`test.ts` / `page-object.ts` / `playwright.config.ts` / CI yaml), Shiki-highlighted at build time.

**Widget→level map:** L0 diagrams+quiz · L1 TsPlayground · L2–3 LocatorLab+PwRunner · L4 diagrams+CodeTabs · L5 PwRunner(API mode) · L6–12 CodeTabs+diagrams+quiz · L13 diagrams · L14 QuizCard-heavy · domains/capstones CodeTabs+diagrams.

## Content Model

### Zod schemas (`src/content/config.ts`)

```ts
// topics collection (levels/level-NN/*.mdx)
{
  title: string,
  level: number,          // 0–14
  order: number,          // position within level
  description: string,    // card + meta description
  practiceSite?: { name: string, url: string },
  widgets?: ('ts-playground'|'locator-lab'|'pw-runner'|'diagram'|'quiz')[],
  duration?: string,      // "25 min"
  status: 'complete'|'draft'   // drafts excluded from build
}

// domains: title, demoSite, features[], failureScenarios[]
// capstones: title, stack[], deliverables[]
```

### Topic page anatomy (template-enforced)

```
eyebrow: level NN / topic-slug
H1 + lede
1. Concept          — explanation, ConceptDiagram if applicable
2. Code             — CodeTabs with real TS, copy buttons
3. Try it           — interactive widget
4. Real practice    — task list against external site
5. Production notes — failure scenarios, flakiness traps, debugging
6. Interview        — QuizCard, 3–6 questions
prev/next footer nav (auto-generated from order)
```

Sections 1–2 always present; 3–6 where the outline specifies (L0 theory topics skip widgets; L14 is mostly section 6).

### Page templates

- **Landing:** VisualGit-style hero with animated SVG (test-run graph), level roadmap as 15 cards (number, title, topic count, est. hours), domain projects strip, capstones strip.
- **Level hub:** eyebrow `level NN`, intro lede, topic card grid (title, description, duration, widget badges), practice-sites table.
- **Domain page:** demo-site link, feature test matrix, suggested framework structure, failure-scenarios accordion, full example spec files.
- **Capstone page:** Mermaid architecture diagram, stack, milestone checklist, repo-structure tree, acceptance criteria.

### Page count

~120 topic pages (L0–14) + 16 domains + 5 capstones + 15 hubs + 1 landing ≈ **157 pages**.

## Build, Deploy, CI

### Pipeline (`.github/workflows/deploy.yml`)

```
push to main
  → astro build (base: /playwright-typescript-guide)
  → pagefind --site dist
  → upload-pages-artifact → deploy-pages
```

URL: `https://ashishpatel26.github.io/playwright-typescript-guide/`.
One-time manual step: repo Settings → Pages → Source = GitHub Actions.

### Quality gates

- `astro check` — type-checks frontmatter against zod schemas
- Link checker over `dist/` — build fails on broken internal links
- Playwright e2e smoke suite (nav, search, one widget per type renders and responds) runs in CI before deploy

### Error handling

- Widgets in error boundaries: crash → fallback static code block, page stays readable
- Monaco load failure → plain `<pre>` + copy button
- External practice sites listed with "last verified" date

## Content Waves (each wave = deployable site)

| Wave | Delivers |
|---|---|
| 1 | Shell: theme, layouts, all 7 widgets, landing, CI/CD live |
| 2 | L0–L2 full (testing fundamentals, TypeScript, PW basics) — site usable |
| 3 | L3–L5 (advanced PW, framework design, API testing) |
| 4 | L6–L9 (DB, CI/CD, Docker, cloud) |
| 5 | L10–L14 (perf, security, observability, AI, interview prep) |
| 6 | 16 domain project pages |
| 7 | 5 capstones + landing polish + cross-links |

`status: draft` frontmatter keeps unwritten pages out of build and nav — no dead links at any wave.

## Constraints & Honest Limitations

- Real Playwright cannot execute in a browser (needs Node + real browser binaries). `PwRunner` is a labeled simulation; `TsPlayground` and `LocatorLab` are genuinely real.
- External demo sites (SauceDemo, Magento, Parabank, etc.) may change/break — mitigated by self-hosted mock pages for widgets and "last verified" dates on external links.
- GitHub Pages serves static only — no server-side anything; all interactivity is client-side.
