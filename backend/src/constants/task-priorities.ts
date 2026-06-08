export const TASK_PRIORITIES = [
  "Срочный",
  "Высокий",
  "Средний",
  "Низкий",
] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export function isTaskPriority(value: string): value is TaskPriority {
  return (TASK_PRIORITIES as readonly string[]).includes(value);
}
