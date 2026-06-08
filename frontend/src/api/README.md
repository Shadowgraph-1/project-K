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
| Tasks по workspace | `useQuery` в `SessionTasksPage` | `tasks.byWorkspace(id)` |
| Members workspace | `useWorkspaceMembersQuery` | `workspaceMembers(id)` |

После мутаций — `queryClient.invalidateQueries` по соответствующему key.

## Zustand (клиент / гибрид)

| Стор | Назначение |
|------|------------|
| `useAuthStore` | JWT-профиль (persist) |
| `useSessionTasks` | список задач + `checked` для bulk UI; sync из query в `SessionTasksPage` |
| `useTeamStore` | команда (пока ручной fetch) |
| `useNotifys` | история toast в панели |

## Logout

`reset-session-data.ts` — `queryClient.clear()` + очистка zustand-сторов.

## localStorage

- `kono-auth-token` — JWT
- `focus-with-me-auth` — профиль (`useAuthStore`)
