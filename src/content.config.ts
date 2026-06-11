import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const topics = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/levels' }),
  schema: z.object({
    title: z.string(),
    level: z.number().int().min(0).max(17),
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
