import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    description: z.string(),
    author: z.string().optional().default('Darwin Cedeño'),
    image: z.object({
      url: z.string(),
      alt: z.string()
    }).optional(),
    tags: z.array(z.string()).optional().default([]),
    originalUrl: z.string().url().optional(),
  })
});

export const collections = {
  'blog': blogCollection,
}; 