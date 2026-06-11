import { defineCollection, z } from 'astro:content';

const projectTypeEnum = z.enum(['fullstack', 'plugins', 'tools', 'support', 'mobile']);

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    priority: z.number(),
    type: projectTypeEnum.default('fullstack'),
    link: z.string().default(''),
    github: z.string().default(''),
    tags: z.array(z.string()),
    coverImage: z.string(),
    gallery: z.array(z.string()).optional().default([]),
  }),
});

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
  blog: blogCollection,
  projects: projectsCollection,
}; 