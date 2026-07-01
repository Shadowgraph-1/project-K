import { SubtaskStatus } from "../generated/prisma/client.js";

export { SubtaskStatus };

export const SUBTASK_STATUSES = [
  SubtaskStatus.IN_PROGRESS,
  SubtaskStatus.DONE,
  SubtaskStatus.DEFERRED,
  SubtaskStatus.CANCELLED,
] as const;

export const SUBTASK_STATUS_LABELS: Record<SubtaskStatus, string> = {
  [SubtaskStatus.IN_PROGRESS]: "В процессе",
  [SubtaskStatus.DONE]: "Выполнено",
  [SubtaskStatus.DEFERRED]: "Отложено",
  [SubtaskStatus.CANCELLED]: "Отменено",
};

export function isSubtaskStatus(value: string): value is SubtaskStatus {
  return (SUBTASK_STATUSES as readonly string[]).includes(value);
}
