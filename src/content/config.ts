import { defineCollection, z } from 'astro:content';

const baseSchema = z.object({
  title: z.string(),
  date: z.date(),
  summary: z.string(),
  draft: z.boolean().default(false),
  updated: z.date().optional(),
});

export const collections = {
  philosophy: defineCollection({ type: 'content', schema: baseSchema }),
  tech: defineCollection({ type: 'content', schema: baseSchema }),
  journal: defineCollection({ type: 'content', schema: baseSchema }),
  projects: defineCollection({ type: 'content', schema: baseSchema }),
};
