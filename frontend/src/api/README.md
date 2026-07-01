# API — источник правды (БД)

Серверные данные кэшируются через **TanStack Query** (`shared/api/query-keys.ts`, хуки в `entities/*/model`).

Zustand-сторы — **кэш в памяти на сессию** для UI и локального состояния. Без `persist`, кроме auth.

## Модули API

| Модуль | Файл | Эндпоинты |
|--------|------|-----------|
| Auth | `auth/index.ts` | register, login |
| Workspaces | `workspaces/index.ts` | list, create, delete |
| Workspace members | `workspaces/members.ts` | members, invites, search |
| Tasks | `tasks/index.ts` | CRUD по workspace |
| Subtasks | `subtasks/index.ts` | CRUD по task |
| Task activity | `task-activity/index.ts` | comments, history |
| Team | `team/index.ts` | add, delete, list |
| Invites | `invites/index.ts` | workspace invites |

## TanStack Query (серверное состояние)

| Данные | Хук | Query key |
|--------|-----|-----------|
| Workspaces | `useWorkspaceQuery` | `workspaces` |
| Incoming invites | `useInvitesQuery` | `invites.incoming` |
| Tasks по workspace | `useTasksQuery` | `tasks.byWorkspace(id)` |
| Subtasks по task | `useSubtasksQuery` | `subtasks(taskId)` |
| Activity по task | `useTaskActivityQuery` | `task-activity(taskId)` |
| Health | `useHealthQuery` | `health` |

Хуки домена — в `entities/*/model/`. `hooks/index.ts` реэкспортирует workspace-хуки и app-level хуки (health, assistant, invites).

После мутаций — `queryClient.invalidateQueries` по соответствующему key.

## Zustand (клиент / UI)

| Стор | Назначение |
|------|------------|
| `useAuthStore` | JWT-профиль (persist) |
| `useNotifys` | история toast в панели |
| `checkedIds` в `WorkspaceTasksBlock` | bulk-выбор задач (локальный `useState`, не в Task) |

## Logout

`entities/session/reset-session-data.ts` — `queryClient.clear()` + закрытие модалки collaboration.

## localStorage

- `kono-auth-token` — JWT
- `focus-with-me-auth` — профиль (`useAuthStore`)
