# Levels 3–14 Master Content Design

> Source of truth: `OUTLINE.md`. This design consolidates outline bullets into concrete MDX topic pages, following the compression pattern established in L0–L2 (several outline bullets → one focused topic page).

**Goal:** Complete topic-page design for all 12 remaining levels (55 pages), grouped into 6 execution waves.

**Per-topic anatomy (unchanged from L0–L2):** Concept → Code → Widget → Practice → Interview questions (QuizCard with `q`/`a`/`senior`).

**Widget rules:**
- `quiz` — every page (storageKey = page slug, prefixed per level to stay unique)
- `diagram` — only where a ConceptDiagram type exists (`testing-pyramid`, `browser-hierarchy`, `retry-timeline`) or MermaidDiagram fits (architecture/pipeline/flow diagrams)
- `ts-playground` — pure-TypeScript topics only (no Playwright imports; IIFE for async)
- `pw-runner` / `locator-lab` — only against existing practice pages (`login.html`, `inventory.html`); no new practice pages in these waves

**Frontmatter:** identical schema to L0–L2. `status: complete` on ship.

---

## Level 3 — Advanced Playwright (6 topics, 18h)

| # | File | Title | Covers (OUTLINE bullets) | Widgets | Duration |
|---|------|-------|--------------------------|---------|----------|
| 1 | `browser-contexts.mdx` | Browser Contexts & Multi-Tab | Browser Context, Multi Tabs, Multiple Windows | diagram (`browser-hierarchy`), quiz | 35 min |
| 2 | `frames-and-shadow-dom.mdx` | Frames & Shadow DOM | Frames & iFrames, Shadow DOM | quiz | 30 min |
| 3 | `advanced-interactions.mdx` | Advanced Interactions | File Upload/Download, Drag and Drop, Geolocation, Permissions, Browser Events | quiz | 35 min |
| 4 | `network-interception.mdx` | Network Interception & Mocking | Network Interception, HAR Recording, Mock APIs | quiz | 40 min |
| 5 | `authentication.mdx` | Authentication & Sessions | Authentication, Session Management (storageState, global setup) | quiz | 35 min |
| 6 | `debugging-and-tracing.mdx` | Debugging & Trace Viewer | (implicit in outline's production focus) trace viewer, UI mode, codegen, video/screenshot | quiz | 25 min |

Practice sites: The Internet Herokuapp (frames, upload, drag), Books PWA (shadow DOM), LambdaTest Playground (tabs), OpenStreetMap (geolocation).

## Level 4 — Production Framework Design (6 topics, 20h)

| # | File | Title | Covers | Widgets | Duration |
|---|------|-------|--------|---------|----------|
| 1 | `architecture-layers.mdx` | Folder Structure & Layered Architecture | Folder Structure, Layered Architecture | diagram (Mermaid), quiz | 30 min |
| 2 | `page-object-model.mdx` | Page Object Model | POM, Component Object Model | ts-playground, quiz | 40 min |
| 3 | `screenplay-and-fluent.mdx` | Screenplay & Fluent Patterns | Screenplay Pattern, Fluent Design Pattern | quiz | 35 min |
| 4 | `design-patterns.mdx` | Design Patterns for Test Frameworks | Singleton, Factory, Builder, Strategy, DI | ts-playground, quiz | 45 min |
| 5 | `solid-principles.mdx` | SOLID for Automation | SOLID Principles | ts-playground, quiz | 35 min |
| 6 | `clean-code.mdx` | Clean Code: DRY, KISS, YAGNI | Clean Code, DRY, KISS, YAGNI | quiz | 25 min |

Practice projects: Magento Demo Store (e-commerce framework), OrangeHRM (HRMS framework).

## Level 5 — API Testing (6 topics, 16h)

| # | File | Title | Covers | Widgets | Duration |
|---|------|-------|--------|---------|----------|
| 1 | `rest-api-testing.mdx` | REST API Testing with Playwright | REST APIs (request fixture, Restful Booker) | quiz | 35 min |
| 2 | `graphql-and-soap.mdx` | GraphQL & SOAP | GraphQL (Countries API), SOAP | quiz | 30 min |
| 3 | `api-authentication.mdx` | API Auth: Headers, JWT, OAuth2 | Headers & Authentication, JWT, OAuth2 | quiz | 35 min |
| 4 | `contract-and-schema.mdx` | Contract Testing & Schema Validation | Contract Testing, Schema Validation | quiz | 30 min |
| 5 | `mocking-and-chaining.mdx` | API Mocking & Chaining | API Mocking, API Chaining | quiz | 30 min |
| 6 | `hybrid-ui-api-flows.mdx` | Hybrid UI + API Flows | End-to-End API Flow (create→verify→login→UI→delete), Database Validation pointer | diagram (Mermaid), quiz | 35 min |

Practice APIs: Restful Booker, ReqRes, Fake Store API, Countries GraphQL.

## Level 6 — Database Testing (4 topics, 12h)

| # | File | Title | Covers | Widgets | Duration |
|---|------|-------|--------|---------|----------|
| 1 | `sql-fundamentals.mdx` | SQL Fundamentals for Testers | SQL Basics, Joins | quiz | 35 min |
| 2 | `advanced-sql.mdx` | Transactions & Stored Procedures | Transactions, Stored Procedures | quiz | 30 min |
| 3 | `relational-db-testing.mdx` | Relational DB Validation | Database Validation, PostgreSQL (Pagila), MySQL (Sakila) | quiz | 35 min |
| 4 | `nosql-testing.mdx` | NoSQL Validation | MongoDB, Redis, Cassandra, DynamoDB | quiz | 30 min |

## Level 7 — CI/CD for Automation (5 topics, 14h)

| # | File | Title | Covers | Widgets | Duration |
|---|------|-------|--------|---------|----------|
| 1 | `git-and-branching.mdx` | Git & Branching Strategies | Git, Branching Strategies, Pull Requests | quiz | 30 min |
| 2 | `github-actions.mdx` | GitHub Actions for Playwright | GitHub Actions | diagram (Mermaid pipeline), quiz | 40 min |
| 3 | `jenkins-gitlab-azure.mdx` | Jenkins, GitLab CI & Azure DevOps | Jenkins, GitLab CI, Azure DevOps, CircleCI | quiz | 35 min |
| 4 | `parallel-execution.mdx` | Parallel Execution & Sharding | Parallel Execution, Build/Release Pipelines | quiz | 30 min |
| 5 | `reporting-and-artifacts.mdx` | Reporting & Artifact Management | Artifact Management, Test Reporting | quiz | 25 min |

## Level 8 — Docker & Containers (4 topics, 10h)

| # | File | Title | Covers | Widgets | Duration |
|---|------|-------|--------|---------|----------|
| 1 | `docker-basics.mdx` | Docker Fundamentals | Docker Basics | quiz | 30 min |
| 2 | `playwright-in-docker.mdx` | Playwright in Docker | Playwright in Docker, Containerized Test Execution | quiz | 35 min |
| 3 | `docker-compose.mdx` | Docker Compose for Test Stacks | Docker Compose | diagram (Mermaid), quiz | 30 min |
| 4 | `kubernetes-testing.mdx` | Kubernetes Test Execution | Kubernetes Basics, Test Execution on K8s | quiz | 30 min |

## Level 9 — Cloud Testing (4 topics, 10h)

| # | File | Title | Covers | Widgets | Duration |
|---|------|-------|--------|---------|----------|
| 1 | `aws-for-testers.mdx` | AWS for Test Engineers | AWS (EC2, S3, Lambda, ECS) | quiz | 35 min |
| 2 | `azure-and-gcp.mdx` | Azure & GCP Essentials | Azure, GCP | quiz | 25 min |
| 3 | `cloud-grids.mdx` | Cloud Testing Grids | BrowserStack, LambdaTest, Sauce Labs | quiz | 30 min |
| 4 | `cloud-strategy.mdx` | Cloud vs Local: Strategy & Cost | (synthesis — when to use grids, cost model) | quiz | 20 min |

## Level 10 — Performance Testing Awareness (3 topics, 8h)

| # | File | Title | Covers | Widgets | Duration |
|---|------|-------|--------|---------|----------|
| 1 | `performance-test-types.mdx` | Load, Stress, Spike, Endurance | Load/Stress/Spike/Endurance Testing | diagram (Mermaid), quiz | 30 min |
| 2 | `k6-hands-on.mdx` | k6 Hands-On | k6 | quiz | 35 min |
| 3 | `jmeter-and-locust.mdx` | JMeter & Locust | JMeter, Locust | quiz | 30 min |

## Level 11 — Security Testing Awareness (4 topics, 8h)

| # | File | Title | Covers | Widgets | Duration |
|---|------|-------|--------|---------|----------|
| 1 | `owasp-top-10.mdx` | OWASP Top 10 for Testers | OWASP Top 10 | quiz | 30 min |
| 2 | `xss-and-csrf.mdx` | XSS & CSRF | XSS, CSRF | quiz | 30 min |
| 3 | `injection-and-auth.mdx` | Injection & Auth Vulnerabilities | SQL Injection, Authentication/Authorization Vulnerabilities | quiz | 30 min |
| 4 | `api-security.mdx` | API Security Testing | API Security | quiz | 25 min |

## Level 12 — Observability (4 topics, 8h)

| # | File | Title | Covers | Widgets | Duration |
|---|------|-------|--------|---------|----------|
| 1 | `logs-metrics-traces.mdx` | The Three Pillars | Logs, Metrics, Traces | diagram (Mermaid), quiz | 30 min |
| 2 | `opentelemetry.mdx` | OpenTelemetry for Test Engineers | OpenTelemetry | quiz | 30 min |
| 3 | `observability-tools.mdx` | Grafana, Kibana, Datadog, Splunk | Grafana, Kibana, Datadog, Splunk | quiz | 25 min |
| 4 | `production-debugging.mdx` | Root Cause Analysis | Root Cause Analysis, Production Failure Debugging | quiz | 35 min |

## Level 13 — AI in Test Automation (5 topics, 10h)

| # | File | Title | Covers | Widgets | Duration |
|---|------|-------|--------|---------|----------|
| 1 | `ai-testing-landscape.mdx` | AI in Testing: The Landscape | AI Test Generation overview | quiz | 25 min |
| 2 | `mcp-fundamentals.mdx` | MCP Fundamentals | MCP (Model Context Protocol) | diagram (Mermaid), quiz | 30 min |
| 3 | `playwright-mcp.mdx` | Playwright MCP | Playwright MCP | quiz | 35 min |
| 4 | `agentic-testing.mdx` | Agentic Testing | Agentic Testing, Claude Code, OpenAI Agents, Cursor/Windsurf | quiz | 30 min |
| 5 | `self-healing-and-generation.mdx` | Self-Healing Tests & LLM Generation | AI-assisted Debugging, Self-Healing Tests, LLM-based Test Generation | quiz | 30 min |

## Level 14 — Interview Preparation (4 topics, 12h)

| # | File | Title | Covers | Widgets | Duration |
|---|------|-------|--------|---------|----------|
| 1 | `framework-design-questions.mdx` | Framework Design Questions | Framework Design Questions | quiz | 45 min |
| 2 | `architecture-and-scalability.mdx` | Architecture Reviews & Scalability | Architecture Reviews, Scalability Questions | quiz | 40 min |
| 3 | `automation-strategy.mdx` | Automation Strategy Questions | Automation Strategy | quiz | 35 min |
| 4 | `leadership-scenarios.mdx` | Leadership & QE Manager Scenarios | Leadership Questions, QE Manager Scenarios | quiz | 40 min |

---

## Execution waves

| Wave | Levels | Pages | Rationale |
|------|--------|-------|-----------|
| 3 | L3 | 6 | Direct continuation of L2; highest learner demand |
| 4 | L4 | 6 | Framework design — interview-critical |
| 5 | L5 + L6 | 10 | API + DB pair naturally (hybrid flows reference DB validation) |
| 6 | L7 + L8 | 9 | CI/CD + Docker pair (pipelines run in containers) |
| 7 | L9 + L10 + L11 | 11 | Awareness levels — lighter pages, batchable |
| 8 | L12 + L13 + L14 | 13 | Observability + AI + interview capstone |

Each wave = one plan doc (`docs/superpowers/plans/`), executed via subagent-driven development, e2e smoke tests extended per wave, push after each wave.

**Out of scope (future waves):** Domain Projects pages, Capstone pages, Production Failure Scenario pages (OUTLINE sections after L14). The build warns about missing `capstones`/`domains` content dirs — these get their own design doc later.

**storageKey convention:** L3+ pages prefix slug with level context where collision risk exists (e.g. `pw-adv-contexts`, `fw-pom`, `api-rest`, `db-sql`, `ci-gha`, `docker-basics`, `cloud-aws`, `perf-types`, `sec-owasp`, `obs-pillars`, `ai-mcp`, `iv-framework`). All unique site-wide.

**QuizCard depth:** L14 pages are interview-bank pages — 6–8 questions each instead of the usual 3–4.
