# ---------- 1. Зависимости ----------
FROM node:22-slim AS deps
WORKDIR /app

# Поддержка Prisma (для Postgres нужен openssl; pg-adapter использует нативный libpq)
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl libpq-dev \
 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci

# ---------- 2. Билд ----------
FROM deps AS build
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build        # = prisma generate && tsc -p tsconfig.build.json

# ---------- 3. Рантайм ----------
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl libpq-dev \
 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/src/generated ./src/generated

EXPOSE 3000
# Миграции + старт. Если миграций нет — prisma migrate deploy ничего не сделает.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
