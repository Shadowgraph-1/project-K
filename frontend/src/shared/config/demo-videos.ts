export type DemoVideo = {
  id: string;
  src: string;
  eyebrow: string;
  title: string;
  description: string;
};

export const HOME_DEMO_VIDEOS: DemoVideo[] = [
  {
    id: "projects",
    src: "/demo/create-projects.webm",
    eyebrow: "Проекты",
    title: "Создайте пространство за минуту",
    description:
      "Шаблоны «Диплом», «Работа», «Личное» или своё название — проект готов, можно сразу добавлять задачи и приглашать команду.",
  },
  {
    id: "tasks",
    src: "/demo/create-tasks.webm",
    eyebrow: "Задачи",
    title: "Добавляйте задачи без лишних кликов",
    description:
      "Название, автор и проект — всё в одном окне. Новая задача сразу появляется в списке и в боковой панели.",
  },
  {
    id: "kanban",
    src: "/demo/kanban-views.webm",
    eyebrow: "Виды",
    title: "Список, даты и канбан",
    description:
      "Переключайте вид под задачу: таблица для фокуса, лента дат для дедлайнов, канбан — для обзора статусов.",
  },
  {
    id: "statuses",
    src: "/demo/task-statuses.webm",
    eyebrow: "Статусы",
    title: "Меняйте статус в один клик",
    description:
      "В очереди, выполнено, отложено или issues — всё в карточке задачи. История изменений сохраняется автоматически.",
  },
  {
    id: "ai",
    src: "/demo/kono-ai.webm",
    eyebrow: "Kono AI",
    title: "Спросите компаньона в контексте проекта",
    description:
      "AI-чат открывается рядом с задачами — можно уточнить план, разобрать приоритеты и не терять контекст работы.",
  },
] as const;
