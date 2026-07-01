# ---------- 1. Сборка SPA ----------
FROM node:22-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# vite build = tsc -b && vite build
RUN npm run build

# ---------- 2. Рантайм на nginx ----------
FROM nginx:1.27-alpine AS runtime

# Кастомный конфиг с SPA-фолбэком и прокси на backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Собранная ститика
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 4173

CMD ["nginx", "-g", "daemon off;"]
