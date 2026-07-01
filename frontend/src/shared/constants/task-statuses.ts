export const TASK_STATUSES = [
  "TODO",
  "DONE",
  "DEFERRED",
  "ISSUES",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const DEFAULT_TASK_STATUS: TaskStatus = "TODO";

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'В очереди',
  DONE: 'Выполнено',
  DEFERRED: 'Отложено',
  ISSUES: 'Issues',
}

export const TASK_STATUS_FILTER_LABELS: Partial<Record<TaskStatus, string>> = {
  TODO: "Только активные",
  DONE: "Только выполненные",
  DEFERRED: "Только отложенные",
  ISSUES: "Только с issues",
}

export function getTaskFilterEmptyCopy(status: TaskStatus): {
  title: string;
  description: string;
} {
  const filterLabel =
    TASK_STATUS_FILTER_LABELS[status] ??
    TASK_STATUS_LABELS[status].toLowerCase();

  return {
    title: "Ничего не найдено",
    description: `По фильтру «${filterLabel}» задач нет. Сбросьте фильтр, чтобы увидеть все задачи проекта.`,
  };
}

export function isTaskStatus(value: string): value is TaskStatus {
  return (TASK_STATUSES as readonly string[]).includes(value);
}

export function getStatusLabel(status: TaskStatus) {
  return TASK_STATUS_LABELS[status];
}
