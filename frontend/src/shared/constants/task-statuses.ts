export const TASK_STATUSES = [
  "В очереди",
  "Выполнено",
  "Отложено",
  "Issues",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const DEFAULT_TASK_STATUS: TaskStatus = "В очереди";

export function isTaskStatus(value: string): value is TaskStatus {
  return (TASK_STATUSES as readonly string[]).includes(value);
}
