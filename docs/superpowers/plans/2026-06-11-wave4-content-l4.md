# Wave 4 — L4 Production Framework Design Content Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fill Level 4 (Production Framework Design) with 6 complete topic pages: architecture layers, POM, Screenplay/Fluent, design patterns, SOLID, clean code.

**Architecture:** Pure content wave. Each task creates one MDX file in `src/content/levels/level-04/` (new directory). Design source: `docs/superpowers/specs/2026-06-11-levels-3-14-content-design.md`. First use of MermaidDiagram widget.

**Tech Stack:** Astro 5 MDX, React islands (MermaidDiagram, TsPlayground, QuizCard), Astro components (CmdTable, Tip, CodeTabs).

---

## Component API reference

```mdx
import CmdTable from '../../../components/astro/CmdTable.astro';
import Tip from '../../../components/astro/Tip.astro';
import CodeTabs from '../../../components/astro/CodeTabs.astro';
import MermaidDiagram from '../../../components/react/MermaidDiagram';
import TsPlayground from '../../../components/react/TsPlayground';
import QuizCard from '../../../components/react/QuizCard';
```

- MermaidDiagram: `<MermaidDiagram client:only="react" chart={`flowchart TB\n  A --> B`} />` — `chart` is a template-literal string prop. Dark theme pre-configured.
- TsPlayground: `client:only="react"`, `label`, `height`, `starter` (template literal; NO imports — pure TS only; escape backticks as \`; IIFE for async).
- QuizCard: `storageKey` unique site-wide, `questions: [{ q, a, senior }]`.

**New files (all in `src/content/levels/level-04/`):**
- `architecture-layers.mdx` (order 1)
- `page-object-model.mdx` (order 2)
- `screenplay-and-fluent.mdx` (order 3)
- `design-patterns.mdx` (order 4)
- `solid-principles.mdx` (order 5)
- `clean-code.mdx` (order 6)

**Modified:** `e2e/widgets.spec.ts` — add 2 smoke tests.

Per task: create file → `npm run build` (verify `dist/levels/4/<slug>/index.html`) → `rtk git add` + `rtk git commit`.

---

## Tasks

### Task 1: architecture-layers.mdx

- [ ] Create file, build, commit `"content: add L4 Architecture & Layers topic"`:

```mdx
---
title: Folder Structure & Layered Architecture
level: 4
order: 1
description: How production Playwright frameworks are organised — the layers, what belongs in each, and the dependency rule that keeps 5,000 tests maintainable.
duration: 30 min
status: complete
widgets: ['diagram', 'quiz']
---

import MermaidDiagram from '../../../components/react/MermaidDiagram';
import Tip from '../../../components/astro/Tip.astro';
import QuizCard from '../../../components/react/QuizCard';

## The layers

A production framework separates concerns into layers. Tests express
business intent; everything mechanical lives below them.

<MermaidDiagram client:only="react" chart={`flowchart TB
  T["Test Layer<br/>specs: business intent only"] --> B["Business Layer<br/>flows, page objects, API clients"]
  B --> C["Core Layer<br/>fixtures, base classes, helpers"]
  C --> F["Foundation<br/>config, test data, environment"]
  style T stroke:#F05133
  style B stroke:#6BB5FF
  style C stroke:#FFB454
  style F stroke:#7EE787
`} />

**The dependency rule:** each layer depends only on layers below it. A test
imports a page object; a page object never imports a test. Break this rule
and changes ripple upward unpredictably.

## A production folder structure

```
playwright-framework/
├── tests/                      # Test layer — specs only
│   ├── auth/
│   │   └── login.spec.ts
│   ├── checkout/
│   │   └── checkout.spec.ts
│   └── api/
│       └── orders.api.spec.ts
├── src/
│   ├── pages/                  # Business layer — page objects
│   │   ├── login.page.ts
│   │   └── checkout.page.ts
│   ├── flows/                  # Business layer — multi-page journeys
│   │   └── purchase.flow.ts
│   ├── api/                    # Business layer — API clients
│   │   └── orders.client.ts
│   ├── fixtures/               # Core layer — DI wiring
│   │   └── test-fixtures.ts
│   └── utils/                  # Core layer — pure helpers
│       └── date.utils.ts
├── test-data/                  # Foundation — builders + static data
│   └── users.builder.ts
├── playwright/.auth/           # Foundation — session state (gitignored)
├── playwright.config.ts
└── package.json
```

## What belongs where

| Layer | Contains | Never contains |
|---|---|---|
| Tests | `test()` blocks, assertions, business language | locators, URLs, waits |
| Flows | multi-page journeys (`purchaseFlow(page, item)`) | assertions about specific tests |
| Pages | locators, page actions, navigation | `expect()` on business outcomes, test data |
| Fixtures | object construction, setup/teardown, DI | business logic |
| Utils | pure functions (dates, strings, random) | anything Playwright-specific |

The most contested rule: **assertions live in tests, not page objects.** A
page object that asserts couples every test to one expected outcome. Return
state; let the test decide what it means.

```ts
// ❌ Page object asserting — every caller now expects success
async signIn(user: string, pass: string) {
  // ...fill and click...
  await expect(this.page.getByText('Products')).toBeVisible();
}

// ✅ Page object returns, test asserts
async signIn(user: string, pass: string): Promise<void> {
  await this.page.getByPlaceholder('Username').fill(user);
  await this.page.getByPlaceholder('Password').fill(pass);
  await this.page.getByRole('button', { name: 'Login' }).click();
}

// In the test — intent is explicit, failure tests can reuse signIn
await loginPage.signIn('locked_out_user', 'secret_sauce');
await expect(page.getByText('locked out')).toBeVisible();
```

<Tip>One pragmatic exception: a page object may assert it has loaded (its own readiness), because that's a fact about the page, not a test outcome.</Tip>

## Naming conventions

```
login.page.ts        → LoginPage class
purchase.flow.ts     → purchaseFlow function or PurchaseFlow class
orders.client.ts     → OrdersClient class
login.spec.ts        → test file
users.builder.ts     → buildUser() factory
```

Suffixes make the layer visible in every import statement — a reviewer can
spot a layering violation (`import ... from '../tests/...'` inside a page
object) without opening the file.

## Scaling signals

When these appear, the structure needs work:

- A locator change touches ten test files → locators leaked above the page layer.
- Two teams editing the same page object constantly conflict → split it into component objects.
- `utils/` is 40 files → it became a junk drawer; promote cohesive clusters into named modules.
- Test names don't match folder names → reorganise by user journey, not by page.

## Interview questions

<QuizCard client:only="react" storageKey="fw-arch" questions={[
  {
    q: "Describe the layers of a production test framework and the dependency rule between them.",
    a: "Test layer (specs expressing business intent), business layer (page objects, flows, API clients), core layer (fixtures, base classes, utilities), foundation (config, test data, environment). The dependency rule: layers depend only downward. Tests import page objects; page objects never import tests or fixtures.",
    senior: "The rule's payoff is change isolation: a UI redesign touches the pages layer only; a new environment touches foundation only. When estimating maintenance cost of a proposed framework, I look at one thing first: what's the blast radius of a locator change? If the answer is more than one file, the layering has already failed."
  },
  {
    q: "Should page objects contain assertions? Defend your position.",
    a: "No — assertions belong in tests. A page object that asserts success couples every caller to one expected outcome, making negative tests impossible without duplicating the method. Page objects perform actions and expose state; tests decide what that state means. Exception: a page may assert its own readiness (loaded state).",
    senior: "This question reveals whether a candidate has maintained a framework long-term. Assertion-in-page-object feels DRY at first — 'every login should verify success' — until the first locked-account test, then you get signInExpectingError(), then signInMaybeError(), and the API rots. Separating action from judgment keeps both composable."
  },
  {
    q: "How would you organise tests: by page, by feature, or by user journey?",
    a: "By feature or journey, not by page. Folders like tests/checkout/, tests/auth/ map to how the business thinks and how failures get triaged. Page-based organisation (tests/login-page/) couples test structure to UI structure, which churns. The pages live in src/pages/ — already organised by page there.",
    senior: "Journey organisation also enables risk-based CI: run tests/checkout/ on every PR touching payment code, full suite nightly. With page-based structure there's no mapping from code change to affected tests. Tagging (@critical, @smoke) layers on top, but folder structure is the primary selection mechanism teams actually use."
  },
]} />
```

### Task 2: page-object-model.mdx

- [ ] Create file, build, commit `"content: add L4 Page Object Model topic"`:

```mdx
---
title: Page Object Model
level: 4
order: 2
description: POM done properly — locators as fields, component objects for shared UI, fixture injection, and the navigation-returns-page pattern.
duration: 40 min
status: complete
widgets: ['ts-playground', 'quiz']
---

import CodeTabs from '../../../components/astro/CodeTabs.astro';
import Tip from '../../../components/astro/Tip.astro';
import TsPlayground from '../../../components/react/TsPlayground';
import QuizCard from '../../../components/react/QuizCard';

## The contract

A page object encapsulates one page (or screen) behind an API that speaks
user language. Tests call `inventory.addToCart('Backpack')`, never
`page.locator('#add-to-cart-sauce-labs-backpack').click()`.

## Locators as readonly fields

Declare locators once in the constructor — not inline in methods. Playwright
locators are lazy, so this costs nothing and gives every method the same
single source of truth.

```ts
import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.getByPlaceholder('Search products');
    this.sortDropdown = page.getByRole('combobox', { name: 'Sort' });
    this.cartBadge = page.getByTestId('cart-badge');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async addToCart(productName: string): Promise<void> {
    await this.page
      .getByRole('listitem')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async cartCount(): Promise<number> {
    if (await this.cartBadge.isHidden()) return 0;
    return Number(await this.cartBadge.innerText());
  }
}
```

## Navigation returns the next page

When an action navigates, return the destination page object. The framework
documents its own page flow, and tests chain naturally:

```ts
export class LoginPage {
  // ...
  async signInExpectingSuccess(user: string, pass: string): Promise<InventoryPage> {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
    return new InventoryPage(this.page);
  }
}

// Test reads as a journey
const inventory = await loginPage.signInExpectingSuccess('standard_user', 'secret_sauce');
await inventory.addToCart('Sauce Labs Backpack');
```

## Component objects for shared UI

A header, cart drawer, or data grid that appears on many pages gets its own
object, composed into pages that contain it:

```ts
export class HeaderComponent {
  readonly cartLink: Locator;
  readonly menuButton: Locator;

  constructor(private root: Locator) {
    this.cartLink = root.getByRole('link', { name: 'Cart' });
    this.menuButton = root.getByRole('button', { name: 'Menu' });
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}

export class InventoryPage {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    // Scope the component to its container — not the whole page
    this.header = new HeaderComponent(page.getByRole('banner'));
  }
}

// Test: inventory.header.openCart()
```

Scoping the component to a root `Locator` (not the `Page`) means it works
even when two instances exist on one page.

## Fixture injection: no `new` in tests

<CodeTabs labels={['test-fixtures.ts', 'checkout.spec.ts']}>
  <Fragment slot="tab-0">

```ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CheckoutPage } from '../pages/checkout.page';

type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
});

export { expect } from '@playwright/test';
```

  </Fragment>
  <Fragment slot="tab-1">

```ts
import { test, expect } from '../fixtures/test-fixtures';

// Pages arrive ready-made — zero construction noise
test('checkout totals include tax', async ({ inventoryPage, checkoutPage, page }) => {
  await inventoryPage.goto();
  await inventoryPage.addToCart('Sauce Labs Backpack');
  await checkoutPage.startCheckout();

  await expect(page.getByTestId('tax')).toContainText('$2.40');
});
```

  </Fragment>
</CodeTabs>

<Tip>Fixtures are Playwright's dependency injection. Tests declare what they need in the callback signature; the framework constructs and tears down. No <code>new</code>, no manual cleanup, no forgotten teardown.</Tip>

## Try it: a page object in pure TypeScript

<TsPlayground
  client:only="react"
  label="POM structure — Playground"
  height={400}
  starter={`// Page Object pattern with a mock Page (pure TS, no Playwright needed)
interface MockPage {
  fill(selector: string, value: string): void;
  click(selector: string): void;
  textOf(selector: string): string;
}

function createMockPage(): MockPage {
  const state: Record<string, string> = {};
  return {
    fill: (sel, value) => { state[sel] = value; },
    click: (sel) => {
      if (sel === '#login' && state['#user'] === 'standard_user') {
        state['#banner'] = 'Products';
      } else if (sel === '#login') {
        state['#banner'] = 'Invalid credentials';
      }
    },
    textOf: (sel) => state[sel] ?? '',
  };
}

// The page object: locators in one place, methods speak user language
class LoginPage {
  private readonly user = '#user';
  private readonly pass = '#pass';
  private readonly loginBtn = '#login';
  private readonly banner = '#banner';

  constructor(private page: MockPage) {}

  signIn(username: string, password: string): void {
    this.page.fill(this.user, username);
    this.page.fill(this.pass, password);
    this.page.click(this.loginBtn);
  }

  bannerText(): string {
    return this.page.textOf(this.banner);
  }
}

const login = new LoginPage(createMockPage());
login.signIn('standard_user', 'secret_sauce');
console.log('Success path:', login.bannerText());

const login2 = new LoginPage(createMockPage());
login2.signIn('wrong_user', 'nope');
console.log('Failure path:', login2.bannerText());
`}
/>

## Interview questions

<QuizCard client:only="react" storageKey="fw-pom" questions={[
  {
    q: "What problems does the Page Object Model solve?",
    a: "Duplication and fragility. Without POM, locators repeat across tests, and one UI change breaks dozens of files. POM centralises each page's locators and interactions in one class — a locator changes in exactly one place. It also raises test readability: tests speak user language (addToCart) instead of DOM language (click #btn-3).",
    senior: "POM's real value is a maintenance contract: UI churn cost becomes O(pages changed), not O(tests affected). Its failure mode is god objects — a 800-line page object for a complex screen. The fix is composition: component objects for header/grid/dialog, scoped to a root Locator so they're reusable and parallel-instance safe."
  },
  {
    q: "Why declare locators as constructor fields instead of inline in methods?",
    a: "Single source of truth per element — two methods touching the same button share one locator definition. Playwright locators are lazy (they resolve at action time), so declaring upfront has no performance cost. It also makes the page's surface area auditable: open the constructor and see every element the page touches.",
    senior: "The lazy-locator point is the one candidates miss: this pattern would be wrong in Selenium, where findElement executes eagerly and goes stale. In Playwright a Locator is a query description, not a DOM handle, so constructor declaration is free. This distinction also explains why Playwright POMs don't need @FindBy-style annotations or PageFactory."
  },
  {
    q: "How do fixtures change how page objects are used in tests?",
    a: "Fixtures construct page objects and inject them via the test callback — tests declare { inventoryPage, checkoutPage } and receive ready instances. This removes construction boilerplate, guarantees consistent setup, and centralises teardown. Tests never call new, so refactoring constructors touches one fixture file.",
    senior: "Fixtures also compose: an authenticatedInventoryPage fixture can depend on a session fixture which depends on storageState. That dependency graph replaces the base-class inheritance trees that plague Java frameworks. Composition over inheritance, enforced by the test runner itself — it's the strongest architectural feature Playwright has."
  },
]} />
```

### Task 3: screenplay-and-fluent.mdx

- [ ] Create file, build, commit `"content: add L4 Screenplay & Fluent topic"`:

```mdx
---
title: Screenplay & Fluent Patterns
level: 4
order: 3
description: Beyond POM — the Screenplay pattern's actors, tasks, and questions, plus fluent chaining. When each pattern earns its complexity.
duration: 35 min
status: complete
widgets: ['quiz']
---

import CmdTable from '../../../components/astro/CmdTable.astro';
import Tip from '../../../components/astro/Tip.astro';
import QuizCard from '../../../components/react/QuizCard';

## Screenplay: the cast

Screenplay reorganises automation around **actors** who perform **tasks**
composed of **interactions**, and ask **questions** about state.

```
Actor      — who: a user with abilities (browse the web, call APIs)
Ability    — what they can use: BrowseTheWeb(page), CallAnApi(request)
Task       — business action: Login.withCredentials(user, pass)
Interaction — atomic step: Click.on(loginButton), Enter.text(...)
Question   — state query: TheCartTotal.value(), IsVisible.of(banner)
```

```ts
// Screenplay-style test — reads as a narrative
const james = Actor.named('James').whoCan(BrowseTheWeb.using(page));

await james.attemptsTo(
  Login.withCredentials('standard_user', 'secret_sauce'),
  AddToCart.theProduct('Sauce Labs Backpack'),
);

await james.asks(TheCartCount.value()).then(count => expect(count).toBe(1));
```

```ts
// A Task composes Interactions — and other Tasks
export const Login = {
  withCredentials: (user: string, pass: string): Task => ({
    async performAs(actor: Actor): Promise<void> {
      const page = BrowseTheWeb.as(actor).page;
      await page.getByPlaceholder('Username').fill(user);
      await page.getByPlaceholder('Password').fill(pass);
      await page.getByRole('button', { name: 'Login' }).click();
    },
  }),
};
```

## What Screenplay buys you

- **Multi-actor scenarios are first-class.** Two actors with different
  abilities (one browses, one calls APIs) model real workflows naturally.
- **Tasks compose.** `CompletePurchase` = `Login` + `AddToCart` + `Checkout`
  — reuse without inheritance.
- **Single Responsibility everywhere.** Each task is one small class/object;
  no god page objects.

## What it costs

- Indirection: five concepts before the first test runs.
- Team onboarding: every new hire learns the pattern, not just Playwright.
- Ecosystem mismatch: Playwright's fixtures, auto-wait, and locators already
  solve many problems Screenplay was invented for (in Selenium-era Java).

<Tip>Honest guidance: most Playwright teams should run well-factored POM with fixtures and flow functions. Reach for Screenplay when you have multi-actor workflows, BDD reporting requirements, or an organisation already fluent in it (Serenity/JS shops).</Tip>

## Fluent pattern: chainable APIs

Fluent design makes each method return an object to continue from — `this`
for same-page actions, the next page object for navigation:

```ts
export class CheckoutPage {
  async fillFirstName(name: string): Promise<this> {
    await this.firstNameInput.fill(name);
    return this;
  }

  async fillLastName(name: string): Promise<this> {
    await this.lastNameInput.fill(name);
    return this;
  }

  async fillPostcode(code: string): Promise<this> {
    await this.postcodeInput.fill(code);
    return this;
  }

  async continueToOverview(): Promise<OverviewPage> {
    await this.continueButton.click();
    return new OverviewPage(this.page);
  }
}
```

```ts
// Await once at the end of each chain segment
const overview = await (await (await checkout
  .fillFirstName('Ada'))
  .fillLastName('Lovelace'))
  .continueToOverview();
```

The nested awaits are the honest downside of async fluent chains in
TypeScript. Two cleaner alternatives:

```ts
// Alternative 1: a single method taking a data object (usually best)
await checkout.fillShippingInfo({ firstName: 'Ada', lastName: 'Lovelace', postcode: 'SW1' });

// Alternative 2: collect steps, execute once
await checkout
  .with({ firstName: 'Ada', lastName: 'Lovelace' })
  .submit();
```

## Pattern selection

<CmdTable rows={[
  { c: 'Well-factored POM + fixtures', d: 'Default for Playwright teams — lowest concept count' },
  { c: 'Flow functions over POM', d: 'Multi-page journeys (purchaseFlow) — add when journeys repeat' },
  { c: 'Component objects', d: 'Shared UI (header, grid, modal) — add when pages share parts' },
  { c: 'Fluent chaining', d: 'Long form-filling sequences — prefer data-object methods first' },
  { c: 'Screenplay', d: 'Multi-actor workflows, BDD orgs, Serenity/JS ecosystems' },
]} />

## Interview questions

<QuizCard client:only="react" storageKey="fw-screenplay" questions={[
  {
    q: "Explain the Screenplay pattern's core concepts.",
    a: "Actors perform Tasks and ask Questions. Actors have Abilities (BrowseTheWeb, CallAnApi) that grant access to tools. Tasks compose Interactions (atomic steps like Click, Enter) and other Tasks into business actions. Questions read state for assertions. Tests become narratives: actor.attemptsTo(Login.withCredentials(...)).",
    senior: "Screenplay is SOLID applied to test design — each Task is a single-responsibility unit, composition replaces inheritance, and abilities are injected dependencies. The honest assessment: it predates Playwright's fixture system, which delivers much of the same decoupling with native tooling. I'd adopt it for multi-actor domains (marketplaces, approval chains) and skip it elsewhere."
  },
  {
    q: "When would you choose Screenplay over POM, and vice versa?",
    a: "Screenplay: multi-actor scenarios, heavy task reuse across journeys, BDD-style living documentation, or teams already invested in Serenity/JS. POM: everything else — it has fewer concepts, maps directly to Playwright's API, and new team members are productive in days instead of weeks.",
    senior: "The decision is organisational more than technical. Screenplay's per-task granularity shines in large orgs where dozens of engineers share a framework and need enforced boundaries. In a 5-person team it's ceremony. I ask: who maintains this in two years, and what's the cheapest pattern they can operate correctly? Usually that answer is POM plus flow functions."
  },
  {
    q: "What's the drawback of fluent (chainable) page object methods in async TypeScript?",
    a: "Every method returns a Promise, so chains need an await per link — await (await (await x.a()).b()).c() — which destroys the readability the pattern promises. Workarounds: methods that take a data object (fillShippingInfo({...})), or a builder that collects steps and executes them in one awaited call.",
    senior: "This is a case where a pattern that's elegant in synchronous Java becomes awkward in async TypeScript — a good probe of whether a candidate adapts patterns to the language or cargo-cults them. The data-object method is also more refactor-stable: adding a field changes one interface, not a chain signature used in fifty tests."
  },
]} />
```

### Task 4: design-patterns.mdx

- [ ] Create file, build, commit `"content: add L4 Design Patterns topic"`:

```mdx
---
title: Design Patterns for Test Frameworks
level: 4
order: 4
description: Singleton, Factory, Builder, Strategy, and Dependency Injection — applied to the problems test frameworks actually have.
duration: 45 min
status: complete
widgets: ['ts-playground', 'quiz']
---

import Tip from '../../../components/astro/Tip.astro';
import TsPlayground from '../../../components/react/TsPlayground';
import QuizCard from '../../../components/react/QuizCard';

## Builder — test data without noise

The most used pattern in test frameworks. Defaults plus targeted overrides:

```ts
interface User {
  username: string;
  email: string;
  role: 'admin' | 'customer';
  balance: number;
}

export function buildUser(overrides: Partial<User> = {}): User {
  return {
    username: 'standard_user',
    email: 'user@test.example',
    role: 'customer',
    balance: 100,
    ...overrides,
  };
}

// Each test states ONLY what matters to it
const broke = buildUser({ balance: 0 });
const admin = buildUser({ role: 'admin' });
```

For multi-step construction, a class builder:

```ts
export class OrderBuilder {
  private items: { sku: string; qty: number }[] = [];
  private coupon?: string;

  withItem(sku: string, qty = 1): this {
    this.items.push({ sku, qty });
    return this;
  }

  withCoupon(code: string): this {
    this.coupon = code;
    return this;
  }

  build(): Order {
    return { items: this.items, coupon: this.coupon, createdAt: new Date() };
  }
}

const order = new OrderBuilder().withItem('BACKPACK').withCoupon('SAVE10').build();
```

## Factory — create by name

When tests need "a page object for X" or "a client for environment Y"
decided at runtime:

```ts
type Env = 'local' | 'staging' | 'production';

export function createApiClient(env: Env): ApiClient {
  const baseURLs: Record<Env, string> = {
    local: 'http://localhost:3000',
    staging: 'https://staging.api.example.com',
    production: 'https://api.example.com',
  };
  return new ApiClient(baseURLs[env], { retries: env === 'local' ? 0 : 2 });
}
```

## Strategy — swap behaviour, keep the flow

One checkout flow, several payment methods. The flow stays identical; the
payment step is a pluggable strategy:

```ts
interface PaymentStrategy {
  pay(page: Page, amount: number): Promise<void>;
}

const cardPayment: PaymentStrategy = {
  async pay(page, amount) {
    await page.getByLabel('Card number').fill('4111111111111111');
    await page.getByRole('button', { name: 'Pay' }).click();
  },
};

const paypalPayment: PaymentStrategy = {
  async pay(page, amount) {
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('button', { name: 'PayPal' }).click(),
    ]);
    // ...handle PayPal popup...
  },
};

async function checkoutWith(strategy: PaymentStrategy, page: Page) {
  // identical flow before and after — only payment varies
  await strategy.pay(page, 42.99);
}
```

## Dependency Injection — fixtures ARE your DI container

Playwright's `test.extend` is a typed DI container with lifecycle management:

```ts
type Services = {
  apiClient: ApiClient;
  testUser: User;
};

export const test = base.extend<Services>({
  apiClient: async ({}, use) => {
    const client = createApiClient(process.env.TEST_ENV as Env ?? 'staging');
    await use(client);
    await client.dispose();              // teardown after the test
  },
  testUser: async ({ apiClient }, use) => {   // depends on apiClient
    const user = await apiClient.createUser(buildUser());
    await use(user);
    await apiClient.deleteUser(user.username); // cleanup guaranteed
  },
});
```

Declaration order doesn't matter; the dependency graph does. Playwright
resolves `testUser → apiClient` automatically and tears down in reverse.

## Singleton — the pattern to avoid

```ts
// ❌ Classic singleton config — hidden global state
export class Config {
  private static instance: Config;
  static get(): Config {
    if (!Config.instance) Config.instance = new Config();
    return Config.instance;
  }
}
```

Singletons and parallel workers don't mix: each worker is a separate process,
so the "single" instance silently becomes N instances — fine until it holds a
port, a file lock, or mutable state. Playwright already gives you the right
scopes: `test`-scoped fixtures (per test) and `worker`-scoped fixtures (per
process). Use those instead.

```ts
// ✅ Worker-scoped fixture — explicit, typed, parallel-safe
export const test = base.extend<{}, { dbPool: DbPool }>({
  dbPool: [async ({}, use) => {
    const pool = await DbPool.connect(process.env.DB_URL!);
    await use(pool);
    await pool.close();
  }, { scope: 'worker' }],
});
```

<Tip>Interview shorthand: Builder for test data, Factory for environment switching, Strategy for variant flows, fixtures for DI, and Singleton is a red flag in parallel test frameworks.</Tip>

## Try it: Builder + Strategy in pure TypeScript

<TsPlayground
  client:only="react"
  label="Patterns — Playground"
  height={420}
  starter={`// Builder + Strategy, runnable without Playwright

// --- Builder ---
interface User { username: string; role: 'admin' | 'customer'; balance: number }

function buildUser(overrides: Partial<User> = {}): User {
  return { username: 'standard_user', role: 'customer', balance: 100, ...overrides };
}

const admin = buildUser({ role: 'admin' });
const broke = buildUser({ balance: 0 });
console.log('admin:', admin.username, '/', admin.role);
console.log('broke balance:', broke.balance);

// --- Strategy ---
interface DiscountStrategy {
  name: string;
  apply(total: number): number;
}

const noDiscount: DiscountStrategy = { name: 'none', apply: t => t };
const tenPercent: DiscountStrategy = { name: '10% off', apply: t => t * 0.9 };
const fiveFlat: DiscountStrategy = { name: '£5 off', apply: t => Math.max(0, t - 5) };

function checkout(total: number, strategy: DiscountStrategy): string {
  const final = strategy.apply(total);
  return \`\${strategy.name}: £\${total} -> £\${final.toFixed(2)}\`;
}

// Same flow, three behaviours — this is the strategy pattern's value
[noDiscount, tenPercent, fiveFlat].forEach(s => console.log(checkout(50, s)));

// --- Builder class with chaining ---
class OrderBuilder {
  private items: string[] = [];
  private coupon = '';
  withItem(sku: string): this { this.items.push(sku); return this; }
  withCoupon(code: string): this { this.coupon = code; return this; }
  build() { return { items: this.items, coupon: this.coupon }; }
}

const order = new OrderBuilder().withItem('BACKPACK').withItem('BIKE-LIGHT').withCoupon('SAVE10').build();
console.log('order:', order.items.join(' + '), '| coupon:', order.coupon);
`}
/>

## Interview questions

<QuizCard client:only="react" storageKey="fw-patterns" questions={[
  {
    q: "Which design patterns appear most in test frameworks, and for what?",
    a: "Builder for test data (defaults + overrides), Factory for environment- or browser-dependent object creation, Strategy for variant flows (payment methods, auth providers), and Dependency Injection via Playwright fixtures for wiring page objects, clients, and data with managed lifecycle.",
    senior: "The pattern I actually review hardest is the Builder, because test data design determines suite maintainability more than any structural pattern. A good builder encodes domain invariants — buildUser can't produce an invalid user — which kills an entire class of 'test data drift' failures. Structural patterns are easy to retrofit; data design debt compounds."
  },
  {
    q: "Why is the Singleton pattern dangerous in a Playwright framework?",
    a: "Playwright runs tests in parallel worker processes. A singleton is per-process, so 'one instance' silently becomes one per worker — harmless for read-only config, broken for anything holding connections, ports, or mutable state. Playwright's worker-scoped fixtures provide the correct primitive: explicit per-worker lifecycle with typed access and guaranteed teardown.",
    senior: "The subtle failure: a singleton caching auth tokens works locally (one worker) and falls over in CI (eight workers hammering the token endpoint simultaneously — rate limit, lockout, flaky suite). Process-level parallelism is why patterns from app development need re-evaluation in test frameworks. Fixtures with explicit scope make the concurrency model visible; singletons hide it."
  },
  {
    q: "How does Playwright's fixture system implement dependency injection?",
    a: "test.extend<T>() declares typed fixtures; each fixture is a function receiving its dependencies (other fixtures) and a use() callback. Tests declare needs in the callback signature, Playwright resolves the dependency graph, constructs in order, and tears down in reverse after use() returns. Setup and cleanup live together, and cleanup runs even on test failure.",
    senior: "Two properties make it better than DI containers bolted onto other frameworks: laziness — a fixture only constructs if some test in the worker actually requests it — and scope control (test vs worker). The teardown-after-use guarantee also eliminates the afterEach drift problem where cleanup lives far from setup and rots independently."
  },
]} />
```

### Task 5: solid-principles.mdx

- [ ] Create file, build, commit `"content: add L4 SOLID Principles topic"`:

```mdx
---
title: SOLID for Automation
level: 4
order: 5
description: The five SOLID principles translated into test framework decisions — with the violations you'll actually meet in real suites.
duration: 35 min
status: complete
widgets: ['ts-playground', 'quiz']
---

import Tip from '../../../components/astro/Tip.astro';
import TsPlayground from '../../../components/react/TsPlayground';
import QuizCard from '../../../components/react/QuizCard';

## S — Single Responsibility

One class, one reason to change. The classic violation is the page object
that also owns test data, API calls, and database checks:

```ts
// ❌ Four responsibilities — four reasons to change
class CheckoutPage {
  async fillCard(/*...*/) {}
  async generateTestUser() {}          // test data
  async verifyOrderInDatabase() {}     // db validation
  async callPaymentApi() {}            // api client
}

// ✅ Each concern in its own unit
class CheckoutPage { async fillCard(/*...*/) {} }
function buildUser(/*...*/) {}
class OrdersDb { async findOrder(/*...*/) {} }
class PaymentsClient { async charge(/*...*/) {} }
```

## O — Open/Closed

Open for extension, closed for modification. Add a payment method without
editing the checkout flow:

```ts
// New payment types register themselves — checkout() never changes
const strategies: Record<string, PaymentStrategy> = {};
export function registerPayment(name: string, s: PaymentStrategy) {
  strategies[name] = s;
}

export async function checkout(page: Page, method: string) {
  await strategies[method].pay(page);   // closed for modification
}

registerPayment('card', cardPayment);
registerPayment('paypal', paypalPayment);
registerPayment('klarna', klarnaPayment);  // extension, no edits
```

## L — Liskov Substitution

A subtype must honour its parent's contract. In frameworks this bites with
base page classes:

```ts
class BasePage {
  // Contract: resolves when the page is ready for interaction
  async waitUntilReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}

// ❌ Violates the contract — "ready" now means something weaker
class FlakyDashboard extends BasePage {
  override async waitUntilReady(): Promise<void> {
    // returns immediately; widgets still loading
  }
}
```

Every caller of `waitUntilReady()` now gets different guarantees depending
on the concrete page — the bug appears far from its cause. If a subclass
can't honour the contract, the hierarchy is wrong: compose instead.

## I — Interface Segregation

Don't force consumers to depend on methods they don't use:

```ts
// ❌ Fat interface — the smoke test needs goto() but must mock everything
interface FullPage {
  goto(): Promise<void>;
  fillForm(data: FormData): Promise<void>;
  submitAndWait(): Promise<void>;
  exportToPdf(): Promise<Buffer>;
}

// ✅ Segregated — depend on what you use
interface Navigable { goto(): Promise<void> }
interface FormCapable { fillForm(data: FormData): Promise<void> }

function smokeCheck(p: Navigable) { /* only needs goto */ }
```

## D — Dependency Inversion

Depend on abstractions, not concretions. The framework's flows should not
know which environment, browser, or data source they run against:

```ts
// Abstraction
interface UserSource {
  getUser(role: string): Promise<User>;
}

// Concretions — swappable without touching flows
class ApiUserSource implements UserSource { /* creates via API */ }
class StaticUserSource implements UserSource { /* reads fixtures file */ }

// The flow depends on the interface; fixtures inject the right one
export const test = base.extend<{ users: UserSource }>({
  users: async ({}, use) => {
    const source = process.env.CI ? new ApiUserSource() : new StaticUserSource();
    await use(source);
  },
});
```

<Tip>SOLID in one test-framework sentence: small single-purpose units (S), extended via registration not modification (O), with subtypes that keep promises (L), narrow interfaces (I), wired through fixtures against abstractions (D).</Tip>

## Try it: spotting the violation

<TsPlayground
  client:only="react"
  label="SOLID — Playground"
  height={400}
  starter={`// Open/Closed + Dependency Inversion, runnable demo

// Abstraction (D): report consumers depend on this, not on concrete reporters
interface Reporter {
  name: string;
  report(passed: number, failed: number): string;
}

// Concretions — each new reporter is an EXTENSION (O), no existing code edited
const consoleReporter: Reporter = {
  name: 'console',
  report: (p, f) => \`\${p} passed, \${f} failed\`,
};

const markdownReporter: Reporter = {
  name: 'markdown',
  report: (p, f) => \`| passed | failed |\\n|---|---|\\n| \${p} | \${f} |\`,
};

const emojiReporter: Reporter = {
  name: 'emoji',
  report: (p, f) => '✅'.repeat(p) + '❌'.repeat(f),
};

// The suite depends only on the abstraction
class TestSuite {
  constructor(private reporter: Reporter) {}

  run(): void {
    const passed = 7, failed = 2;
    console.log(\`[\${this.reporter.name}]\`);
    console.log(this.reporter.report(passed, failed));
    console.log('---');
  }
}

// Swap behaviour by injection — TestSuite never changes
[consoleReporter, markdownReporter, emojiReporter].forEach(r =>
  new TestSuite(r).run()
);
`}
/>

## Interview questions

<QuizCard client:only="react" storageKey="fw-solid" questions={[
  {
    q: "Give a concrete Single Responsibility violation you'd expect in a test framework, and its fix.",
    a: "A page object that also generates test data, calls APIs, and validates the database — four reasons to change in one class. Fix: page object keeps UI interactions only; test data moves to builders, API calls to client classes, db checks to a repository — each injected via fixtures where needed.",
    senior: "The S violation usually arrives gradually — 'just one helper method' at a time — so I enforce it with review heuristics rather than rules: if a page object imports a database driver or an HTTP client, the PR gets flagged. Directory structure helps too: a page object living in src/pages/ that imports from src/api/ is visible in the import path itself."
  },
  {
    q: "How does Liskov Substitution apply to base page classes?",
    a: "A subclass overriding a base method must keep the base's contract. If BasePage.waitUntilReady() promises 'page interactive when resolved' and a subclass overrides it to return immediately, every generic utility trusting that contract breaks — only on that page, far from the cause. If a subclass can't honour the contract, composition is the right structure instead of inheritance.",
    senior: "This is why deep BasePage hierarchies rot: each level adds overrides until nobody can state what any method guarantees. My rule for frameworks: inheritance at most one level deep, contracts documented on the base method, and anything page-specific expressed as composition. The L violations disappear when there's nothing to override."
  },
  {
    q: "Show Dependency Inversion in a Playwright framework without a DI library.",
    a: "Define an interface for the dependency (UserSource with getUser()), implement it per backing store (ApiUserSource, StaticUserSource), and let a fixture choose the implementation — flows and tests depend only on the interface. Playwright's test.extend is the injection mechanism; no container library needed.",
    senior: "The payoff shows at environment boundaries: CI uses ApiUserSource against a seeded service, local dev uses StaticUserSource offline, a perf rig uses a pooled source — zero changes to tests. Inversion also makes the framework testable: you can unit test a flow against an in-memory fake, which is how you keep framework bugs from masquerading as product bugs."
  },
]} />
```

### Task 6: clean-code.mdx

- [ ] Create file, build, commit `"content: add L4 Clean Code topic"`:

```mdx
---
title: Clean Code — DRY, KISS, YAGNI
level: 4
order: 6
description: The three principles that keep test code honest — and the test-specific places where DRY is actually wrong.
duration: 25 min
status: complete
widgets: ['quiz']
---

import Tip from '../../../components/astro/Tip.astro';
import QuizCard from '../../../components/react/QuizCard';

## DRY — and where it's wrong in tests

Don't Repeat Yourself applies to **mechanisms**, not **facts under test**.

```ts
// ✅ DRY the mechanism: login repeated in 40 tests → setup project / fixture
// ✅ DRY the locators: one page object per page
// ✅ DRY the data shape: buildUser() instead of inline literals

// ❌ Do NOT dry the assertion values
const EXPECTED_TOTAL = calculateTotal(ITEMS); // mirror of production logic!
expect(await cart.total()).toBe(EXPECTED_TOTAL);

// ✅ Assert the literal fact
expect(await cart.total()).toBe('$32.39');
```

If the test computes its expectation with the same logic as production, a
bug in that logic passes both. Tests exist to state facts independently —
some duplication between tests is the point, not a smell.

```ts
// Also fine: similar-looking tests that differ in one meaningful value.
// A parametrised table keeps them honest without abstraction:
for (const { user, error } of [
  { user: 'locked_out_user', error: 'locked out' },
  { user: 'invalid_user', error: 'do not match' },
]) {
  test(`login fails for ${user}`, async ({ loginPage, page }) => {
    await loginPage.signIn(user, 'secret_sauce');
    await expect(page.getByTestId('error')).toContainText(error);
  });
}
```

## KISS — the reader is debugging at 2am

Test code is read most often during a CI failure, by someone who didn't
write it, under time pressure. Optimise for that reader.

```ts
// ❌ Clever: generic everything
await runFlow(flows.get(ctx.flowType)!, dataFor(ctx), { retry: policy(ctx) });

// ✅ Simple: boring and traceable
await loginPage.signIn('standard_user', 'secret_sauce');
await inventoryPage.addToCart('Sauce Labs Backpack');
await checkoutPage.complete(shippingInfo);
```

KISS rules of thumb for tests:

- A failed test's cause should be findable from the test body alone.
- Three levels of indirection (test → flow → page) is the ceiling.
- A conditional in a test body is a smell — split into two tests.
- No loops over assertions where a table-driven test would name each case.

## YAGNI — frameworks rot from speculation

You Aren't Gonna Need It hits test frameworks hardest, because frameworks
are infrastructure and infrastructure invites gold-plating.

Classic speculative framework features that rot unused:

- Multi-browser abstraction layer "in case we leave Playwright"
- Config system supporting 12 environments when CI uses 2
- Custom reporter framework before anyone asked for a report
- Generic `BaseTest` with hooks nobody overrides
- Retry/backoff wrappers around Playwright's own auto-wait

```ts
// ❌ Speculative generality
class BasePage<T extends PageConfig, U extends WaitStrategy> { /* ... */ }

// ✅ What today's tests need
class LoginPage { /* constructor(page), signIn(), error() */ }
```

The rule: extract abstraction **after** the third concrete use, not before
the first. Duplication is cheaper than the wrong abstraction.

<Tip>The three principles rank-ordered for test code: KISS first (debuggability is the product), YAGNI second (frameworks attract speculation), DRY last — and never DRY the facts being asserted.</Tip>

## A review checklist

| Question | Principle |
|---|---|
| Can I find the failure cause from the test body alone? | KISS |
| Does any assertion compute its expected value? | DRY (misapplied) |
| Is there an abstraction with exactly one consumer? | YAGNI |
| Does a conditional branch the test's behaviour? | KISS |
| Did a locator change touch more than one file? | DRY (correctly applied) |
| Is there a base class with empty/overridden-away methods? | YAGNI + Liskov |

## Interview questions

<QuizCard client:only="react" storageKey="fw-clean" questions={[
  {
    q: "Where does DRY not apply in test code?",
    a: "Expected values. If a test computes its expectation using logic mirrored from production, a bug in that logic passes both sides — the test proves nothing. Assert literal facts ('$32.39'), even when that repeats across tests. DRY the mechanisms (login, locators, data builders), never the facts under test.",
    senior: "The deeper version: tests are specifications, and specifications gain value from being concrete and independent. When I see expectedTotal = items.reduce(...) in a test, that's a reimplementation of the system under test — the test now verifies that two copies of the same algorithm agree. Table-driven tests with literal expected values get the conciseness people wanted from DRY without the circularity."
  },
  {
    q: "Why is KISS weighted more heavily in test code than in application code?",
    a: "Because test code's primary read context is failure triage: someone who didn't write it, debugging a red CI run, often under release pressure. Application code is read during development; test code during incidents. Every layer of cleverness — generic runners, dynamic flows, conditional assertions — adds minutes to every future triage.",
    senior: "I measure this concretely as time-to-diagnosis: from 'test failed' to 'I know the cause'. Well-factored boring tests get there from the failure message and test body alone. The pattern I ban outright is conditionals in test bodies — a test that branches is N tests wearing one name, and its failure tells you nothing about which path broke."
  },
  {
    q: "Give examples of YAGNI violations specific to test frameworks.",
    a: "Tool-agnostic abstraction layers ('in case we switch from Playwright'), config for environments that don't exist, custom retry wrappers duplicating Playwright's auto-wait, BaseTest classes with unused hooks, reporter frameworks before reporting requirements. Each adds maintenance surface while delivering nothing today.",
    senior: "The driver-abstraction layer is the canonical one: teams wrap every Playwright call in their own interface for a migration that never comes, and the wrapper lags the real API forever — they paid for portability with permanent feature lag. My heuristic: abstraction must be justified by a concrete second use that exists today, not by a hypothetical. Extract on the third use, tolerate duplication until then."
  },
]} />
```

### Task 7: e2e smoke tests

- [ ] Add 2 tests inside the existing describe block in `e2e/widgets.spec.ts` (after the L3 tests, before closing `});`):

```ts
  test('L4 architecture page renders with Mermaid diagram', async ({ page }) => {
    await page.goto('levels/4/architecture-layers/');
    await expect(page.locator('.mermaid svg, [data-processed] svg, svg[id^="mmd-"]').first()).toBeVisible({ timeout: 20000 });
  });

  test('L4 design-patterns renders with TsPlayground', async ({ page }) => {
    await page.goto('levels/4/design-patterns/');
    await expect(page.locator('.monaco-editor').first()).toBeVisible({ timeout: 20000 });
  });
```

- [ ] Build, run `npx playwright test e2e/widgets.spec.ts` — expect 13 passing.
- [ ] Commit `"test: add e2e smoke tests for L4 pages"`.

Note: the Mermaid svg selector may need adjustment — MermaidDiagram renders svg with `id="mmd-<random>"` inside a Box. `svg[id^="mmd-"]` is the reliable anchor.

---

## Self-review

**Design coverage:** all 6 L4 topics present (architecture, POM, screenplay/fluent, patterns, SOLID, clean code) per design doc. ✓
**storageKeys:** fw-arch, fw-pom, fw-screenplay, fw-patterns, fw-solid, fw-clean — unique vs all 20 existing. ✓
**Orders:** 1–6 sequential. ✓
**Widgets:** diagram (Mermaid), ts-playground (pure TS starters, no imports, no async needing IIFE), quiz everywhere. ✓
**MermaidDiagram:** `chart` prop confirmed against component source. ✓
**No placeholders.** ✓
