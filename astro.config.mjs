import { defineConfig } from 'astro/config';

// Деплой на GitHub Pages как project-сайт: https://antonkomarev.github.io/drema/
// site — origin без пути; base — имя репозитория.
// Если переедем на свой домен/корневой репозиторий — base: '/'.
export default defineConfig({
  site: 'https://antonkomarev.github.io',
  base: '/drema',
});
