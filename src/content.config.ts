import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Сказки — проза в Markdown + frontmatter.
// Персонажи и вещи («память») вынесены в src/data/*.yaml и грузятся через src/lib/memory.ts.
const stories = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/stories' }),
  schema: z.object({
    number: z.number(),                          // порядковый номер
    title: z.string(),                           // название
    place: z.string(),                           // id места из places.yaml (meadow, ...)
    characters: z.array(z.string()).default([]), // id познакомившихся (из characters.yaml)
    things: z.array(z.string()).default([]),     // id узнанных вещей (из things.yaml)
    date: z.date().optional(),
  }),
});

export const collections = { stories };
