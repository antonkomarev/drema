import { load } from 'js-yaml';
import { z } from 'astro:content';
// Содержимое YAML инлайнится при сборке (Vite ?raw) — работает и после бандлинга.
import charactersRaw from '../data/characters.yaml?raw';
import thingsRaw from '../data/things.yaml?raw';

// ---- Схемы памяти (валидируются при сборке) ----
const characterSchema = z.object({
  name: z.string(),
  emoji: z.string().optional(),
  appearance: z.string(),
  home: z.string().optional(),
  metInStory: z.number(),
  status: z.string().default('друг'),
  facts: z.array(z.string()).default([]),
});

const thingSchema = z.object({
  name: z.string(),
  emoji: z.string().optional(),
  whatIsIt: z.string(),
  learnedFrom: z.string().optional(),
  firstInStory: z.number(),
  leadsToCharacter: z.string().optional(),
  facts: z.array(z.string()).default([]),
});

export type Character = z.infer<typeof characterSchema> & { id: string };
export type Thing = z.infer<typeof thingSchema> & { id: string };

function parseMap<T>(raw: string, schema: z.ZodType<T>, label: string): Record<string, T & { id: string }> {
  const data = (load(raw) as Record<string, unknown>) ?? {};
  const out: Record<string, T & { id: string }> = {};
  for (const [id, value] of Object.entries(data)) {
    const res = schema.safeParse(value);
    if (!res.success) {
      throw new Error(`Память (${label}) → «${id}»: ${res.error.issues.map((i) => i.path.join('.') + ' ' + i.message).join('; ')}`);
    }
    out[id] = { ...(res.data as T), id };
  }
  return out;
}

const charactersMap = parseMap(charactersRaw, characterSchema, 'друзья');
const thingsMap = parseMap(thingsRaw, thingSchema, 'вещи');

export const characters: Character[] = Object.values(charactersMap).sort((a, b) => a.metInStory - b.metInStory) as Character[];
export const things: Thing[] = Object.values(thingsMap).sort((a, b) => a.firstInStory - b.firstInStory) as Thing[];

export const getCharacter = (id: string): Character | undefined => charactersMap[id] as Character | undefined;
export const getThing = (id: string): Thing | undefined => thingsMap[id] as Thing | undefined;
