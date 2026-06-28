# Сборка и запуск статического сайта на Astro.

# 1. Зависимости (кешируется, пока не менялись package*.json)
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Сборка статики в /app/dist
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

# 3. Раздача собранного сайта через `astro preview`
FROM node:22-slim AS preview
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json astro.config.mjs ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 4321
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4321"]
