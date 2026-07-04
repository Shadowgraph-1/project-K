<div align="center">

<a id="kono"></a>

<img src="./frontend/public/readme_logo.jpg" alt="Kono — K-Project" width="920">

**Kono** — таск-трекер для небольших команд и индивидуальной работы с AI-компаньоном, MCP-инструментами и управляемыми внешними коннекторами.

[![Linear — проект](https://img.shields.io/badge/Linear-5E6AD2?style=for-the-badge&logo=linear&logoColor=white)](https://linear.app/project-k-value/project/focus-with-me-1a3e5e26fbfa/overview)
[![Figma — макеты](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/design/gV6wyVsuiNxqcDrhfwb7JU/Project-K?t=UfhMy33D2pk2PALT-0)

</div>

## Содержание

- [Содержание](#содержание)
- [1. Концепция и проблематика](#1-концепция-и-проблематика)
- [2. Целевая аудитория](#2-целевая-аудитория)
- [3. Стек технологий](#3-стек-технологий)
- [4. Функциональность по ролям](#4-функциональность-по-ролям)
  - [Роль `user`](#роль-user)
  - [Роль `admin`](#роль-admin)
- [5. Ключевые особенности](#5-ключевые-особенности)
- [6. Монетизация](#6-монетизация)
- [7. Внешние интеграции](#7-внешние-интеграции)
- [8. Модель данных](#8-модель-данных)
- [9. Концептуальная схема связей (ER)](#9-концептуальная-схема-связей-er)
- [10. Архитектура](#10-архитектура)
- [11. Жизненный цикл задачи](#11-жизненный-цикл-задачи)
- [12. Клиентские пути](#12-клиентские-пути)
  - [Виды задач в сессии](#виды-задач-в-сессии)
  - [Карточка задачи — комментарии и activity](#карточка-задачи--комментарии-и-activity)
- [13. Функциональные требования MoSCoW](#13-функциональные-требования-moscow)
- [14. Пользовательские сценарии](#14-пользовательские-сценарии)
- [15. План работ](#15-план-работ)
- [16. Локальный запуск](#16-локальный-запуск)
  - [Требования](#требования)
  - [Docker Compose](#docker-compose)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Endpoints](#endpoints)
  - [Swagger — документация API](#swagger--документация-api)
  - [Переменные окружения](#переменные-окружения)
- [17. Настройка MCP](#17-настройка-mcp)
  - [MCP в чате Kono AI](#mcp-в-чате-kono-ai)
  - [Внешний stdio-сервер](#внешний-stdio-сервер)
  - [Инструменты (tools)](#инструменты-tools)
  - [Документация в приложении](#документация-в-приложении)
- [18. Настройка коннекторов](#18-настройка-коннекторов)
  - [Telegram-коннектор](#telegram-коннектор)
  - [Управление подключением](#управление-подключением)
  - [API коннекторов](#api-коннекторов)
  - [Документация в приложении](#документация-в-приложении-1)
- [19. Структура репозитория](#19-структура-репозитория)
- [20. Глоссарий](#20-глоссарий)
  - [Продукт и UX](#продукт-и-ux)
  - [Архитектура и API](#архитектура-и-api)
  - [Frontend](#frontend-1)
  - [Backend, данные и инфраструктура](#backend-данные-и-инфраструктура)

---

## 1. Концепция и проблематика

**Kono** объединяет базовые функции таск-трекера — проекты, задачи, роли, канбан-доску, сроки и комментарии — с AI-компаньоном, который работает в контексте проекта. Ассистент может отвечать на вопросы по задачам, помогать с декомпозицией и выполнять действия через MCP-инструменты.

**Решаемая проблема.** Классический таск-трекер фиксирует задачи, но не помогает пользователю быстро понять приоритет, контекст и следующий шаг. Kono снижает этот порог за счёт **AI-компаньона с доступом к задачам**, **истории статусов**, **структурированной ленты комментариев**, **прозрачности командной работы** и **настраиваемых уведомлений**, включая локальный Telegram-коннектор.

---

## 2. Целевая аудитория

На первом шаге продукт ориентирован на **небольшие команды и фрилансеров** — тех, кому нужен простой и быстрый инструмент для совместной работы без корпоративной тяжести. Им важно не просто хранить задачи, а **понимать что происходит в проекте** и быстро двигаться вперёд.

---

## 3. Стек технологий

**Клиент**

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**Сервер и данные**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

| Компонент             | Технологии                            | Статус                                          |
| --------------------- | ------------------------------------- | ----------------------------------------------- |
| [SPA](#glossary-spa)  | [React](#glossary-react) 19, [TypeScript](#glossary-typescript), [Vite](#glossary-vite) | **Внедрено**                                    |
| Маршрутизация         | [React Router](#glossary-react-router) | **Внедрено**                                    |
| Стилизация            | [Tailwind CSS](#glossary-tailwind-css) v4, [shadcn/ui](#glossary-shadcn-ui) | **Внедрено**                                    |
| Серверное состояние   | [TanStack Query](#glossary-tanstack-query) | **Внедрено** ([workspaces](#glossary-workspace), invites, tasks, subtasks, [activity](#glossary-activity), members, health, search, [LLM](#glossary-llm)-ключи, коннекторы, [admin](#glossary-admin)) |
| Клиентское состояние  | [Zustand](#glossary-zustand) + локальный UI state | **Внедрено** (auth, тема сессии, prefs уведомлений, модалки, [bulk](#glossary-bulk)-selection, [kanban](#glossary-kanban) [DnD](#glossary-drag-and-drop)) |
| HTTP-клиент           | [Axios](#glossary-axios)              | **Внедрено**                                    |
| [API](#glossary-api)  | [Node.js](#glossary-nodejs), [Fastify](#glossary-fastify), [Zod](#glossary-zod) | **Внедрено** (auth, users, workspaces, tasks, team, search, AI, LLM-ключи, коннекторы, admin) |
| [ORM](#glossary-orm) / миграции | [Prisma](#glossary-prisma)      | **Внедрено**                                    |
| СУБД                  | [PostgreSQL](#glossary-postgresql)    | **Внедрено**                                    |
| Документация API      | [Swagger](#glossary-swagger) UI (`/docs`) | **Внедрено**                                    |
| Контейнеризация       | [Docker](#glossary-docker), [Docker Compose](#glossary-docker-compose), [Nginx](#glossary-nginx) | **Внедрено**                                    |

---

## 4. Функциональность по ролям

### Роль [`user`](#glossary-user)

| Экран / модуль     | Назначение                                                               |
| ------------------ | ------------------------------------------------------------------------ |
| **Задачи**         | [Hub](#glossary-hub) проектов, три вида (список, «Даты», [канбан](#glossary-kanban) с [drag-and-drop](#glossary-drag-and-drop)), приоритет через `tags`, фильтр по статусу (сервер, `GET /tasks?status=`), сортировка на клиенте (дата создания / название), toolbar (фильтр - сортировка - настройки вида), [bulk](#glossary-bulk)-действия, карточка задачи, глобальный поиск ([Command palette](#glossary-command-palette), Ctrl+K) |
| **Проекты**        | Создание проектов, управление участниками, hub участников (`MembersHubPage`) |
| **Компаньон**      | Плавающая панель чата + вход из сайдбара; контекст задач ([`withTask`](#glossary-withtask)); **MCP tools** в чате — см. [§17](#17-настройка-mcp) |
| **Уведомления**    | [In-app](#glossary-in-app) колокольчик в сессии (история [toast](#glossary-toast) + входящие инвайты); переключатели в настройках (задачи / приглашения). Email и рассылки не планируются |
| **MCP**            | `/projects/mcp` — обзор (агенты, LLM, tools), docs-view (JWT, `.env`, конфиг stdio-сервера); 12 tools в чате и во внешних клиентах. Подробно: [§17 Настройка MCP](#17-настройка-mcp) |
| **Коннекторы**     | `/projects/connectors` — каталог интеграций, вкладка «Документация», Telegram-коннектор с состояниями `installed` / `enabled` / `configured`, включение через switch и удаление через меню карточки. Подробно: [§18 Настройка коннекторов](#18-настройка-коннекторов) |
| **Настройки**      | Личный кабинет `/projects/settings`: профиль (редактирование и сохранение на сервер, `PATCH /api/users/me`), смена пароля (`PATCH /api/users/me/password`), переключатели in-app уведомлений, выход, удаление аккаунта; **[LLM](#glossary-llm)-ключи** — отдельная страница (таблица + «Документация») |
| **Статус сервиса** | [Health-check](#glossary-health-check) [API](#glossary-api) и страница состояния сервисов в сессии                    |

### Роль [`admin`](#glossary-admin)

| Экран / модуль   | Назначение                                                   |
| ---------------- | ------------------------------------------------------------ |
| **Админ-панель** | Сводка платформы, список пользователей с удалением (`DELETE /admin/users/:userId`, confirm в UI; нельзя удалить себя или другого админа), журнал ошибок [API](#glossary-api) (in-memory), [feature flags](#glossary-feature-flags) |
| **Статистика**   | Агрегированные метрики по пользователям, проектам, задачам, health БД/AI |

---

## 5. Ключевые особенности

1. **AI-компаньон с контекстом проекта** — чат в сессии; контекст задач ([`withTask`](#glossary-withtask)). LLM через ключи провайдеров или OpenAI-compatible API. **[MCP tools](#glossary-mcp)** в чате: 12 инструментов (проекты, задачи, подзадачи, комментарии, поиск).
2. **MCP для внешних клиентов** — stdio-сервер Kono (`npm run mcp`), JWT пользователя, те же tools для Cursor / Claude Desktop / Windsurf.
3. **Совместные проекты** — владелец, роли участников, инвайты, общий список задач.
3. **Лента активностей** — в карточке задачи одна секция «Комментарии»: системные события (статусы, подзадачи) и пользовательские сообщения в общем потоке; вложенные ответы, сворачиваемые ветки.
4. **Виды задач в сессии** — список (строки с контекстным меню), [канбан](#glossary-kanban) по статусам, вид «Даты» с группировкой (просрочено → сегодня → завтра → неделя → позже → без даты).
5. **Подзадачи** — в карточке или через MCP/AI. **[Спринты](#glossary-sprint)** — в планах.
6. **Командная работа** — проекты с участниками и ролями, входящие инвайты, комментарии к задачам, активность участников. Назначение исполнителей из команды — в планах.
7. **Уведомления** — [in-app](#glossary-in-app) колокольчик (история действий + инвайты), настраиваемые переключатели, локальный Telegram-коннектор для уведомлений о созданных задачах. Email и массовые рассылки **не планируются**.
8. **[Горячие клавиши](#glossary-keyboard-shortcuts)** — Ctrl+K поиск, Ctrl+B сайдбар, Ctrl+N новая задача, Ctrl+J Kono AI.
9. **Фильтр и сортировка задач** — фильтр по статусу на сервере (все 4 статуса + «Все задачи»); сортировка на клиенте по дате создания и названию (asc/desc). Отдельные кнопки в toolbar: **Фильтр** · **Сортировка** · **Настройки** (вид, добавить / удалить все).
10. **История статуса задачи** — `task_status_history`, timeline в карточке (`TaskStatusHistoryTimeline`).
11. **[Коннекторы](#glossary-connectors)** — каталог интеграций в `/projects/connectors` и на лендинге; Telegram уже подключается локально через `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`, управляется через API и UI.
12. **Лендинг** — секции MCP и коннекторов, двухколоночный справочник tools, карусель «Собрано».

---

## 6. Монетизация

В текущей версии не реализована. Архитектура допускает добавление подписочной модели через таблицы `subscriptions` и интеграцию с платёжным провайдером.

---

## 7. Внешние интеграции

| Сервис                 | Назначение                                     | Статус      |
| ---------------------- | ---------------------------------------------- | ----------- |
| **LM Studio / [OpenAI-compatible](#glossary-openai-compatible)** | Чат Kono AI (`POST /api/ai/chat`), MCP tools | **Внедрено** |
| **[MCP](#glossary-mcp) (stdio-сервер Kono)** | 12 tools для внешних AI-клиентов | **Внедрено** (`backend/mcp-server`, `npm run mcp`) |
| **OpenRouter / Groq / Together AI** | LLM с tool calling через личные ключи в `/projects/api-keys` | **Внедрено** (UI + docs) |
| **Telegram Bot API** | Локальные уведомления о создании задач через Telegram-бота | **Внедрено** (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `GET/PATCH/DELETE /api/connectors`) |
| **Slack, Notion, GitHub, Discord…** | [Коннекторы](#glossary-connectors) — будущие уведомления и синхронизация | **Запланировано** (каталог UI готов, OAuth позже) |

---

## 8. Модель данных

Ниже — сущности из `backend/prisma/schema.prisma`. В UI термин
**[workspace](#glossary-workspace)** = **проект** (публичный ключ вида `K-XXXXXX`).

**[`user`](#glossary-user)**

| Сущность                  | Ключевые поля                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `users`                   | `id`, имя, e-mail, хэш пароля, `created_at`                                                      |
| `workspaces`              | `id`, `public_key`, `user_id` (владелец), название, `created_at`                                 |
| `workspace_members`       | `workspace_id`, `user_id`, `role` (`OWNER` … `VIEWER`), `joined_at`                              |
| `workspace_invites`       | код приглашения, `workspace_id`, роль, `expires_at`, лимит использований                         |
| `workspace_member_invites`| персональный инвайт: `invitee_id`, `invited_by`, `status` (`PENDING` / `ACCEPTED` / `DECLINED`)  |
| `tasks`                   | `id`, `workspace_id`, заголовок, описание, `status`, `start_date`, `due_date`, `tags`, `sort_order`, `created_at` |
| `subtasks`                | `id`, `task_id`, заголовок, `status`, опционально `user_id`                                      |
| `task_activity`           | `id`, `task_id`, `type`, заголовок, `body`, `metadata` (ветки через `parentActivityId`)          |
| `task_status_history`     | `id`, `task_id`, `from_status`, `to_status`, `user_id`, `changed_at` — хронология смен статуса задачи |
| `user_llm_keys`           | пользовательские ключи LLM: `label`, `api_key`, `key_hint`, `is_active`                          |
| `user_connectors`         | подключения внешних сервисов: `user_id`, `connector_id`, `enabled`, `created_at`, `updated_at`   |

---

## 9. Концептуальная схема связей ([ER](#glossary-er))

```mermaid
erDiagram
  users ||--o{ workspaces : owns
  users ||--o{ workspace_members : "member of"
  workspaces ||--o{ workspace_members : has
  workspaces ||--o{ workspace_invites : "link invites"
  workspaces ||--o{ workspace_member_invites : "direct invites"
  workspaces ||--o{ tasks : contains
  tasks ||--o{ subtasks : has
  tasks ||--o{ task_activity : logs
  tasks ||--o{ task_status_history : "status changes"
  users ||--o{ task_activity : authors
  users ||--o{ task_status_history : "changed by"
  users ||--o{ user_llm_keys : stores
  users ||--o{ user_connectors : configures
```

---

## 10. Архитектура

```mermaid
flowchart TB
  subgraph FE["Клиент"]
    direction TB
    FE_STACK["React + TypeScript + Vite"]
    FE_QUERY["TanStack Query — entities/*/model"]
    FE_STATE["Zustand — auth, UI; useState — bulk-выбор задач"]
    FE_STACK --> FE_QUERY
    FE_STACK --> FE_STATE
  end

  subgraph BE["Сервер — Node.js + Fastify"]
    direction TB
    BE_MW["JWT auth plugin, CORS"]
    BE_API["Маршруты /api/*"]
    BE_ORM["Prisma Client"]
    BE_AI["AI + MCP tools"]
    BE_CONNECTORS["Connectors service"]
    BE_MW --> BE_API
    BE_API --> BE_ORM
    BE_API --> BE_AI
    BE_API --> BE_CONNECTORS
  end

  DB[(PostgreSQL)]
  LLM["OpenAI-compatible LLM — AI-компаньон"]
  MCP["stdio MCP server — npm run mcp"]
  TG["Telegram Bot API"]

  FE -->|"HTTP REST JSON"| BE
  BE_ORM --> DB
  BE_AI -.-> LLM
  MCP -->|"REST + JWT"| BE_API
  BE_CONNECTORS -.-> TG
```

**Слой данных на фронтенде.** HTTP-вызовы — в `frontend/src/api/`. Серверное состояние — [TanStack Query](#glossary-tanstack-query) (`shared/api/query-keys.ts`, хуки в `entities/*/model` и `frontend/src/hooks`). UI-состояние (выбор задач, модалки, вкладки страниц) — `useState` / [Zustand](#glossary-zustand), не в типах [API](#glossary-api). Подробнее: [`frontend/src/api/README.md`](frontend/src/api/README.md).

---

## 11. Жизненный цикл задачи

В БД и UI используются статусы из `TaskStatus` (Prisma):

| Статус     | Метка в UI   |
| ---------- | ------------ |
| `TODO`     | В очереди    |
| `DONE`     | Готово       |
| `DEFERRED` | Отложено     |
| `ISSUES`   | Проблемы     |

```mermaid
stateDiagram-v2
    [*] --> TODO: Задача создана
    TODO --> DONE: Выполнена
    TODO --> DEFERRED: Отложена
    TODO --> ISSUES: Есть проблемы
    DEFERRED --> TODO: Вернули в работу
    ISSUES --> TODO: Проблема решена
    DONE --> TODO: Переоткрыта
    DONE --> [*]
```

---

## 12. Клиентские пути

**1. Первый контакт.** Пользователь открывает лендинг — hero, блок «О Kono», секции **MCP** и **коннекторы**, карусель «Собрано» ([bento](#glossary-bento)-карточки фич), прокручиваемые демо-видео (`DemoScrollShowcase`). Из шапки или CTA — регистрация или вход.

**2. Основная работа.** После авторизации пользователь открывает сессию и проект ([workspace](#glossary-workspace)). Создаёт задачи с датами начала и дедлайном. Переключает вид: **список**, **«Даты»** или **[канбан](#glossary-kanban)**. В «Датах» сверху — обзор по срокам (слева срочнее, справа дальше), ниже — лента глав с карточками; всё считается **от календарного «сегодня»** на клиенте.

**3. Работа с компаньоном.** В сайдбаре или плавающей панели открывает чат. При необходимости включает **MCP** под полем ввода — модель вызывает tools Kono (создать задачу, сменить статус, подзадачи, комментарий, поиск). Ключ LLM с поддержкой tools — в **API ключах**.

**4. Коннекторы.** В разделе `/projects/connectors` пользователь открывает каталог, подключает Telegram, включает или выключает уведомления switch-переключателем, удаляет подключение через меню карточки. Вкладка **«Документация»** описывает локальную настройку BotFather, `chat_id`, env и API.

**5. Личный кабинет.** В `/projects/settings` пользователь редактирует имя и email (сохранение на сервер), меняет пароль, настраивает in-app уведомления, выходит из сессии или удаляет аккаунт. API ключи LLM — на отдельной странице `/projects/api-keys`.

**6. Карточка задачи.** Открывает детали: заголовок, подзадачи, свойства. Внизу — секция **«Комментарии»**: корневой composer для новых сообщений; ниже лента событий и комментариев с ветками ответов. Кнопка **«Ответить»** открывает поле ввода прямо под сообщением; ветки со счётчиком **«ответов N»** можно сворачивать и разворачивать.

**7. Командная работа.** Приглашает коллег по ссылке, работает с участниками проекта, обсуждает задачи в комментариях и следит за активностью через уведомления. *([Спринты](#glossary-sprint) — в планах, пока не реализованы.)*

**8. Администратор.** Раздел `/projects/admin`: сводка платформы, список пользователей с удалением, [feature flags](#glossary-feature-flags), журнал ошибок. *(Браузер всех проектов — не реализован.)*

**Побочный путь.** Пользователь вводит несуществующий URL — видит страницу 404 с иллюстрацией и кнопками возврата на главную или в проекты.

### Виды задач в сессии

Toolbar задач в шапке страницы (`SessionTasksPageHeader` → `WorkspaceTaskSettingsButton` в `Workspacetasksubheader.tsx`): **Фильтр** · **Сортировка** · **Настройки** (внутри — переключатель вида **Список** · **Даты** · **Канбан**). Сортировка — `frontend/src/pages/session/lib/sort-tasks.ts`. Реализация видов: `frontend/src/pages/session/ui/tasks/`.

| Вид (`TasksView`) | Компонент | Назначение |
| ----------------- | --------- | ---------- |
| `line` | `WorkspaceListView` + `TaskRow` | Плотный список: статус, приоритет, дата **создания**, создатель (аватар); дедлайны только в «Датах» и карточке; [bulk](#glossary-bulk)-выбор |
| `timeline` | `TaskTimeline` | План по срокам **относительно сегодня** (см. ниже) |
| `kanban` | `WorkspaceKanbanView` | Колонки по статусам `TODO`, `ISSUES`, `DEFERRED`, `DONE` |

**Вид «Даты» — привязка к «сегодня».** На клиенте фиксируется начало текущих суток (`00:00` локального времени). Для каждой задачи берётся опорная дата: `dueDate`, иначе `startDate`. Группы:

| Группа | Условие |
| ------ | ------- |
| Просрочено | есть `dueDate`, статус не `DONE`, дата &lt; сегодня |
| Сегодня | опорная дата = сегодня |
| Завтра | опорная дата = сегодня + 1 день |
| На этой неделе | позже завтра, но не позже конца текущей календарной недели (воскресенье) |
| Позже | всё что дальше по календарю |
| Без даты | нет ни `startDate`, ни `dueDate` |

Сверху — **обзор по срокам**: блоки с названиями групп и счётчиками (не календарная сетка); клик прокручивает к соответствующей главе. Ниже — вертикальная ось с карточками задач. Стили — [Tailwind CSS](#glossary-tailwind-css).

**Канбан.** Колонки и карточки с ключом `K-XXXXXX`, статусом и приоритетом. **[Drag-and-drop](#glossary-drag-and-drop)** между колонками — `@dnd-kit` в `WorkspaceKanbanView.tsx` (смена статуса через [API](#glossary-api)).

### Карточка задачи — комментарии и [activity](#glossary-activity)

Экран деталей: `TaskDetailsPage` → `task-details/TaskDetailsMain.tsx`. Лента и UI комментариев вынесены в отдельные модули внутри `pages/session/ui/tasks/`:

| Модуль | Назначение |
| ------ | ---------- |
| `task-feed/` | `buildActivityFeed` — дерево корневых записей и ответов; форматирование дат |
| `task-activity/` | Секция «Комментарии»: timeline, ветки, композer, inline-ответ |
| `task-details/` | Шапка, подзадачи, свойства, **история статуса**; оркестрация данных и мутаций |

**Поведение секции «Комментарии»**

| Элемент | Описание |
| ------- | -------- |
| Корневой композer | Поле «Оставить комментарий…» над лентой — только новые сообщения верхнего уровня |
| Лента | Системные события и комментарии в одном потоке; у корневых записей — вертикальная ось с иконками |
| **Ответить** | Inline-поле под выбранным сообщением или событием (Enter — отправить, Esc — закрыть) |
| Ветки ответов | Вложенность через `parentActivityId`; короткий L-коннектор от родителя к ответу |
| Сворачивание | Плашка **«ответов N»** — клик скрывает или показывает всю ветку |

Отдельная боковая панель чата у карточки задачи **убрана** — всё обсуждение в одной секции.

---

## 13. Функциональные требования [MoSCoW](#glossary-moscow)

| Категория          | Что входит                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Must**           | Регистрация и вход, [CRUD](#glossary-crud) задач и проектов, [канбан](#glossary-kanban) по статусам, инвайты в команду, роли [user](#glossary-user)/[admin](#glossary-admin), личный кабинет, [pagination](#glossary-pagination) и поиск, [API](#glossary-api) + БД для всего ядра           |
| **Should**         | AI-компаньон с контекстом задач, история статусов, подзадачи, [спринты](#glossary-sprint), [in-app](#glossary-in-app) уведомления в проекте, админ-панель                                               |
| **Could**          | [Command palette](#glossary-command-palette) / глобальный поиск, [keyboard shortcuts](#glossary-keyboard-shortcuts) — **реализовано**                                                                                     |
| **Фактически в проекте** | [JWT](#glossary-jwt), [CRUD](#glossary-crud) ядра, [kanban](#glossary-kanban), три вида задач, история статусов, поиск, горячие клавиши, in-app уведомления, **личный кабинет** (профиль, смена пароля, удаление аккаунта), LLM-ключи, админка, Swagger, Docker Compose, лендинг с демо; **[MCP](#glossary-mcp) tool calling** (12 tools), **stdio MCP-сервер**, docs-view API ключей / MCP / коннекторов, **каталог коннекторов**, **Telegram-коннектор** с включением/выключением/удалением, обновлённый лендинг |

**Ограничения текущей версии:** спринты, назначение исполнителя из команды, OAuth-коннекторы и индивидуальная привязка Telegram через `/start token`, email-уведомления, [push](#glossary-push) от действий других участников, [pagination](#glossary-pagination) списка задач, браузер всех проектов в админке и автотесты.

---

## 14. Пользовательские сценарии

1. Как **пользователь**, я хочу **зарегистрироваться и войти**, чтобы **мои проекты и задачи сохранялись между сессиями**.
2. Как **пользователь**, я хочу **создать проект и пригласить команду**, чтобы **работать над задачами совместно**.
3. Как **пользователь**, я хочу **создавать задачи с приоритетом, дедлайном и полем «создатель» (текст)**, чтобы **команда понимала что и когда нужно сделать** *(назначение исполнителя из команды — не реализовано)*.
4. Как **пользователь**, я хочу **смотреть задачи на [канбан](#glossary-kanban)-доске по статусам**, чтобы **видеть прогресс работы визуально**.
5. Как **пользователь**, я хочу **открыть вид «Даты» и сразу понять что срочно сегодня**, чтобы **не разбирать календарь вручную**.
6. Как **пользователь**, я хочу **спросить компаньона что делать сегодня**, чтобы **не тратить время на разбор [бэклога](#glossary-backlog)**.
7. Как **пользователь**, я хочу **попросить компаньона разбить задачу или создать её через MCP**, чтобы **не заполнять формы вручную** *(нужна LLM с tool calling и ключ в API ключах)*.
8. Как **пользователь**, я хочу **видеть [in-app](#glossary-in-app) уведомления** (история своих [toast](#glossary-toast) в колокольчике + входящие инвайты в проект), чтобы **не терять важные события без перезагрузки страницы** *([push](#glossary-push) от действий других участников — не реализовано)*.
9. Как **пользователь**, я хочу **оставлять комментарии и отвечать в ветках под задачей**, чтобы **обсуждение не терялось отдельно от истории изменений**.
10. Как **пользователь**, я хочу **подключить Telegram и управлять уведомлениями по задачам**, чтобы **получать локальные уведомления от бота и при необходимости временно выключать или удалять подключение**.
11. Как **[администратор](#glossary-admin)**, я хочу **управлять пользователями** (список, удаление с подтверждением) **и видеть сводку по платформе**, чтобы **контролировать платформу без доступа к БД** *(полный браузер всех проектов — не реализован)*.

---

## 15. План работ

```
Неделя  │ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │ 9  │ 10 │
────────────────────────────────────────────────────────────────
Проект. │████│████│    │    │    │    │    │    │    │    │
Бэкенд  │    │░░░░│████│████│    │    │    │    │    │    │
Фронтенд│    │    │░░░░│████│████│████│    │    │    │    │
AI + инт│    │    │    │    │    │░░░░│████│    │    │    │
Финал   │    │    │    │    │    │    │    │████│████│████│

████ — активная разработка    ░░░░ — подготовка / старт
```

<details>
<summary><b>1. Проектирование</b> — <i>до 5 мая</i></summary>

- [x] Идея и целевая аудитория
- [x] User stories по ролям
- [x] Сущности и связи
- [x] ER-диаграмма
- [x] Перечень экранов и клиентских путей
- [x] Приоритеты по [MoSCoW](#glossary-moscow)
- [x] [Wireframes](#glossary-wireframes) в Figma (дашборд, канбан, карточка задачи)
- [x] Спецификация [REST](#glossary-rest) [API](#glossary-api) — интерактивная в [Swagger](#glossary-swagger) UI (`/docs`); отдельный статичный документ не ведётся
- [x] Структура каталогов frontend / backend

</details>

<details>
<summary><b>2. Бэкенд — ядро</b> — <i>до 26 мая</i></summary>

- [x] [Fastify](#glossary-fastify) в `backend/src/index.ts`, роуты под `/api`
- [x] [Prisma](#glossary-prisma) + [PostgreSQL](#glossary-postgresql), миграции
- [x] Регистрация, вход, [JWT](#glossary-jwt)
- [x] [CRUD](#glossary-crud): проекты, задачи, подзадачи, activity
- [x] Участники workspace, инвайты, роли
- [x] Team API
- [x] Глобальный поиск `GET /api/search` (проекты и задачи по названию)
- [x] OpenAPI response-схемы согласованы с реальными DTO (исправлены 500 на сериализации)
- [x] Фильтр списка задач по статусу (`GET /tasks?workspaceId=&status=`)
- [x] История статусов задач (`task_status_history`, `GET /tasks/:taskId/status-history`, запись при create/update)
- [x] Коннекторы: таблица `user_connectors`, `GET /api/connectors`, `PATCH /api/connectors/:id`, `DELETE /api/connectors/:id`
- [x] Профиль пользователя: `PATCH /api/users/me`, смена пароля `PATCH /api/users/me/password`, удаление `DELETE /api/users/me`
- [x] [Swagger](#glossary-swagger) / [OpenAPI](#glossary-openapi) UI (`/docs`)

</details>

<details>
<summary><b>3. Фронтенд — основные экраны</b> — <i>до 9 июня</i></summary>

- [x] Сессия: проекты ([workspaces](#glossary-workspace)), список задач, карточка задачи
- [x] Подзадачи, activity, свойства задачи
- [x] Совместная работа: участники, входящие инвайты
- [x] [TanStack Query](#glossary-tanstack-query) для серверных данных (tasks, subtasks, activity, workspaces, members)
- [x] Разбиение экрана задачи: `task-details/`, `task-activity/`, `task-feed/` ([FSD](#glossary-fsd) внутри pages)
- [x] Секция «Комментарии» в карточке задачи: единая лента activity + комментарии, ветки ответов, inline-ответ, сворачивание веток
- [x] Три вида задач: список, «Даты» (`TaskTimeline`, группы от **сегодня**), [канбан](#glossary-kanban) (`WorkspaceKanbanView`)
- [x] [Kanban](#glossary-kanban) [drag-and-drop](#glossary-drag-and-drop) между колонками (`@dnd-kit`, смена статуса через [API](#glossary-api))
- [x] Глобальный поиск: `SearchBar` + CommandDialog, [debounce](#glossary-debounce) 350 ms, `Ctrl+K`
- [x] [Горячие клавиши](#glossary-keyboard-shortcuts) сессии: `Ctrl+B` сайдбар, `Ctrl+N` новая задача, `Ctrl+J` Kono AI
- [x] [In-app](#glossary-in-app) уведомления: колокольчик (`NotifysCenter`), переключатели в настройках (`useNotificationPrefsStore`)
- [x] Фильтр по статусу (сервер + toolbar «Фильтрация», все 4 статуса + «Все задачи»), [bulk](#glossary-bulk)-удаление и смена статуса выбранных
- [x] Сортировка задач на клиенте: по дате создания и названию, asc/desc (`sort-tasks.ts`, toolbar «Сортировка»)
- [x] Обзор задач: [hub](#glossary-hub) проектов (`WorkspaceHubPicker`), список / «Даты» / [kanban](#glossary-kanban) внутри workspace
- [x] Страница настроек и [LLM](#glossary-llm)-ключей (`AccountSettingsPage`, `LlmKeysPage`); личный кабинет: редактирование профиля с сохранением на сервер (`PATCH /api/users/me`), смена пароля (`ChangePasswordDialog`, `PATCH /api/users/me/password`)
- [x] Удаление аккаунта с подтверждением пароля (`DELETE /api/users/me`)
- [x] Страница статуса сервисов (`SystemStatusPage`)
- [x] Лендинг: демо-видео, [bento](#glossary-bento)-карточки; секции **MCP**, **коннекторы**, обновлённая карусель «Собрано»
- [x] Страницы **LLM-ключей** и **MCP** с docs-view, TOC, переключателем раздела в шапке сессии
- [x] **Коннекторы** в сайдбаре (`ConnectorsPage`, каталог с иконками, docs-view, управление Telegram)
- [x] Офлайн / потеря связи: `ConnectionEmptyState`, TanStack Query `networkMode: offlineFirst` ([offline-first](#glossary-offline-first))
- [x] Рефактор страницы задач: `use-session-tasks-page.ts`, `SessionTasksPageHeader`, `SessionTasksMainContent`
- [x] История статуса в карточке задачи (`TaskStatusHistoryTimeline`, секция «История статуса»)

</details>

<details>
<summary><b>4. AI-компаньон и интеграции</b> — <i>до 20 июня</i></summary>

- [x] Локальная [LLM](#glossary-llm) ([LM Studio](#glossary-lm-studio) и др.), эндпоинт `/api/ai/chat`
- [x] Панель Kono AI (`AssistantFloatingPanel`, [`withTask`](#glossary-withtask), меню MCP tools)
- [x] **[MCP tool calling](#glossary-mcp)** в чате: 12 tools (`kono-tools.ts`)
- [x] **Внешний MCP stdio-сервер** (`backend/mcp-server`, `npm run mcp`, JWT в `KONO_API_KEY`)
- [x] Страницы **API ключей** и **MCP** в сессии: обзор + docs-view, TOC
- [x] **Коннекторы** — каталог `/projects/connectors`, вкладка документации, секция на лендинге
- [x] **Telegram-коннектор** — локальные уведомления о создании задач, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_PROXY`, управление подключением через UI/API
- [x] **Лендинг** — секции MCP / коннекторы, двухколоночный блок, карусель «Собрано»
- [x] Админ-панель (`/admin`): overview, users, **удаление пользователей** (`DELETE /admin/users/:userId`), error logs, [feature flags](#glossary-feature-flags)

</details>

<details>
<summary><b>5. Финализация</b> — <i>до 1 июля</i></summary>

- [ ] Тесты: критичные сервисы
- [x] [Docker Compose](#glossary-docker-compose): frontend, backend, [PostgreSQL](#glossary-postgresql)
- [x] Обработка ошибок [API](#glossary-api), [toast](#glossary-toast)-уведомления, [empty states](#glossary-empty-state) (`EmptySession`)
- [x] [Скелетоны](#glossary-skeleton) загрузки (задачи, проекты, участники, админка, карточка задачи, LLM-ключи)
- [x] README с инструкцией локального запуска ([Docker Compose](#glossary-docker-compose) + dev); документ поддерживается

</details>

---

## 16. Локальный запуск

### Требования

- **Node.js** LTS — для frontend и backend
- **[PostgreSQL](#glossary-postgresql)** — локально или через [Docker](#glossary-docker)
- **Docker Desktop** (опционально) — для запуска всего стека одной командой

### [Docker Compose](#glossary-docker-compose)

Самый быстрый способ поднять проект целиком:

```bash
git clone https://github.com/Shadowgraph-1/project-K.git
cd project-K

# скопируй и заполни JWT_SECRET, POSTGRES_PASSWORD, ADMIN_EMAILS
cp .env.example .env

docker compose up --build
```

| Сервис   | URL                         |
| -------- | --------------------------- |
| Frontend | http://localhost:4173       |
| API      | http://localhost:3000/api   |
| Swagger  | http://localhost:3000/docs  |
| Postgres | localhost:5433 (логин/пароль из `.env`) |

> **Два режима разработки:** `docker compose up` — своя БД в контейнере (порт **5433** на хосте). `npm run dev` в `backend/` — твой локальный Postgres на **5432** через `backend/.env`. Так они не мешают друг другу.

Frontend в Docker — **[Nginx](#glossary-nginx)** со [SPA](#glossary-spa) fallback и прокси `/api/` на backend. [LM Studio](#glossary-lm-studio) на хосте доступен backend-контейнеру через `host.docker.internal` (см. `.env.example`).

### Frontend

```bash
git clone https://github.com/Shadowgraph-1/project-K.git
cd project-K/frontend
npm install
npm run dev
```

Приложение: http://localhost:5173  
API по умолчанию: `http://localhost:3000/api` (см. `frontend/src/api/client.ts`).

### Backend

```bash
cd backend
npm install

npm run db:generate
npm run db:migrate

npm run dev
```

API слушает **порт 3000**.

### Endpoints

| Назначение          | URL                                |
| ------------------- | ---------------------------------- |
| Frontend (Vite dev) | http://localhost:5173              |
| Frontend (Docker)   | http://localhost:4173              |
| API                 | http://localhost:3000/api          |
| Health              | http://localhost:3000/api/health   |
| Swagger UI          | http://localhost:3000/docs         |

### [Swagger](#glossary-swagger) — документация [API](#glossary-api)

Интерактивная документация на русском: **http://localhost:3000/docs**

1. Открой `/docs` в браузере — вверху будет введение с терминами, кодами ошибок и быстрым стартом.
2. Разверни **Авторизация** → `POST /api/auth/login` (или register) → **Try it out** → выполни запрос.
3. Скопируй `token` из ответа.
4. Нажми **Authorize** (замок) → вставь `Bearer <token>` → **Authorize**.
5. Вызывай любые защищённые методы — [JWT](#glossary-jwt) подставится автоматически.

Разделы в Swagger:

| Раздел | Содержимое |
| ------ | ---------- |
| Авторизация | Регистрация, вход |
| Пользователь | `PATCH /api/users/me` (профиль), `PATCH /api/users/me/password`, `DELETE /api/users/me` |
| Состояние сервисов | Health API / БД / LLM |
| Проекты | CRUD workspace |
| Участники | Команда, инвайты, роли |
| Задачи · Подзадачи · Комментарии | Основная работа с задачами |
| Поиск | `GET /api/search` — проекты и задачи |
| AI-компаньон | `POST /api/ai/chat` |
| LLM-ключи | Личные ключи [OpenAI-compatible](#glossary-openai-compatible) |
| Коннекторы | `GET /api/connectors`, `PATCH /api/connectors/:id`, `DELETE /api/connectors/:id` |
| Администрирование | Только для `ADMIN_EMAILS`: overview, users, `DELETE /admin/users/:userId`, error logs, feature flags |

У каждого метода есть краткий **summary**, описание на русском и схемы полей запроса/ответа.

### Переменные окружения

**Frontend** (`frontend/.env`, опционально):

```env
VITE_API_URL=http://localhost:3000/api
```

**Backend** (`backend/.env`):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/kono
JWT_SECRET=your_secret_key_min_32_chars

# AI (LM Studio по умолчанию на localhost:1234)
LM_BASE_URL=http://localhost:1234/v1
LM_API_KEY=lm-studio
LM_MODEL=your-model-id

# Админы платформы (e-mail через запятую)
ADMIN_EMAILS=admin@example.com

# MCP stdio-сервер — см. [§17 Настройка MCP](#17-настройка-mcp)
KONO_API_URL=http://localhost:3000/api
KONO_API_KEY=

# Telegram-коннектор — см. [§18 Настройка коннекторов](#18-настройка-коннекторов)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_PROXY=
```

**Корень репозитория** (`.env` только для `docker compose up`, не для продакшена):

```env
POSTGRES_USER=kono
POSTGRES_PASSWORD=kono
POSTGRES_DB=kono
POSTGRES_HOST_PORT=5433

JWT_SECRET=
LM_BASE_URL=http://host.docker.internal:1234/v1
LM_API_KEY=lm-studio
LM_MODEL=gemma-4-e4b-it
ADMIN_EMAILS=
```

---

## 17. Настройка MCP

[MCP](#glossary-mcp) (Model Context Protocol) даёт AI доступ к Kono: **12 одинаковых tools** в чате приложения и во внешних клиентах (Cursor, Claude Desktop, Windsurf). Настройка — в два независимых сценария.

### MCP в чате Kono AI

1. **LLM с tool calling** — добавьте ключ провайдера в **Настройки → API ключи** (`/projects/api-keys`). Подходят OpenRouter, Groq, LM Studio, Together AI и другие модели с вызовом функций (см. [mcp-llm-sources.ts](frontend/src/shared/config/mcp-llm-sources.ts)).
2. **Активируйте ключ** — один ключ может быть активным для чата.
3. Откройте **Kono AI** (`Ctrl+J` или плавающая панель на странице задач).
4. Включите **MCP** кнопкой под полем ввода.
5. В меню MCP выберите, какие **tools** разрешены (по умолчанию все 12; выбор сохраняется в `localStorage`).

Модель сама вызывает `list_projects`, `create_task`, `search_kono` и др. — UUID из контекста UI или из результатов tools, без ручного копирования в промпт.

### Внешний stdio-сервер

Для Cursor / Claude Desktop / других MCP-хостов — локальный процесс в `backend/mcp-server`:

**1. JWT пользователя**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"your-password"}'
```

Из ответа возьмите поле `token`.

**2. Переменные в `backend/.env`**

```env
KONO_API_URL=http://localhost:3000/api
KONO_API_KEY=<token из login>
```

**3. Запуск сервера**

```bash
cd backend
npm run mcp
```

**4. Конфиг MCP-клиента** (пример для Cursor / Claude Desktop):

```json
{
  "mcpServers": {
    "kono": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": "<абсолютный-путь>/project-K/backend",
      "env": {
        "KONO_API_URL": "http://localhost:3000/api",
        "KONO_API_KEY": "<token из POST /auth/login>"
      }
    }
  }
}
```

Backend API при этом должен быть запущен (`npm run dev` в `backend/`).

### Инструменты (tools)

| Категория | Tools |
| --------- | ----- |
| Проекты | `list_projects`, `create_project` |
| Задачи | `list_tasks`, `create_task`, `update_task`, `delete_task` |
| Подзадачи | `list_subtasks`, `create_subtask`, `update_subtask`, `delete_subtask` |
| Комментарии | `add_task_comment` |
| Поиск | `search_kono` |

Полные описания — в [mcp-tools.ts](frontend/src/shared/config/mcp-tools.ts). Удаление (`delete_task`, `delete_subtask`) помечено как destructive — только по явной просьбе пользователя.

### Документация в приложении

| Раздел | URL |
| ------ | --- |
| Обзор MCP | `/projects/mcp` |
| Документация (TOC, примеры JWT, конфиг) | `/projects/mcp?view=docs` |
| API ключи | `/projects/api-keys` |

В шапке страниц MCP, API ключей и коннекторов доступен переключатель разделов (обзор / каталог / документация — в зависимости от страницы).

---

## 18. Настройка коннекторов

Коннекторы предназначены для связи Kono с внешними сервисами. В текущей реализации полностью подключён локальный **Telegram-коннектор** для уведомлений о создании задач. Остальные сервисы представлены в каталоге как подготовленные направления интеграций.

### Telegram-коннектор

Локальная схема работы:

1. Backend получает событие создания задачи.
2. `tasks.service.ts` вызывает `notifyTelegramForUser(userId, ...)`.
3. `telegram.service.ts` проверяет, включён ли коннектор у пользователя через `user_connectors`.
4. Если подключение установлено и включено, backend отправляет сообщение в Telegram Bot API методом `sendMessage`.

Требуемые переменные в `backend/.env`:

```env
TELEGRAM_BOT_TOKEN=<token из BotFather>
TELEGRAM_CHAT_ID=<chat_id личного чата с ботом>

# опционально, если Node.js не может подключиться к api.telegram.org напрямую
TELEGRAM_PROXY=http://127.0.0.1:10809
```

Быстрая проверка Telegram API:

```powershell
Invoke-RestMethod "https://api.telegram.org/bot<TOKEN>/getMe"
Invoke-RestMethod "https://api.telegram.org/bot<TOKEN>/getUpdates"
```

Для получения `chat_id` пользователь должен открыть бота в Telegram и отправить `/start`. После этого в ответе `getUpdates` используется поле `message.chat.id`.

### Управление подключением

В интерфейсе `/projects/connectors` реализованы два режима:

| Режим | Назначение |
| ----- | ---------- |
| **Каталог** | список доступных и будущих коннекторов, подключение Telegram |
| **Документация** | инструкции по BotFather, `chat_id`, env, API и типичным ошибкам |

Состояния Telegram-коннектора:

| Поле | Значение |
| ---- | -------- |
| `configured` | сервер настроен: есть `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` |
| `installed` | пользователь подключил коннектор; запись есть в `user_connectors` |
| `enabled` | уведомления включены; switch на карточке активен |

Поведение UI:

- **Подключить** — создаёт запись в `user_connectors` и включает Telegram.
- **Switch** — включает или выключает уведомления, не удаляя подключение.
- **⋮ → Удалить** — удаляет подключение; карточка возвращается в доступные.

### API коннекторов

Все методы защищены JWT и работают для текущего пользователя.

| Метод | Назначение |
| ----- | ---------- |
| `GET /api/connectors` | список поддерживаемых коннекторов и их состояния |
| `PATCH /api/connectors/:id` | включение / выключение уведомлений (`{ "enabled": true/false }`) |
| `DELETE /api/connectors/:id` | удаление подключения коннектора |

Пример включения Telegram:

```http
PATCH /api/connectors/telegram
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "enabled": true
}
```

Пример удаления подключения:

```http
DELETE /api/connectors/telegram
Authorization: Bearer <JWT>
```

### Документация в приложении

| Раздел | URL |
| ------ | --- |
| Каталог коннекторов | `/projects/connectors` |
| Документация коннекторов | `/projects/connectors?view=docs` |

Ограничение текущей версии: Telegram работает как локальная интеграция на один `TELEGRAM_CHAT_ID`. Полноценная пользовательская привязка через `/start token`, хранение индивидуальных `chat_id` и OAuth-потоки для других сервисов запланированы как следующий этап.

---

## 19. Структура репозитория

```text
project-K/
├── docker-compose.yml              # db + backend + frontend (nginx)
├── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/                    # Axios-клиент, REST-модули (без React)
│   │   ├── app/                    # App, провайдеры (QueryClient)
│   │   ├── entities/               # Домен: типы, query-хуки, UI сущностей
│   │   │   ├── task/model/         # useTasksQuery, useTaskActivityQuery, handlers
│   │   │   ├── subtask/model/      # useSubtasksQuery
│   │   │   ├── workspace/model/    # useWorkspaceQuery, members
│   │   │   ├── search/model/       # useSearchQuery
│   │   │   ├── user/               # useAuthStore, UserAvatar
│   │   │   ├── notification/       # useNotifys
│   │   │   └── session/            # reset-session-data
│   │   ├── features/               # auth, settings
│   │   ├── hooks/                  # app-level хуки (assistant, health, invites, connectors)
│   │   ├── pages/
│   │   │   ├── home/               # лендинг (McpHomeSection, ConnectorsHomeSection, DemoScrollShowcase)
│   │   │   ├── offline/            # ConnectionEmptyState
│   │   │   ├── not-found/          # страница 404
│   │   │   └── session/            # основное приложение
│   │   │       ├── lib/            # sort-tasks.ts, sessionWorkspaceUtils
│   │   │       ├── model/          # sessionPaths, assistant context
│   │   │       └── ui/
│   │   │           ├── tasks/      # список, даты, канбан, TaskDetailsPage
│   │   │           ├── admin/      # админ-панель
│   │   │           ├── settings/   # аккаунт, LLM-ключи, MCP (landing + docs)
│   │   │           ├── connectors/ # каталог, docs, Telegram connector UI
│   │   │           ├── system/     # статус сервисов
│   │   │           ├── members/
│   │   │           └── layout/
│   │   ├── shared/                 # UI-kit, query-keys, utils, permissions
│   │   │   ├── config/
│   │   │   │   ├── demo-videos.ts
│   │   │   │   ├── session-shortcuts.ts
│   │   │   │   ├── mcp-tools.ts
│   │   │   │   ├── mcp-clients.ts
│   │   │   │   ├── mcp-llm-sources.ts
│   │   │   │   └── connectors.ts
│   │   │   └── model/
│   │   │       └── useNotificationPrefsStore.ts  # prefs in-app уведомлений
│   │   └── widgets/                # header, footer, assistant
│   ├── public/
│   │   ├── connectors/             # SVG логотипы
│   │   ├── llm-providers/
│   │   ├── mcp-clients/
│   │   ├── demo/
│   │   └── readme_logo.jpg
│   ├── Dockerfile                  # nginx production image
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── Dockerfile
│   ├── prisma.config.ts            # конфиг Prisma CLI (корень backend/)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── generated/prisma/       # автоген (gitignore)
│   │   ├── openapi/                # routeSchema, responses для Swagger
│   │   ├── routes/                 # *.routes.ts — тонкий HTTP-слой (+ search.routes.ts)
│   │   ├── services/               # бизнес-логика
│   │   ├── mappers/                # Prisma row → API DTO
│   │   ├── schemas/                # Zod-валидация
│   │   ├── constants/              # статусы, типы activity
│   │   ├── plugins/                # JWT, error handler
│   │   ├── llm/                    # промпт и клиент LLM
│   │   ├── ai/                     # assistant-chat, kono-tools (MCP)
│   │   ├── utils/
│   │   ├── permissions.ts
│   │   ├── db/prisma.ts
│   │   └── index.ts
│   ├── mcp-server/                 # stdio MCP (npm run mcp)
│   └── package.json
│
├── .gitignore
└── README.md
```

| Путь | Назначение |
| ---- | ---------- |
| `frontend/src/api/` | Axios-клиент, вызовы REST API |
| `frontend/src/entities/*/model/` | TanStack Query: tasks, subtasks, activity, workspaces, members, search |
| `frontend/src/pages/session/lib/sort-tasks.ts` | Клиентская сортировка задач (дата создания / название) |
| `frontend/src/pages/session/ui/tasks/use-session-tasks-page.ts` | Состояние страницы задач: фильтр, сортировка, вид, bulk |
| `frontend/src/pages/session/ui/tasks/Workspacetasksubheader.tsx` | Toolbar: фильтр · сортировка · настройки вида |
| `frontend/src/pages/home/ui/sections/McpHomeSection.tsx` | Секция MCP на лендинге (агенты, LLM, tools) |
| `frontend/src/pages/home/ui/sections/ConnectorsHomeSection.tsx` | Секция коннекторов на лендинге |
| `frontend/src/pages/session/ui/settings/mcp/` | MCP: landing + docs, TOC, install blocks |
| `frontend/src/pages/session/ui/settings/AccountSettingsPage.tsx` | Личный кабинет: профиль, уведомления, безопасность |
| `frontend/src/pages/session/ui/settings/ChangePasswordDialog.tsx` | Диалог смены пароля |
| `frontend/src/pages/session/ui/settings/LlmKeysPage.tsx` | API ключи: таблица + docs |
| `frontend/src/pages/session/ui/connectors/ConnectorsPage.tsx` | Каталог коннекторов: подключение, switch, удаление |
| `frontend/src/pages/session/ui/connectors/ConnectorsDocsView.tsx` | Документация коннекторов в приложении |
| `frontend/src/api/connectors/` | REST-клиент коннекторов |
| `frontend/src/hooks/use-connectors-query.ts` | TanStack Query для `GET/PATCH/DELETE /api/connectors` |
| `frontend/src/widgets/assistant/ui/AssistantMcpMenu.tsx` | Переключатель MCP tools в чате |
| `backend/src/ai/kono-tools.ts` | 12 MCP tools для чата и сервера |
| `backend/src/routes/connectors.routes.ts` | API коннекторов (`GET/PATCH/DELETE /api/connectors`) |
| `backend/src/services/connectors.service.ts` | Состояние `installed/enabled/configured` для коннекторов |
| `backend/src/services/telegram.service.ts` | Отправка Telegram-уведомлений через Bot API |
| `backend/mcp-server/` | Внешний stdio MCP-сервер |
| `frontend/src/pages/home/ui/components/DemoScrollShowcase.tsx` | Блок демо-видео на лендинге |
| `frontend/src/pages/home/ui/components/HomeBentoCard.tsx` | [Bento](#glossary-bento)-карточки в секции фич |
| `frontend/src/pages/offline/ConnectionEmptyState.tsx` | UI при потере связи с API |
| `frontend/src/pages/session/ui/widgets/AssistantFloatingPanel.tsx` | Плавающая панель Kono AI |
| `frontend/src/pages/session/model/use-assistant-context.ts` | Контекст задач для AI (`withTask`) |
| `frontend/src/pages/session/ui/tasks/task-details/TaskStatusHistoryTimeline.tsx` | Timeline смен статуса в карточке задачи |
| `frontend/src/api/task-status-history/` | `GET /tasks/:taskId/status-history` |
| `frontend/src/pages/session/ui/admin/AdminUsersSection.tsx` | Таблица пользователей, удаление с confirm |
| `backend/src/services/task-status-history.service.ts` | Запись и чтение `task_status_history` |
| `backend/src/routes/task-status-history.routes.ts` | API истории статусов задачи |
| `backend/src/services/admin.service.ts` | `deleteAdminUser` — удаление пользователя админом |
| `frontend/src/shared/lib/require-admin.tsx` | Guard маршрута `/admin` |
| `frontend/src/pages/session/ui/tasks/` | Список, канбан, вид «Даты», `SessionTasksPage`, `WorkspaceTasksBlock` |
| `frontend/src/pages/session/ui/tasks/WorkspaceKanbanView.tsx` | [Канбан](#glossary-kanban) с [drag-and-drop](#glossary-drag-and-drop) (`@dnd-kit`) |
| `frontend/src/pages/session/ui/widgets/SearchBar.tsx` | Глобальный поиск ([Command palette](#glossary-command-palette), Ctrl+K) |
| `frontend/src/shared/config/session-shortcuts.ts` | Горячие клавиши сессии |
| `frontend/src/pages/session/ui/skeletons/session-skeletons.tsx` | Общие скелетоны загрузки сессии |
| `frontend/src/pages/session/ui/tasks/TaskTimeline.tsx` | Группировка задач по срокам относительно **сегодня** |
| `frontend/src/pages/session/ui/tasks/task-feed/` | Дерево activity: корни и ответы (`buildActivityFeed`) |
| `frontend/src/pages/session/ui/tasks/task-activity/` | UI секции «Комментарии»: timeline, ветки, inline-ответ, сворачивание |
| `frontend/src/pages/session/ui/tasks/task-details/` | Карточка задачи: main, header, subtasks, properties, оркестрация мутаций |
| `frontend/public/demo/` | Видео-демо для лендинга (`.webm`) |
| `frontend/src/shared/config/demo-videos.ts` | Пути и тексты для `DemoScrollShowcase` на главной |
| `frontend/src/shared/api/query-keys.ts` | Единые ключи кэша Query |
| `frontend/src/hooks/` | Хуки уровня приложения (не домен): health, assistant, invites, connectors |
| `backend/prisma/schema.prisma` | Модели БД и миграции |
| `backend/src/db/prisma.ts` | Инициализация Prisma Client |
| `backend/src/openapi/` | Zod → JSON Schema, Swagger UI на `/docs` |
| `docker-compose.yml` | Postgres + backend + frontend (nginx) |
| `frontend/src/api/README.md` | Query / [Zustand](#glossary-zustand) / logout |

---

## 20. Глоссарий

Англоязычные термины из README: **подчёркнутый моноширинный** текст — сам термин, средняя колонка — расшифровка, справа — как это у нас устроено. Ссылки в документе ведут сюда.

### Продукт и UX

| Термин | Расшифровка | По проекту |
| :----- | :---------- | :--------- |
| <a id="glossary-activity"></a> <ins>`activity`</ins> | активность, лента событий | Смена статуса, подзадачи, комментарии в `task_activity` |
| <a id="glossary-admin"></a> <ins>`admin`</ins> | administrator | Админ платформы: `/projects/admin`, e-mail в `ADMIN_EMAILS` |
| <a id="glossary-backlog"></a> <ins>`backlog`</ins> | очередь несделанного | Накопленные задачи; «разбор бэклога» — выбрать приоритет на сегодня |
| <a id="glossary-bento"></a> <ins>`bento`</ins> | bento grid | Сетка карточек на лендинге; компонент `HomeBentoCard` |
| <a id="glossary-bulk"></a> <ins>`bulk`</ins> | массово | Действия над несколькими выделенными задачами (удаление, статус) |
| <a id="glossary-botfather"></a> <ins>`BotFather`</ins> | официальный бот Telegram | Создаёт Telegram-бота и выдаёт `TELEGRAM_BOT_TOKEN` |
| <a id="glossary-connectors"></a> <ins>`connectors`</ins> | коннекторы, интеграции | Каталог сервисов: `/projects/connectors`, вкладка docs, Telegram-коннектор |
| <a id="glossary-mcp"></a> <ins>`MCP`</ins> | Model Context Protocol | 12 tools в чате Kono AI + stdio-сервер `npm run mcp` |
| <a id="glossary-drag-and-drop"></a> <ins>`drag-and-drop`</ins> | перетаскивание (DnD) | В канбане — перенос карточки между колонками, смена статуса |
| <a id="glossary-empty-state"></a> <ins>`empty state`</ins> | пустое состояние | Экран «нет данных» — `EmptySession`, `ConnectionEmptyState` |
| <a id="glossary-feature-flags"></a> <ins>`feature flags`</ins> | флаги функций | Переключатели в админке без отдельного деплоя |
| <a id="glossary-hub"></a> <ins>`hub`</ins> | центральный экран | Точка входа в раздел: hub проектов, hub участников |
| <a id="glossary-in-app"></a> <ins>`in-app`</ins> | внутри приложения | Колокольчик и toast; без email и push |
| <a id="glossary-kanban"></a> <ins>`kanban`</ins> | канбан-доска | Колонки по статусам; DnD меняет `TaskStatus` |
| <a id="glossary-keyboard-shortcuts"></a> <ins>`keyboard shortcuts`</ins> | горячие клавиши | Ctrl+K поиск, Ctrl+B сайдбар, Ctrl+N задача, Ctrl+J AI |
| <a id="glossary-push"></a> <ins>`push`</ins> | push-уведомления | Браузер/устройство; **в Kono не реализованы** |
| <a id="glossary-skeleton"></a> <ins>`skeleton`</ins> | скелетон | Серые заглушки UI, пока грузятся данные |
| <a id="glossary-sprint"></a> <ins>`sprint`</ins> | спринт, итерация | Фиксированный период задач; **пока не реализован** |
| <a id="glossary-timeline"></a> <ins>`timeline`</ins> | временная лента | Вид «Даты», история статуса в карточке |
| <a id="glossary-toast"></a> <ins>`toast`</ins> | всплывающий тост | Короткое уведомление в углу (Sonner) |
| <a id="glossary-tool-calling"></a> <ins>`tool calling`</ins> | вызов инструментов | LLM вызывает MCP tools Kono из чата (**реализовано**); нужна модель с tools |
| <a id="glossary-telegram-bot-api"></a> <ins>`Telegram Bot API`</ins> | API Telegram-ботов | Отправка уведомлений через `sendMessage`; локальная настройка через `TELEGRAM_CHAT_ID` |
| <a id="glossary-user"></a> <ins>`user`</ins> | пользователь | Обычная роль (не admin) |
| <a id="glossary-withtask"></a> <ins>`withTask`</ins> | with task context | Флаг AI-чата: модель видит задачи текущего проекта |
| <a id="glossary-workspace"></a> <ins>`workspace`</ins> | рабочее пространство | **Проект** в БД; ключ `K-XXXXXX` |
| <a id="glossary-wireframes"></a> <ins>`wireframes`</ins> | вайрфреймы | Чёрно-белые схемы экранов до финального UI |

### Архитектура и API

| Термин | Расшифровка | По проекту |
| :----- | :---------- | :--------- |
| <a id="glossary-api"></a> <ins>`API`</ins> | Application Programming Interface | HTTP-методы под `/api/*` |
| <a id="glossary-crud"></a> <ins>`CRUD`</ins> | Create · Read · Update · Delete | Базовые операции над сущностями |
| <a id="glossary-dto"></a> <ins>`DTO`</ins> | Data Transfer Object | Формат ответа API после маппинга из БД |
| <a id="glossary-er"></a> <ins>`ER`</ins> | Entity-Relationship | Схема связей таблиц (раздел 9) |
| <a id="glossary-fsd"></a> <ins>`FSD`</ins> | Feature-Sliced Design | Слои фронта: entities, features, pages… |
| <a id="glossary-health-check"></a> <ins>`health-check`</ins> | проверка здоровья | `GET /api/health` — API, БД, LLM |
| <a id="glossary-installed-enabled-configured"></a> <ins>`installed / enabled / configured`</ins> | состояния подключения | `installed` — подключён, `enabled` — уведомления включены, `configured` — backend env заполнен |
| <a id="glossary-jwt"></a> <ins>`JWT`</ins> | JSON Web Token | Токен после входа: `Authorization: Bearer …` |
| <a id="glossary-llm"></a> <ins>`LLM`</ins> | Large Language Model | Модель для AI-компаньона |
| <a id="glossary-moscow"></a> <ins>`MoSCoW`</ins> | Must · Should · Could · Won't | Приоритизация требований (раздел 13) |
| <a id="glossary-openai-compatible"></a> <ins>`OpenAI-compatible`</ins> | совместимость с OpenAI API | `/v1/chat/completions`; LM Studio и др. |
| <a id="glossary-openapi"></a> <ins>`OpenAPI`</ins> | спецификация REST API | Генерируется из Zod → Swagger `/docs` |
| <a id="glossary-pagination"></a> <ins>`pagination`</ins> | пагинация | Постраничная/курсорная подгрузка; для задач **ещё нет** |
| <a id="glossary-full-text"></a> <ins>`full-text`</ins> | полнотекстовый поиск | Поиск по содержимому, не только по заголовку |
| <a id="glossary-rbac"></a> <ins>`RBAC`</ins> | Role-Based Access Control | Роли в workspace: `OWNER` … `VIEWER` |
| <a id="glossary-rest"></a> <ins>`REST`</ins> | Representational State Transfer | HTTP API: GET / POST / PATCH / DELETE |
| <a id="glossary-spa"></a> <ins>`SPA`</ins> | Single Page Application | Навигация без полной перезагрузки страницы |

### Frontend

| Термин | Расшифровка | По проекту |
| :----- | :---------- | :--------- |
| <a id="glossary-axios"></a> <ins>`Axios`</ins> | HTTP-клиент | Запросы к API из `frontend/src/api/` |
| <a id="glossary-debounce"></a> <ins>`debounce`</ins> | задержка ввода | 350 ms перед запросом в глобальном поиске |
| <a id="glossary-offline-first"></a> <ins>`offline-first`</ins> | сначала офлайн | Кэш при потере сети: `networkMode: offlineFirst` |
| <a id="glossary-react"></a> <ins>`React`</ins> | библиотека UI | React 19 |
| <a id="glossary-react-router"></a> <ins>`React Router`</ins> | маршрутизация | `/`, `/login`, `/projects/*`… |
| <a id="glossary-shadcn-ui"></a> <ins>`shadcn/ui`</ins> | UI-кит | Компоненты на Radix UI + Tailwind |
| <a id="glossary-tailwind-css"></a> <ins>`Tailwind CSS`</ins> | utility-first CSS | Основная вёрстка и стили сессии |
| <a id="glossary-tanstack-query"></a> <ins>`TanStack Query`</ins> | серверный state | Кэш задач, проектов, activity, search… |
| <a id="glossary-typescript"></a> <ins>`TypeScript`</ins> | типизированный JS | Весь frontend |
| <a id="glossary-vite"></a> <ins>`Vite`</ins> | сборщик | Dev-сервер :5173, production build |
| <a id="glossary-zustand"></a> <ins>`Zustand`</ins> | client store | Auth, тема, prefs уведомлений |

### Backend, данные и инфраструктура

| Термин | Расшифровка | По проекту |
| :----- | :---------- | :--------- |
| <a id="glossary-docker"></a> <ins>`Docker`</ins> | контейнеризация | Образы frontend / backend |
| <a id="glossary-docker-compose"></a> <ins>`Docker Compose`</ins> | оркестрация контейнеров | `docker compose up` — весь стек |
| <a id="glossary-fastify"></a> <ins>`Fastify`</ins> | HTTP-фреймворк | Backend на Node.js, порт 3000 |
| <a id="glossary-lm-studio"></a> <ins>`LM Studio`</ins> | локальный LLM-сервер | OpenAI-compatible API, порт 1234 |
| <a id="glossary-nginx"></a> <ins>`Nginx`</ins> | веб-сервер | Production-frontend: статика + прокси `/api` |
| <a id="glossary-nodejs"></a> <ins>`Node.js`</ins> | среда выполнения JS | Backend |
| <a id="glossary-orm"></a> <ins>`ORM`</ins> | Object-Relational Mapping | Слой код ↔ SQL; у нас Prisma |
| <a id="glossary-postgresql"></a> <ins>`PostgreSQL`</ins> | СУБД | Основная база данных |
| <a id="glossary-prisma"></a> <ins>`Prisma`</ins> | ORM + миграции | `schema.prisma`, Prisma Client |
| <a id="glossary-swagger"></a> <ins>`Swagger`</ins> | UI документации API | Интерактивные методы на `/docs` |
| <a id="glossary-zod"></a> <ins>`Zod`</ins> | валидация схем | Входные данные routes + OpenAPI |

> [!NOTE]
> **Pre-release.** Документ находится в pre-release версии: описание может опережать или слегка отставать от кода до стабильного релиза. Актуальность: 04.07.2026. README отражает текущее состояние локальной разработки, включая личный кабинет, MCP, API-ключи, Telegram-коннектор и обновлённый лендинг.