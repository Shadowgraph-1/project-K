<div align="center">

<a id="kono"></a>

<img src="./frontend/public/readme_logo.jpg" alt="Kono — K-Project" width="920">

**Таск-трекер с AI-компаньоном** — управление проектами и задачами для небольших команд с персонажем, который знает контекст твоей работы.

[![Linear — проект](https://img.shields.io/badge/Linear-5E6AD2?style=for-the-badge&logo=linear&logoColor=white)](https://linear.app/project-k-value/project/focus-with-me-1a3e5e26fbfa/overview)
[![Figma — макеты](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/design/gV6wyVsuiNxqcDrhfwb7JU/Project-K?t=UfhMy33D2pk2PALT-0)

</div>

## Содержание

- [Kono](#kono)
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

---

## 1. Концепция и проблематика

**Простыми словами.** Командам нужен инструмент который не мешает работать — без лишних кликов, без перегруженного интерфейса, без ощущения что ты один разбираешься в хаосе задач. **Kono** берёт привычную механику таск-трекера — проекты, канбан, спринты — и добавляет **AI-компаньона** который знает контекст проекта: он подсказывает что делать сегодня, разбивает сложные задачи на шаги и отвечает прямо в сайдбаре рядом с работой.

**Какую боль закрывает продукт.** Обычный таск-трекер хранит задачи, но не помогает с ними работать. Непонятно за что браться, сложно декомпозировать большую задачу, контекст теряется в комментариях. Kono снижает этот порог за счёт **AI-компаньона с доступом к задачам**, **истории статусов**, **прозрачности для всей команды** и **уведомлений** когда что-то меняется без твоего участия.

---

## 2. Целевая аудитория

На первом шаге продукт ориентирован на **небольшие команды и фрилансеров** — тех, кому нужен простой и быстрый инструмент для совместной работы без корпоративной тяжести. Им важно не просто хранить задачи, а **понимать что происходит в проекте** и быстро двигаться вперёд: AI-компаньон и прозрачная история задач здесь помогают, а не отвлекают.

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
| SPA                   | React 19, TypeScript, Vite            | **Внедрено**                                    |
| Маршрутизация         | React Router                          | **Внедрено**                                    |
| Стилизация            | Tailwind CSS v4, shadcn/ui            | **Внедрено**                                    |
| Серверное состояние   | TanStack Query                        | **Внедрено** (workspaces, invites, tasks, subtasks, activity, members, health) |
| Клиентское состояние  | Zustand + локальный UI state          | **Внедрено** (auth, модалки, bulk-selection в `WorkspaceTasksBlock`) |
| HTTP-клиент           | Axios                                 | **Внедрено**                                    |
| API                   | Node.js, Fastify, Zod                 | **Внедрено** (auth, workspaces, tasks, team)    |
| ORM / миграции        | Prisma                                | **Внедрено**                                    |
| СУБД                  | PostgreSQL                            | **Внедрено**                                    |
| Документация API      | Swagger UI (`/docs`)                  | **Внедрено**                                    |
| Контейнеризация       | Docker, Docker Compose, Nginx         | **Внедрено**                                    |

---

## 4. Функциональность по ролям

### Роль `user`

| Экран / модуль     | Назначение                                                               |
| ------------------ | ------------------------------------------------------------------------ |
| **Задачи**         | Hub проектов, три вида (список, «Даты», канбан), фильтр по статусу, bulk-действия, карточка задачи |
| **Проекты**        | Создание проектов, управление участниками, спринты                       |
| **Компаньон**      | Чат в сайдбаре, план дня, разбивка задачи на подзадачи, выбор персонажа  |
| **Уведомления**    | In-app в сессии проекта: назначение, статус, комментарии (без email и рассылок) |
| **Настройки**      | Профиль, смена пароля, управление LLM-ключами (OpenAI-compatible)        |
| **Статус сервиса** | Health-check API и страница состояния сервисов в сессии                    |

### Роль `admin`

| Экран / модуль   | Назначение                                                   |
| ---------------- | ------------------------------------------------------------ |
| **Админ-панель** | Список пользователей, просмотр workspace, управление доступом |
| **Статистика**   | Агрегированная активность по пользователям и проектам        |

---

## 5. Ключевые особенности

1. **AI-компаньон с контекстом проекта** — чат в сессии видит список задач и отвечает по делу (локальная LLM через LM Studio или любой OpenAI-compatible API).
2. **Совместные проекты** — владелец, роли участников, инвайты, общий список задач.
3. **Лента activity и комментарии** — в карточке задачи одна секция «Комментарии»: системные события (статусы, подзадачи) и пользовательские сообщения в общем потоке; вложенные ответы, сворачиваемые ветки, быстрый inline-ответ под сообщением (как на Reddit).
4. **Виды задач в сессии** — список (строки с контекстным меню), канбан по статусам, вид «Даты» с группировкой **относительно сегодня** (просрочено → сегодня → завтра → неделя → позже → без даты).
5. **Подзадачи и спринты** — декомпозиция через AI или вручную, группировка работы по циклам с датами.
6. **Командная прозрачность** — назначение исполнителей, комментарии к задачам, активность участников.
7. **Уведомления** — только in-app внутри проекта (колокольчик в сессии): назначение, смена статуса, комментарии. Email и массовые рассылки **не планируются** на текущем этапе.

---

## 6. Монетизация

В текущей версии не реализована. Архитектура допускает добавление подписочной модели через таблицы `subscriptions` и интеграцию с платёжным провайдером.

---

## 7. Внешние интеграции

| Сервис                 | Назначение                                     | Статус      |
| ---------------------- | ---------------------------------------------- | ----------- |
| **LM Studio / OpenAI-compatible** | Чат Kono AI (`POST /api/ai/chat`) | **Внедрено** (базово) |
| **SMTP (Resend)**      | Email-инвайты и рассылки                         | **Не планируется** (только in-app) |
| **OAuth (Google)**     | Вход через Google помимо email/password        | Опционально |

---

## 8. Модель данных

Ниже — сущности из `backend/prisma/schema.prisma`. В UI термин **workspace** = **проект** (публичный ключ вида `K-XXXXXX`).

| Сущность                  | Ключевые поля                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `users`                   | `id`, имя, e-mail, хэш пароля, `created_at`                                                      |
| `workspaces`              | `id`, `public_key`, `user_id` (владелец), название, `created_at`                                 |
| `workspace_members`       | `workspace_id`, `user_id`, `role` (`OWNER` … `VIEWER`), `joined_at`                              |
| `workspace_invites`       | код приглашения, `workspace_id`, роль, `expires_at`, лимит использований                         |
| `workspace_member_invites`| персональный инвайт: `invitee_id`, `invited_by`, `status` (`PENDING` / `ACCEPTED` / `DECLINED`)  |
| `tasks`                   | `id`, `workspace_id`, заголовок, описание, `status`, `start_date`, `due_date`, `tags`, `sort_order` |
| `subtasks`                | `id`, `task_id`, заголовок, `status`, опционально `user_id`                                      |
| `task_activity`           | `id`, `task_id`, `type`, заголовок, `body`, `metadata` (ветки через `parentActivityId`)          |
| `user_llm_keys`           | пользовательские ключи LLM: `label`, `api_key`, `key_hint`, `is_active`                          |

---

## 9. Концептуальная схема связей (ER)

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
  users ||--o{ task_activity : authors
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

**Слой данных на фронтенде.** HTTP-вызовы — в `frontend/src/api/`. Серверное состояние — TanStack Query (`shared/api/query-keys.ts`, хуки в `entities/*/model`). UI-состояние (выбор задач, модалки) — `useState` / Zustand, не в типах API. Подробнее: [`frontend/src/api/README.md`](frontend/src/api/README.md).

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

**1. Первый контакт.** Пользователь открывает лендинг — понимает идею, видит блоки про канбан и AI-компаньона. Из шапки или кнопки CTA открывает регистрацию или вход.

**2. Основная работа.** После авторизации пользователь открывает сессию и проект (workspace). Создаёт задачи с датами начала и дедлайном. Переключает вид: **список**, **«Даты»** или **канбан**. В «Датах» сверху — обзор по срокам (слева срочнее, справа дальше), ниже — лента глав с карточками; всё считается **от календарного «сегодня»** на клиенте.

**3. Работа с компаньоном.** В сайдбаре открывает чат с персонажем. Спрашивает что делать сегодня — компаньон смотрит в задачи и отвечает конкретно. Просит разбить большую задачу — компаньон создаёт подзадачи.

**4. Карточка задачи.** Открывает детали: заголовок, подзадачи, свойства. Внизу — секция **«Комментарии»**: корневой композer для новых сообщений; ниже лента событий и комментариев с ветками ответов. Кнопка **«Ответить»** открывает поле ввода прямо под сообщением; ветки со счётчиком **«ответов N»** можно сворачивать и разворачивать.

**5. Командная работа.** Приглашает коллег по ссылке, назначает задачи, следит за активностью через уведомления. Группирует работу по спринтам с датами.

**6. Администратор.** Отдельный раздел `/admin`: управление пользователями, просмотр всех проектов, агрегированная статистика активности.

**Побочный путь.** Пользователь вводит несуществующий URL — видит страницу 404 с иллюстрацией и кнопками возврата на главную или в проекты.

### Виды задач в сессии

Переключатель в подшапке проекта (`Workspacetasksubheader`): **Список** · **Даты** · **Канбан**. Реализация: `frontend/src/pages/session/ui/tasks/`.

| Вид (`TasksView`) | Компонент | Назначение |
| ----------------- | --------- | ---------- |
| `line` | `WorkspaceListView` + `TaskRow` | Плотный список: статус, приоритет, даты, контекстное меню, bulk-выбор |
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

Сверху — **обзор по срокам**: блоки с названиями групп и счётчиками (не календарная сетка); клик прокручивает к соответствующей главе. Ниже — вертикальная ось с карточками задач. Стили — Tailwind в `TaskTimeline.tsx`, без отдельного блока в `session-shell.css`.

**Канбан.** Колонки и карточки с ключом `K-XXXXXX`, статусом, приоритетом и датой. Drag-and-drop между колонками — **ещё не сделан**.

### Карточка задачи — комментарии и activity

Экран деталей: `TaskDetailsPage` → `task-details/TaskDetailsMain.tsx`. Лента и UI комментариев вынесены в отдельные модули внутри `pages/session/ui/tasks/`:

| Модуль | Назначение |
| ------ | ---------- |
| `task-feed/` | `buildActivityFeed` — дерево корневых записей и ответов; форматирование дат |
| `task-activity/` | Секция «Комментарии»: timeline, ветки, композer, inline-ответ |
| `task-details/` | Шапка, подзадачи, свойства; оркестрация данных и мутаций |

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

## 13. Функциональные требования MoSCoW

| Категория          | Что входит                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Must**           | Регистрация и вход, CRUD задач и проектов, канбан по статусам, инвайты в команду, роли user/admin, личный кабинет, пагинация и поиск, API + БД для всего ядра           |
| **Should**         | AI-компаньон с контекстом задач, история статусов, подзадачи, спринты, in-app уведомления в проекте, админ-панель                                               |
| **Could**          | Activity log с графом активности, OAuth через Google, command palette, keyboard shortcuts                                                 |
| **Won't (сейчас)** | Email и массовые рассылки, мобильное нативное приложение, офлайн-режим, real-time WebSocket синхронизация, интеграции с GitHub/Jira                                                                 |

---

## 14. Пользовательские сценарии

1. Как **пользователь**, я хочу **зарегистрироваться и войти**, чтобы **мои проекты и задачи сохранялись между сессиями**.
2. Как **пользователь**, я хочу **создать проект и пригласить команду**, чтобы **работать над задачами совместно**.
3. Как **пользователь**, я хочу **создавать задачи с приоритетом, дедлайном и исполнителем**, чтобы **команда понимала что и когда нужно сделать**.
4. Как **пользователь**, я хочу **смотреть задачи на канбан-доске по статусам**, чтобы **видеть прогресс работы визуально**.
5. Как **пользователь**, я хочу **открыть вид «Даты» и сразу понять что срочно сегодня**, чтобы **не разбирать календарь вручную**.
6. Как **пользователь**, я хочу **спросить компаньона что делать сегодня**, чтобы **не тратить время на разбор бэклога**.
7. Как **пользователь**, я хочу **попросить компаньона разбить задачу на подзадачи**, чтобы **декомпозировать сложную работу быстро**.
8. Как **пользователь**, я хочу **видеть in-app уведомления в проекте** (назначение, статус, комментарии), чтобы **не пропускать изменения без моего участия**.
9. Как **пользователь**, я хочу **оставлять комментарии и отвечать в ветках под задачей**, чтобы **обсуждение не терялось отдельно от истории изменений**.
10. Как **администратор**, я хочу **управлять пользователями и просматривать все проекты**, чтобы **контролировать платформу без доступа к БД**.

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
- [x] Приоритеты по MoSCoW
- [ ] Wireframes в Figma (дашборд, канбан, карточка задачи)
- [ ] Спецификация REST API (метод, путь, описание)
- [x] Структура каталогов frontend / backend

</details>

<details>
<summary><b>2. Бэкенд — ядро</b> — <i>до 26 мая</i></summary>

- [x] Fastify в `backend/src/index.ts`, роуты под `/api`
- [x] Prisma + PostgreSQL, миграции
- [x] Регистрация, вход, JWT
- [x] CRUD: проекты, задачи, подзадачи, activity
- [x] Участники workspace, инвайты, роли
- [x] Team API
- [ ] Поиск, фильтрация, пагинация (расширенные)
- [ ] История статусов задач как отдельная сущность
- [x] Swagger / OpenAPI UI (`/docs`)

</details>

<details>
<summary><b>3. Фронтенд — основные экраны</b> — <i>до 9 июня</i></summary>

- [x] Сессия: проекты (workspaces), список задач, карточка задачи
- [x] Подзадачи, activity, свойства задачи
- [x] Совместная работа: участники, входящие инвайты
- [x] TanStack Query для серверных данных (tasks, subtasks, activity, workspaces, members)
- [x] Разбиение экрана задачи: `task-details/`, `task-activity/`, `task-feed/` (FSD внутри pages)
- [x] Секция «Комментарии» в карточке задачи: единая лента activity + комментарии, ветки ответов, inline-ответ, сворачивание веток
- [x] Три вида задач: список, «Даты» (`TaskTimeline`, группы от **сегодня**), канбан (`WorkspaceKanbanView`)
- [x] Фильтр по статусу задачи, bulk-удаление и смена статуса выбранных
- [x] Обзор задач: hub проектов (`WorkspaceHubPicker`), список / «Даты» / канбан внутри workspace
- [x] Настройки аккаунта и LLM-ключей (`AccountSettingsPage`, `LlmKeysPage`)
- [x] Страница статуса сервисов (`SystemStatusPage`)
- [ ] Полноценный личный кабинет: аватар, история действий пользователя

</details>

<details>
<summary><b>4. AI-компаньон и интеграции</b> — <i>до 20 июня</i></summary>

- [x] Локальная LLM (LM Studio), эндпоинт `/api/ai/chat`
- [x] Панель Kono AI в сессии на странице задач
- [ ] Команды AI: создать проект/задачу из чата (tool calling)
- [ ] Отдельные эндпоинты suggest / breakdown
- [x] Админ-панель (`/admin`)

</details>

<details>
<summary><b>5. Финализация</b> — <i>до 1 июля</i></summary>

- [ ] Тесты: критичные сервисы
- [x] Docker Compose: frontend, backend, PostgreSQL
- [ ] Seed данные для демо
- [ ] Полировка UI: скелетоны, тосты, обработка ошибок
- [ ] README финальная версия с инструкцией запуска

</details>

---

## 16. Локальный запуск

### Требования

- **Node.js** LTS — для frontend и backend
- **PostgreSQL** — локально или через Docker
- **Docker Desktop** (опционально) — для запуска всего стека одной командой

### Docker Compose

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

Frontend в Docker — **Nginx** со SPA fallback и прокси `/api/` на backend. LM Studio на хосте доступен backend-контейнеру через `host.docker.internal` (см. `.env.example`).

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

### Swagger — документация API

Интерактивная документация на русском: **http://localhost:3000/docs**

1. Открой `/docs` в браузере — вверху будет введение с терминами, кодами ошибок и быстрым стартом.
2. Разверни **Авторизация** → `POST /api/auth/login` (или register) → **Try it out** → выполни запрос.
3. Скопируй `token` из ответа.
4. Нажми **Authorize** (замок) → вставь `Bearer <token>` → **Authorize**.
5. Вызывай любые защищённые методы — JWT подставится автоматически.

Разделы в Swagger:

| Раздел | Содержимое |
| ------ | ---------- |
| Авторизация | Регистрация, вход |
| Состояние сервисов | Health API / БД / LLM |
| Проекты | CRUD workspace |
| Участники | Команда, инвайты, роли |
| Задачи · Подзадачи · Комментарии | Основная работа с задачами |
| AI-компаньон | `POST /api/ai/chat` |
| LLM-ключи | Личные ключи OpenAI-compatible |
| Администрирование | Только для `ADMIN_EMAILS` |

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
│   │   │   ├── user/               # useAuthStore, UserAvatar
│   │   │   ├── notification/       # useNotifys
│   │   │   └── session/            # reset-session-data
│   │   ├── features/               # auth, settings
│   │   ├── hooks/                  # app-level хуки (assistant, health, invites)
│   │   ├── pages/
│   │   │   ├── home/               # лендинг
│   │   │   ├── not-found/          # страница 404
│   │   │   └── session/            # основное приложение
│   │   │       ├── model/          # sessionPaths, константы
│   │   │       └── ui/
│   │   │           ├── tasks/      # список, даты, канбан, TaskDetailsPage
│   │   │           ├── admin/      # админ-панель
│   │   │           ├── settings/   # аккаунт, LLM-ключи
│   │   │           ├── system/     # статус сервисов
│   │   │           ├── members/
│   │   │           └── layout/
│   │   ├── shared/                 # UI-kit, query-keys, utils, permissions
│   │   │   └── config/
│   │   │       └── demo-videos.ts  # метаданные видео на лендинге
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
│   │   ├── routes/                 # *.routes.ts — тонкий HTTP-слой
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
| `frontend/src/entities/*/model/` | TanStack Query: tasks, subtasks, activity, workspaces, members |
| `frontend/src/pages/session/ui/tasks/` | Список, канбан, вид «Даты», `SessionTasksPage`, `WorkspaceTasksBlock` |
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
| `frontend/src/api/README.md` | Query / Zustand / logout |

> [!IMPORTANT]
> Документ не зафиксирован как «окончательный»: обновлён 28.06.2026