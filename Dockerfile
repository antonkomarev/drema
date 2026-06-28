# Сборка и запуск статического сайта на Astro. Пакетный менеджер — pnpm (через corepack).

# 1. Зависимости (кешируется, пока не менялись package.json / pnpm-lock.yaml)
FROM node:22-slim AS deps
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 2. Сборка статики в /app/dist
FROM deps AS build
WORKDIR /app
COPY . .
RUN pnpm build

# 3. Раздача собранного сайта через `astro preview`
FROM node:22-slim AS preview
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 NODE_ENV=production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate
COPY package.json pnpm-lock.yaml astro.config.mjs ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 4321
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "4321"]
