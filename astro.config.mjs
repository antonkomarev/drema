import { defineConfig } from 'astro/config';

// ВАЖНО: при деплое на GitHub Pages в подпапку /<repo>/
// замените значения ниже на свои.
// Если сайт будет на собственном домене в корне — оставьте base: '/'.
export default defineConfig({
  site: 'https://USERNAME.github.io',
  base: '/mouse-tales',
});
