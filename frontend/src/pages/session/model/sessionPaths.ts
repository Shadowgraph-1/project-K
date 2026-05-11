/** Маршруты раздела «Сессия» — совпадают с `App.tsx`. */
export const SESSION_PATHS = {
  root: "/",
  sessionRoot: "/session",
  tasks: "/session/tasks",
  projects: "/session/projects",
  kanban: "/session/kanban",
  teamMembers: "/session/team/members",
  teamSprints: "/session/team/sprints",
  workspaceNew: "/session/workspace/new",
  workspace: (cardId: string) => `/session/workspace/${cardId}`,
} as const;

export const SESSION_ROUTE_PLACEHOLDERS: Record<
  string,
  { title: string; description: string }
> = {
  [SESSION_PATHS.tasks]: {
    title: "Задачи",
    description:
      "Общий список всех issues по воркспейсам. Здесь будет таблица, фильтры и пагинация.",
  },
  [SESSION_PATHS.projects]: {
    title: "Проекты",
    description: "Список проектов внутри воркспейса и их статусы.",
  },
  [SESSION_PATHS.kanban]: {
    title: "Канбан",
    description: "Доска по статусам с перетаскиванием карточек.",
  },
  [SESSION_PATHS.teamMembers]: {
    title: "Участники",
    description: "Кто состоит в текущем воркспейсе и роли.",
  },
  [SESSION_PATHS.teamSprints]: {
    title: "Спринты",
    description: "Циклы, даты и задачи внутри спринта.",
  },
};
