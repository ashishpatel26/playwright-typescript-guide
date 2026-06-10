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
