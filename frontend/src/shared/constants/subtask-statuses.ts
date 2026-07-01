export const SUBTASK_STATUSES = [
  "IN_PROGRESS",
  "DONE",
  "DEFERRED",
  "CANCELLED",
] as const;

export type SubtaskStatus = (typeof SUBTASK_STATUSES)[number];

export const SUBTASK_STATUS_LABELS: Record<SubtaskStatus, string> = {
  IN_PROGRESS: "В процессе",
  DONE: "Выполнено",
  DEFERRED: "Отложено",
  CANCELLED: "Отменено",
};

export function isSubtaskStatus(value: string): value is SubtaskStatus {
  return (SUBTASK_STATUSES as readonly string[]).includes(value);
}

export function getSubtaskStatusLabel(status: SubtaskStatus): string {
  return SUBTASK_STATUS_LABELS[status];
}