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
      "Шаблоны «Диплом», «Работа», «Личное» или сделай свое — проект готов, можно сразу добавлять задачи и приглашать команду.",
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
      "Переключайте вид для вашего удобства: таблица для фокуса, лента дат для дедлайнов, канбан — для обзора статусов.",
  },
  {
    id: "statuses",
    src: "/demo/task-statuses.webm",
    eyebrow: "Статусы",
    title: "Меняйте статус в одно нажатие",
    description:
      "В очереди, выполнено, отложено или issues — всё в карточке задачи. История изменений сохраняется автоматически.",
  },
  {
    id: "ai",
    src: "/demo/kono-ai.webm",
    eyebrow: "Kono AI",
    title: "Задай вопрос пероснальному помощнику",
    description:
      "AI-чат открывается рядом с задачами — можно уточнить план, разобрать приоритеты или просто поболтать.",
  },
] as const;
