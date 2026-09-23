import { defineCollection, z } from 'astro:content';

const baseSchema = z.object({
  title: z.string(),
  date: z.date(),
  summary: z.string(),
  draft: z.boolean().default(false),
  updated: z.date().optional(),
});

// docs/redesign-spec-2026-09-23.md section 4.9 front matter, plus
// docs/design.md's meshing note: crossPost exists as an optional field for
// when Hashnode/dev.to/Medium/LinkedIn accounts are real, but no article
// gets a value in it yet, and the footer only renders links that work today.
const articleSchema = baseSchema.extend({
  tags: z.array(z.string()).optional(),
  illustration: z.string().optional(),
  illustrationAlt: z.string().optional(),
  crossPost: z.array(z.enum(['hashnode', 'devto', 'medium', 'linkedin'])).optional(),
});

const projectSchema = baseSchema.extend({
  status: z.string(),
  statusVariant: z.enum(['success', 'primary']),
  category: z.string(),
  stack: z.array(z.string()),
  link: z.string(),
  linkLabel: z.string(),
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
