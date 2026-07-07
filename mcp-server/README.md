# MCP-сервер Kono (`@kono/mcp-server`)

Всё **описание продукта, архитектура, MCP в чате Kono AI и структура репозитория** — в **корневом** [`README.md`](../README.md).

Здесь только **внешний stdio MCP-сервер**: отдельный npm-пакет для Cursor, Claude Desktop, Windsurf и других MCP-хостов. Те же **12 tools**, что в чате приложения — проекты, задачи, подзадачи, комментарии, поиск.

---

## Содержание

- [Назначение](#назначение)
- [Требования](#требования)
- [Быстрый старт](#быстрый-старт)
- [Получение JWT](#получение-jwt)
- [Конфиг MCP-клиента](#конфиг-mcp-клиента)
- [Переменные окружения](#переменные-окружения)
- [Локальная разработка](#локальная-разработка)
- [Публикация в npm](#публикация-в-npm)
- [Инструменты (tools)](#инструменты-tools)
- [Структура пакета](#структура-пакета)

---

## Назначение

| Параметр | Значение |
| -------- | -------- |
| **Пакет** | `@kono/mcp-server` |
| **Транспорт** | stdio (не HTTP) |
| **Авторизация** | JWT пользователя Kono в `KONO_API_KEY` |
| **API** | REST Kono (`KONO_API_URL`) |

Сервер — тонкий мост между MCP-хостом и Kono API. Сессии MCP не нужны: достаточно env в конфиге клиента. Backend Kono при этом должен быть запущен и доступен по `KONO_API_URL`.

---

## Требования

- **Node.js** 18+
- Запущенный **backend Kono** (`npm run dev` в `backend/`)
- Аккаунт в Kono (email + пароль для JWT)

Запуск backend и переменные окружения — см. [§16 Локальный запуск](../README.md#16-локальный-запуск) в корневом README.

---

## Быстрый старт

**1.** Подними API:

```bash
cd backend
npm run dev
```

**2.** Получи JWT — [ниже](#получение-jwt).

**3.** Добавь сервер в конфиг MCP-клиента — [пример](#конфиг-mcp-клиента).

Для установки без клонирования репозитория:

```bash
npx -y @kono/mcp-server@latest
```

Процесс «зависнет» без вывода — это нормально: stdio-сервер ждёт MCP-хост.

---

## Получение JWT

Отправь email и пароль на `POST /api/auth/login`. В ответе поле `token` — это значение для `KONO_API_KEY` (тот же Bearer, что в Swagger).

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"your-password"}'
```

Сразу вытащить только токен (нужен `jq`):

```bash
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"your-password"}' | jq -r .token
```

PowerShell:

```powershell
$response = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"email":"you@example.com","password":"your-password"}'

$response.token
```

Пример ответа:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Имя",
    "email": "you@example.com"
  }
}
```

---

## Конфиг MCP-клиента

Пример для **Cursor** / **Claude Desktop** (через npm):

```json
{
  "mcpServers": {
    "kono": {
      "command": "npx",
      "args": ["-y", "@kono/mcp-server@latest"],
      "env": {
        "KONO_API_URL": "http://localhost:3000/api",
        "KONO_API_KEY": "<token из POST /auth/login>"
      }
    }
  }
}
```

Локальная разработка пакета из репозитория (абсолютный путь к `dist`):

```json
{
  "mcpServers": {
    "kono": {
      "command": "node",
      "args": ["D:/project-K/mcp-server/dist/index.js"],
      "env": {
        "KONO_API_URL": "http://localhost:3000/api",
        "KONO_API_KEY": "<token>"
      }
    }
  }
}
```

Или через `npm run dev` в папке пакета:

```json
{
  "mcpServers": {
    "kono": {
      "command": "npm",
      "args": ["run", "dev"],
      "cwd": "D:/project-K/mcp-server",
      "env": {
        "KONO_API_URL": "http://localhost:3000/api",
        "KONO_API_KEY": "<token>"
      }
    }
  }
}
```

---

## Переменные окружения

| Переменная | Обязательна | Описание |
| ---------- | ----------- | -------- |
| `KONO_API_URL` | нет (дефолт `http://localhost:3000/api`) | Базовый URL REST API Kono |
| `KONO_API_KEY` | да | JWT из `POST /auth/login` |
| `KONO_API_TOKEN` | — | Алиас для `KONO_API_KEY` |

Для локального `npm run dev` — в `mcp-server/.env` (скопируй из `.env.example`). В Cursor / Claude — в блоке `env` конфига MCP-клиента.

---

## Локальная разработка

```bash
cd mcp-server
npm install
npm run build
npm run dev
```

| Команда | Назначение |
| ------- | ---------- |
| `npm run build` | Сборка TypeScript → `dist/` |
| `npm run dev` | Запуск из исходников (`tsx src/index.ts`) |
| `npm run prepublishOnly` | Сборка перед публикацией в npm |

Проверка бинарника после сборки:

```bash
node dist/index.js
```

---

## Публикация в npm

```bash
cd mcp-server
npm login
npm publish --access public
```

Проверка:

```bash
npx -y @kono/mcp-server@latest
```

Пакет публикуется из папки `mcp-server/` монорепозитория [project-K](https://github.com/Shadowgraph-1/project-K). Поле `repository.directory` в `package.json` указывает на эту папку.

---

## Инструменты (tools)

Один набор из **12 инструментов** — в чате Kono AI и на внешнем сервере. Полные описания для UI — в [mcp-tools.ts](../frontend/src/shared/config/mcp-tools.ts).

| Категория | Tools |
| --------- | ----- |
| Проекты | `list_projects`, `create_project` |
| Задачи | `list_tasks`, `create_task`, `update_task`, `delete_task` |
| Подзадачи | `list_subtasks`, `create_subtask`, `update_subtask`, `delete_subtask` |
| Комментарии | `add_task_comment` |
| Поиск | `search_kono` |

Удаление (`delete_task`, `delete_subtask`) помечено как destructive — только по явной просьбе пользователя.

---

## Структура пакета

```
mcp-server/
├── src/
│   ├── index.ts          # entrypoint (stdio)
│   ├── server.ts         # McpServer + transport
│   ├── config.ts         # KONO_API_URL, KONO_API_KEY
│   ├── kono-api.ts       # HTTP-клиент к REST API
│   ├── constants/        # общие константы (без импорта из backend)
│   └── tools/            # registerKonoTools
├── dist/                 # сборка для npm (gitignore)
├── package.json          # @kono/mcp-server, bin: kono-mcp
├── tsconfig.json
└── README.md
```

---

## Документация в приложении

В веб-интерфейсе Kono — обзор, TOC и примеры конфигов:

| Раздел | URL |
| ------ | --- |
| Обзор MCP | `/projects/mcp` |
| Документация | `/projects/mcp?view=docs` |

MCP **в чате Kono AI** (не этот пакет) — см. [§17 Настройка MCP](../README.md#17-настройка-mcp) в корневом README.