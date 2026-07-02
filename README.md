<div align="center">

<a id="kono"></a>

<img src="./frontend/public/readme_logo.jpg" alt="Kono — K-Project" width="920">

**Таск-трекер с AI-компаньоном** — управление проектами и задачами для небольших команд.

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
- [17. Структура репозитория](#17-структура-репозитория)
- [18. Глоссарий](#18-глоссарий)
  - [Продукт и UX](#продукт-и-ux)
  - [Архитектура и API](#архитектура-и-api)
  - [Frontend](#frontend-1)
  - [Backend, данные и инфраструктура](#backend-данные-и-инфраструктура)

---

## 1. Концепция и проблематика

**Простыми словами.** Командам нужен инструмент который не мешает работать — без лишних кликов, без перегруженного интерфейса, без ощущения что ты один разбираешься в хаосе задач. **Kono** берёт привычную механику таск-трекера — проекты, [канбан](#glossary-kanban), [спринты](#glossary-sprint) — и добавляет **AI-компаньона** который знает все о твоем проекте ну или не все: он подсказывает что делать сегодня, разбивает сложные задачи на шаги и отвечает оперативно отвечает.

**Какую боль закрывает продукт.** Обычный таск-трекер хранит задачи, но не помогает с ними работать. Непонятно за что браться, сложно декомпозировать большую задачу, контекст теряется в комментариях. Kono снижает этот порог за счёт **AI-компаньона с доступом к задачам**, **истории статусов**, **прозрачности для всей команды** и **уведомлений** когда что-то меняется без твоего участия.

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
| Серверное состояние   | [TanStack Query](#glossary-tanstack-query) | **Внедрено** ([workspaces](#glossary-workspace), invites, tasks, subtasks, [activity](#glossary-activity), members, health, search, [LLM](#glossary-llm)-ключи, [admin](#glossary-admin)) |
| Клиентское состояние  | [Zustand](#glossary-zustand) + локальный UI state | **Внедрено** (auth, тема сессии, prefs уведомлений, модалки, [bulk](#glossary-bulk)-selection, [kanban](#glossary-kanban) [DnD](#glossary-drag-and-drop)) |
| HTTP-клиент           | [Axios](#glossary-axios)              | **Внедрено**                                    |
| [API](#glossary-api)  | [Node.js](#glossary-nodejs), [Fastify](#glossary-fastify), [Zod](#glossary-zod) | **Внедрено** (auth, workspaces, tasks, team, search, AI, LLM-ключи, admin) |
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
| **Компаньон**      | Плавающая панель чата + вход из сайдбара; опциональный контекст задач ([`withTask`](#glossary-withtask)); ответы по проекту. **Не готово:** выбор персонажа, автосоздание подзадач из чата ([tool calling](#glossary-tool-calling)) |
| **Уведомления**    | [In-app](#glossary-in-app) колокольчик в сессии (история [toast](#glossary-toast) + входящие инвайты); переключатели в настройках (задачи / приглашения). Email и рассылки не планируются |
| **Настройки**      | Профиль (просмотр), [LLM](#glossary-llm)-ключи, переключатели уведомлений, выход, удаление аккаунта. **Не готово:** сохранение профиля на сервер, смена пароля |
| **Статус сервиса** | [Health-check](#glossary-health-check) [API](#glossary-api) и страница состояния сервисов в сессии                    |

### Роль [`admin`](#glossary-admin)

| Экран / модуль   | Назначение                                                   |
| ---------------- | ------------------------------------------------------------ |
| **Админ-панель** | Сводка платформы, список пользователей с удалением (`DELETE /admin/users/:userId`, confirm в UI; нельзя удалить себя или другого админа), журнал ошибок [API](#glossary-api) (in-memory), [feature flags](#glossary-feature-flags) |
| **Статистика**   | Агрегированные метрики по пользователям, проектам, задачам, health БД/AI |

---

## 5. Ключевые особенности

1. **AI-компаньон с контекстом проекта** — чат в сессии (плавающая панель); есть дополнительная возможность просмотреть задачи ([`withTask`](#glossary-withtask)). Локальная [LLM](#glossary-llm) через [LM Studio](#glossary-lm-studio) или [OpenAI-compatible](#glossary-openai-compatible) [API](#glossary-api). Автосоздание задач/подзадач из чата — **не реализовано**.
2. **Совместные проекты** — владелец, роли участников, инвайты, общий список задач.
3. **Лента активностей** — в карточке задачи одна секция «Комментарии»: системные события (статусы, подзадачи) и пользовательские сообщения в общем потоке; вложенные ответы, сворачиваемые ветки.
4. **Виды задач в сессии** — список (строки с контекстным меню), [канбан](#glossary-kanban) по статусам, вид «Даты» с группировкой (просрочено → сегодня → завтра → неделя → позже → без даты).
5. **Подзадачи** — декомпозиция вручную в карточке задачи (или подсказки от AI в чате). **[Спринты](#glossary-sprint)** — в планах, пока не реализованы.
6. **Командная работа** — назначение исполнителей, комментарии к задачам, активность участников.
7. **Уведомления** — [in-app](#glossary-in-app) колокольчик (история действий + инвайты), настраиваемые переключатели. Email и массовые рассылки **не планируются**.
8. **[Горячие клавиши](#glossary-keyboard-shortcuts)** — Ctrl+K поиск, Ctrl+B сайдбар, Ctrl+N новая задача, Ctrl+J Kono AI.
9. **Фильтр и сортировка задач** — фильтр по статусу на сервере (все 4 статуса + «Все задачи»); сортировка на клиенте по дате создания и названию (asc/desc). Отдельные кнопки в toolbar: **Фильтр** · **Сортировка** · **Настройки** (вид, добавить / удалить все).
10. **История статуса задачи** — таблица `task_status_history`, запись при создании и смене статуса; `GET /tasks/:taskId/status-history`; [timeline](#glossary-timeline) в карточке задачи (`TaskStatusHistoryTimeline`, секция «История статуса» — только при 2+ переходах).

---

## 6. Монетизация

В текущей версии не реализована. Архитектура допускает добавление подписочной модели через таблицы `subscriptions` и интеграцию с платёжным провайдером.

---

## 7. Внешние интеграции

| Сервис                 | Назначение                                     | Статус      |
| ---------------------- | ---------------------------------------------- | ----------- |
| **LM Studio / [OpenAI-compatible](#glossary-openai-compatible)** | Чат Kono AI (`POST /api/ai/chat`) | **Внедрено** (базово) |


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
    BE_MW --> BE_API --> BE_ORM
  end

  DB[(PostgreSQL)]
  LLM["OpenAI-compatible LLM — AI-компаньон"]

  FE -->|"HTTP REST JSON"| BE
  BE_ORM --> DB
  BE -.-> LLM
```

**Слой данных на фронтенде.** HTTP-вызовы — в `frontend/src/api/`. Серверное состояние — [TanStack Query](#glossary-tanstack-query) (`shared/api/query-keys.ts`, хуки в `entities/*/model`). UI-состояние (выбор задач, модалки) — `useState` / [Zustand](#glossary-zustand), не в типах [API](#glossary-api). Подробнее: [`frontend/src/api/README.md`](frontend/src/api/README.md).

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

**1. Первый контакт.** Пользователь открывает лендинг — hero, [bento](#glossary-bento)-блоки фич, прокручиваемые демо-видео (`DemoScrollShowcase`). Из шапки или CTA — регистрация или вход.

**2. Основная работа.** После авторизации пользователь открывает сессию и проект ([workspace](#glossary-workspace)). Создаёт задачи с датами начала и дедлайном. Переключает вид: **список**, **«Даты»** или **[канбан](#glossary-kanban)**. В «Датах» сверху — обзор по срокам (слева срочнее, справа дальше), ниже — лента глав с карточками; всё считается **от календарного «сегодня»** на клиенте.

**3. Работа с компаньоном.** В сайдбаре или плавающей панели открывает чат. Спрашивает что делать сегодня — компаньон смотрит в задачи (если включён контекст [`withTask`](#glossary-withtask)) и отвечает конкретно. Просит разбить большую задачу — компаньон подсказывает шаги в чате *(автосоздание подзадач — не реализовано)*.

**4. Карточка задачи.** Открывает детали: заголовок, подзадачи, свойства. Внизу — секция **«Комментарии»**: корневой composer для новых сообщений; ниже лента событий и комментариев с ветками ответов. Кнопка **«Ответить»** открывает поле ввода прямо под сообщением; ветки со счётчиком **«ответов N»** можно сворачивать и разворачивать.

**5. Командная работа.** Приглашает коллег по ссылке, назначает задачи, следит за активностью через уведомления. *([Спринты](#glossary-sprint) — в планах, пока не реализованы.)*

**6. Администратор.** Раздел `/projects/admin`: сводка платформы, список пользователей с удалением, [feature flags](#glossary-feature-flags), журнал ошибок. *(Браузер всех проектов — не реализован.)*

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
| **Фактически в проекте** | [JWT](#glossary-jwt) (email/password), [CRUD](#glossary-crud) проектов/задач/подзадач/activity, инвайты и роли, [kanban](#glossary-kanban) с [DnD](#glossary-drag-and-drop), три вида задач, [bulk](#glossary-bulk)-действия, фильтр задач по статусу ([API](#glossary-api) + toolbar), клиентская сортировка (дата создания / название), **история статусов задачи** (`task_status_history`, [timeline](#glossary-timeline) в карточке), `GET /api/search`, CommandDialog (Ctrl+K), горячие клавиши (Ctrl+B/N/J), in-app колокольчик + настройки уведомлений, [LLM](#glossary-llm)-ключи, удаление аккаунта, админка (overview, users **+ удаление пользователей**, error logs, [feature flags](#glossary-feature-flags)), [Swagger](#glossary-swagger) `/docs`, [React](#glossary-react) [SPA](#glossary-spa) + [Fastify](#glossary-fastify) [REST](#glossary-rest), [PostgreSQL](#glossary-postgresql) + [Prisma](#glossary-prisma), [TanStack Query](#glossary-tanstack-query), [LM Studio](#glossary-lm-studio) / OpenAI-compatible AI, [Docker Compose](#glossary-docker-compose), [скелетоны](#glossary-skeleton) загрузки, лендинг с демо-видео и bento-блоками, офлайн-состояние (`ConnectionEmptyState`), AI-панель с переключателем контекста задач |

**Ещё не реализовано (из MoSCoW / плана):** спринты, смена пароля, сохранение профиля на сервер, назначение исполнителя из команды, [tool calling](#glossary-tool-calling) (создание задач/подзадач из чата), выбор персонажа компаньона, email-уведомления, [push](#glossary-push) от действий других участников, [pagination](#glossary-pagination) списка задач, браузер всех проектов в админке, автотесты, [seed](#glossary-seed) для демо.

---

## 14. Пользовательские сценарии

1. Как **пользователь**, я хочу **зарегистрироваться и войти**, чтобы **мои проекты и задачи сохранялись между сессиями**.
2. Как **пользователь**, я хочу **создать проект и пригласить команду**, чтобы **работать над задачами совместно**.
3. Как **пользователь**, я хочу **создавать задачи с приоритетом, дедлайном и полем «создатель» (текст)**, чтобы **команда понимала что и когда нужно сделать** *(назначение исполнителя из команды — не реализовано)*.
4. Как **пользователь**, я хочу **смотреть задачи на [канбан](#glossary-kanban)-доске по статусам**, чтобы **видеть прогресс работы визуально**.
5. Как **пользователь**, я хочу **открыть вид «Даты» и сразу понять что срочно сегодня**, чтобы **не разбирать календарь вручную**.
6. Как **пользователь**, я хочу **спросить компаньона что делать сегодня**, чтобы **не тратить время на разбор [бэклога](#glossary-backlog)**.
7. Как **пользователь**, я хочу **попросить компаньона разбить задачу на подзадачи**, чтобы **декомпозировать сложную работу быстро** *(сейчас — текстовые подсказки в чате; автосоздание подзадач — не реализовано)*.
8. Как **пользователь**, я хочу **видеть [in-app](#glossary-in-app) уведомления** (история своих [toast](#glossary-toast) в колокольчике + входящие инвайты в проект), чтобы **не терять важные события без перезагрузки страницы** *([push](#glossary-push) от действий других участников — не реализовано)*.
9. Как **пользователь**, я хочу **оставлять комментарии и отвечать в ветках под задачей**, чтобы **обсуждение не терялось отдельно от истории изменений**.
10. Как **[администратор](#glossary-admin)**, я хочу **управлять пользователями** (список, удаление с подтверждением) **и видеть сводку по платформе**, чтобы **контролировать платформу без доступа к БД** *(полный браузер всех проектов — не реализован)*.

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
- [ ] Поиск, фильтрация и [pagination](#glossary-pagination) **расширенные** ([full-text](#glossary-full-text) по описанию, фильтры по датам/тегам, cursor/page для задач)
- [x] История статусов задач (`task_status_history`, `GET /tasks/:taskId/status-history`, запись при create/update)
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
- [x] Страница настроек и [LLM](#glossary-llm)-ключей (`AccountSettingsPage`, `LlmKeysPage`); профиль — просмотр и локальный UI редактирования без сохранения на сервер
- [x] Удаление аккаунта с подтверждением пароля (`DELETE /api/users/me`)
- [?] Смена пароля в настройках
- [?] Сохранение профиля (имя, e-mail) на сервер
- [x] Страница статуса сервисов (`SystemStatusPage`)
- [x] Лендинг: демо-видео (`DemoScrollShowcase`, `DemoVideoPlayer`), [bento](#glossary-bento)-карточки фич (`HomeBentoCard`)
- [x] Офлайн / потеря связи: `ConnectionEmptyState`, TanStack Query `networkMode: offlineFirst` ([offline-first](#glossary-offline-first))
- [x] Рефактор страницы задач: `use-session-tasks-page.ts`, `SessionTasksPageHeader`, `SessionTasksMainContent`
- [x] История статуса в карточке задачи (`TaskStatusHistoryTimeline`, секция «История статуса»)
- [?] Полноценный личный кабинет: история действий пользователя

</details>

<details>
<summary><b>4. AI-компаньон и интеграции</b> — <i>до 20 июня</i></summary>

- [x] Локальная [LLM](#glossary-llm) ([LM Studio](#glossary-lm-studio)), эндпоинт `/api/ai/chat`
- [x] Панель Kono AI в сессии на странице задач (`AssistantFloatingPanel`, переключатель контекста [`withTask`](#glossary-withtask))
- [?] Команды AI: создать проект/задачу из чата ([tool calling](#glossary-tool-calling))
- [?] Отдельные эндпоинты suggest / breakdown
- [x] Админ-панель (`/admin`): overview, users, **удаление пользователей** (`DELETE /admin/users/:userId`), error logs, [feature flags](#glossary-feature-flags)

</details>

<details>
<summary><b>5. Финализация</b> — <i>до 1 июля</i></summary>

- [ ] Тесты: критичные сервисы
- [x] [Docker Compose](#glossary-docker-compose): frontend, backend, [PostgreSQL](#glossary-postgresql)
- [ ] [Seed](#glossary-seed) данные для демо
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

# скопируй и заполни JWT_SECRET и ADMIN_EMAILS
cp .env.example .env

docker compose up --build
```

| Сервис   | URL                         |
| -------- | --------------------------- |
| Frontend | http://localhost:4173       |
| API      | http://localhost:3000/api   |
| Swagger  | http://localhost:3000/docs  |
| Postgres | localhost:5432 (`kono/kono`) |

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
| Состояние сервисов | Health API / БД / LLM |
| Проекты | CRUD workspace |
| Участники | Команда, инвайты, роли |
| Задачи · Подзадачи · Комментарии | Основная работа с задачами |
| Поиск | `GET /api/search` — проекты и задачи |
| AI-компаньон | `POST /api/ai/chat` |
| LLM-ключи | Личные ключи [OpenAI-compatible](#glossary-openai-compatible) |
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
```

**Корень репозитория** (`.env` для Docker Compose):

```env
JWT_SECRET=
LM_BASE_URL=http://host.docker.internal:1234/v1
LM_API_KEY=lm-studio
LM_MODEL=gemma-4-e4b-it
ADMIN_EMAILS=
```

---

## 17. Структура репозитория

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
│   │   ├── hooks/                  # app-level хуки (assistant, health, invites)
│   │   ├── pages/
│   │   │   ├── home/               # лендинг (DemoScrollShowcase, HomeBentoCard)
│   │   │   ├── offline/            # ConnectionEmptyState
│   │   │   ├── not-found/          # страница 404
│   │   │   └── session/            # основное приложение
│   │   │       ├── lib/            # sort-tasks.ts, sessionWorkspaceUtils
│   │   │       ├── model/          # sessionPaths, assistant context
│   │   │       └── ui/
│   │   │           ├── tasks/      # список, даты, канбан, TaskDetailsPage
│   │   │           ├── admin/      # админ-панель
│   │   │           ├── settings/   # аккаунт, LLM-ключи
│   │   │           ├── system/     # статус сервисов
│   │   │           ├── members/
│   │   │           └── layout/
│   │   ├── shared/                 # UI-kit, query-keys, utils, permissions
│   │   │   ├── config/
│   │   │   │   ├── demo-videos.ts  # метаданные видео на лендинге
│   │   │   │   └── session-shortcuts.ts  # Ctrl+K/B/N/J
│   │   │   └── model/
│   │   │       └── useNotificationPrefsStore.ts  # prefs in-app уведомлений
│   │   └── widgets/                # header, footer, assistant
│   ├── public/
│   │   ├── demo/                   # .webm для блока DemoScrollShowcase
│   │   └── readme_logo.jpg         # обложка README
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
│   │   ├── utils/
│   │   ├── permissions.ts          # RBAC по workspace
│   │   ├── db/prisma.ts            # Prisma client (runtime)
│   │   └── index.ts
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
| `frontend/src/hooks/` | Хуки уровня приложения (не домен): health, assistant, invites |
| `backend/prisma/schema.prisma` | Модели БД и миграции |
| `backend/src/db/prisma.ts` | Инициализация Prisma Client |
| `backend/src/openapi/` | Zod → JSON Schema, Swagger UI на `/docs` |
| `docker-compose.yml` | Postgres + backend + frontend (nginx) |
| `frontend/src/api/README.md` | Query / [Zustand](#glossary-zustand) / logout |

---

## 18. Глоссарий

Краткие определения **англоязычных терминов**, встречающихся в этом README. По клику на термин в тексте документа вы попадаете сюда.

### Продукт и UX

<a id="glossary-activity"></a>
**activity** — лента событий в задаче: смена статуса, подзадачи, комментарии; хранится в `task_activity`.

<a id="glossary-admin"></a>
**admin** — роль администратора платформы (не путать с владельцем проекта). Доступ к `/projects/admin`, задаётся через `ADMIN_EMAILS`.

<a id="glossary-backlog"></a>
**backlog** — накопленный список невыполненных задач; «разбор бэклога» — понять, за что браться в первую очередь.

<a id="glossary-bento"></a>
**bento** — сетка карточек разного размера на лендинге (как «бенто-бокс»); у нас — `HomeBentoCard`.

<a id="glossary-bulk"></a>
**bulk** — массовые действия над несколькими выделенными задачами (удаление, смена статуса).

<a id="glossary-command-palette"></a>
**Command palette** — модальное окно быстрых команд и поиска; в Kono открывается по **Ctrl+K** (`CommandDialog`).

<a id="glossary-drag-and-drop"></a>
**drag-and-drop** (сокр. **DnD**) — перетаскивание элементов мышью; в канбане — смена статуса задачи между колонками.

<a id="glossary-empty-state"></a>
**empty state** — экран «нет данных» или «ничего не найдено» (`EmptySession`, `ConnectionEmptyState`).

<a id="glossary-feature-flags"></a>
**feature flags** — переключатели функций в админке без отдельного деплоя.

<a id="glossary-hub"></a>
**hub** — экран-обзор и точка входа в раздел (hub проектов, hub участников).

<a id="glossary-in-app"></a>
**in-app** — внутри приложения (колокольчик, toast), без email и push.

<a id="glossary-kanban"></a>
**kanban** — доска с колонками по статусам задач; перетаскивание меняет статус.

<a id="glossary-keyboard-shortcuts"></a>
**keyboard shortcuts** — горячие клавиши (Ctrl+K, Ctrl+B, Ctrl+N, Ctrl+J).

<a id="glossary-push"></a>
**push** — push-уведомления браузера или устройства; в Kono **не реализованы**.

<a id="glossary-skeleton"></a>
**skeleton** — «скелетон» загрузки: серые заглушки вместо контента, пока идёт запрос.

<a id="glossary-sprint"></a>
**sprint** — итерация работ (фиксированный период с набором задач); **в Kono пока не реализован**.

<a id="glossary-timeline"></a>
**timeline** — лента или ось времени (вид «Даты», история статуса в карточке).

<a id="glossary-toast"></a>
**toast** — короткое всплывающее уведомление в углу экрана (библиотека Sonner).

<a id="glossary-tool-calling"></a>
**tool calling** — когда LLM из ответа вызывает действия (создать задачу, подзадачу); **в Kono не реализовано**.

<a id="glossary-user"></a>
**user** — обычный пользователь платформы (не admin).

<a id="glossary-withtask"></a>
**withTask** — флаг контекста для AI-чата: модель «видит» задачи текущего проекта.

<a id="glossary-workspace"></a>
**workspace** — проект в БД; в UI — «проект» с публичным ключом `K-XXXXXX`.

<a id="glossary-wireframes"></a>
**wireframes** — чёрно-белые схематичные макеты экранов до финального дизайна.

### Архитектура и API

<a id="glossary-api"></a>
**API** *(Application Programming Interface)* — программный интерфейс; HTTP-методы под `/api/*`.

<a id="glossary-crud"></a>
**CRUD** — Create, Read, Update, Delete; базовые операции над сущностями.

<a id="glossary-dto"></a>
**DTO** *(Data Transfer Object)* — формат данных в ответе API после маппинга из БД.

<a id="glossary-er"></a>
**ER** *(Entity-Relationship)* — схема «сущность — связь» между таблицами БД.

<a id="glossary-fsd"></a>
**FSD** *(Feature-Sliced Design)* — подход к структуре фронтенда по слоям (entities, features, pages…).

<a id="glossary-health-check"></a>
**health-check** — проверка доступности API, БД и LLM (`GET /api/health`).

<a id="glossary-jwt"></a>
**JWT** *(JSON Web Token)* — токен авторизации после входа; передаётся в заголовке `Authorization: Bearer …`.

<a id="glossary-llm"></a>
**LLM** *(Large Language Model)* — большая языковая модель для AI-компаньона.

<a id="glossary-moscow"></a>
**MoSCoW** — приоритизация требований: Must / Should / Could / Won't.

<a id="glossary-openai-compatible"></a>
**OpenAI-compatible** — API в формате OpenAI (`/v1/chat/completions`); подходит LM Studio и многие провайдеры.

<a id="glossary-openapi"></a>
**OpenAPI** — стандарт описания REST API; в проекте генерируется из Zod-схем.

<a id="glossary-pagination"></a>
**pagination** — постраничная или курсорная подгрузка списков (для задач **ещё не реализована**).

<a id="glossary-full-text"></a>
**full-text** — полнотекстовый поиск по содержимому (не только по заголовку).

<a id="glossary-rbac"></a>
**RBAC** *(Role-Based Access Control)* — доступ по ролям (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER` в workspace).

<a id="glossary-rest"></a>
**REST** — стиль HTTP API с ресурсами и методами GET/POST/PATCH/DELETE.

<a id="glossary-seed"></a>
**seed** — начальные демо-данные в БД для быстрого старта.

<a id="glossary-spa"></a>
**SPA** *(Single Page Application)* — одностраничное приложение; навигация без полной перезагрузки страницы.

### Frontend

<a id="glossary-axios"></a>
**Axios** — HTTP-клиент для запросов к API с фронтенда.

<a id="glossary-debounce"></a>
**debounce** — задержка перед запросом при вводе (например, 350 ms в поиске).

<a id="glossary-offline-first"></a>
**offline-first** — стратегия кэша: показывать сохранённые данные при потере сети (`networkMode: offlineFirst`).

<a id="glossary-react"></a>
**React** — библиотека UI; в проекте React 19.

<a id="glossary-react-router"></a>
**React Router** — маршрутизация на клиенте (`/`, `/login`, `/projects/*`…).

<a id="glossary-shadcn-ui"></a>
**shadcn/ui** — набор переиспользуемых UI-компонентов поверх Radix UI и Tailwind.

<a id="glossary-tailwind-css"></a>
**Tailwind CSS** — utility-first CSS-фреймворк для вёрстки.

<a id="glossary-tanstack-query"></a>
**TanStack Query** — кэш и синхронизация серверного состояния (задачи, проекты, activity…).

<a id="glossary-typescript"></a>
**TypeScript** — типизированный JavaScript.

<a id="glossary-vite"></a>
**Vite** — сборщик и dev-сервер фронтенда (порт 5173).

<a id="glossary-zustand"></a>
**Zustand** — лёгкое клиентское хранилище (auth, тема, prefs уведомлений).

### Backend, данные и инфраструктура

<a id="glossary-docker"></a>
**Docker** — контейнеризация приложений.

<a id="glossary-docker-compose"></a>
**Docker Compose** — запуск нескольких контейнеров одной командой (`docker compose up`).

<a id="glossary-fastify"></a>
**Fastify** — HTTP-фреймворк для Node.js backend.

<a id="glossary-lm-studio"></a>
**LM Studio** — локальный запуск LLM с OpenAI-compatible API (по умолчанию порт 1234).

<a id="glossary-nginx"></a>
**Nginx** — веб-сервер для production-frontend в Docker (статика + прокси `/api`).

<a id="glossary-nodejs"></a>
**Node.js** — среда выполнения JavaScript на сервере.

<a id="glossary-orm"></a>
**ORM** *(Object-Relational Mapping)* — слой между кодом и SQL; у нас — Prisma.

<a id="glossary-postgresql"></a>
**PostgreSQL** — реляционная СУБД проекта.

<a id="glossary-prisma"></a>
**Prisma** — ORM, схема в `schema.prisma`, миграции и клиент для запросов.

<a id="glossary-swagger"></a>
**Swagger** — интерактивная документация API в браузере (`/docs`).

<a id="glossary-zod"></a>
**Zod** — валидация и типизация входных данных на backend.

> [!IMPORTANT]
> Документ не зафиксирован как «окончательный»: обновлён 02.07.2026