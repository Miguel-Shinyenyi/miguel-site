import { defineCollection, z } from 'astro:content';

const baseSchema = z.object({
  title: z.string(),
  date: z.date(),
  summary: z.string(),
  draft: z.boolean().default(false),
  updated: z.date().optional(),
});

// UMWAYI's site/README.md defines this front matter; it's the actual
// source of truth for what fields exist (see scripts/sync-content.mjs and
// docs/design.md's decisions log). crossPost is gone: no file ever used
// it, and UMWAYI's own schema doesn't have it.
const articleSchema = baseSchema.extend({
  tags: z.array(z.string()).optional(),
  illustration: z.string().optional(),
  illustrationAlt: z.string().optional(),
});

const linkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const projectSchema = articleSchema.extend({
  status: z.string(),
  statusVariant: z.enum(['success', 'primary']),
  category: z.string(),
  stack: z.array(z.string()),
  link: z.string(),
  linkLabel: z.string(),
  links: z.array(linkSchema).optional(),
});

const nowSchema = z.object({
  working: z.string(),
  reading: z.string(),
  building: z.string(),
  basedIn: z.string(),
  updated: z.date(),
});

export const collections = {
  philosophy: defineCollection({ type: 'content', schema: articleSchema }),
  tech: defineCollection({ type: 'content', schema: articleSchema }),
  journal: defineCollection({ type: 'content', schema: articleSchema }),
  projects: defineCollection({ type: 'content', schema: projectSchema }),
  now: defineCollection({ type: 'content', schema: nowSchema }),
};
