export const SUBTASK_STATUSES = [
  "В процессе",
  "Выполнено",
  "Отложено",
  "Отменено",
] as const;

export type SubtaskStatus = (typeof SUBTASK_STATUSES)[number];

export function isSubtaskStatus(value: string): value is SubtaskStatus {
  return (SUBTASK_STATUSES as readonly string[]).includes(value);
}
