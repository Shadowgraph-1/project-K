import { TaskStatus } from "../generated/prisma/client.js";

export { TaskStatus };

export const TASK_STATUSES = [
  TaskStatus.TODO,
  TaskStatus.DONE,
  TaskStatus.DEFERRED,
  TaskStatus.ISSUES,
] as const;

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "В очереди",
  [TaskStatus.DONE]: "Выполнено",
  [TaskStatus.DEFERRED]: "Отложено",
  [TaskStatus.ISSUES]: "Issues",
};

export function isTaskStatus(value: string): value is TaskStatus {
  return (TASK_STATUSES as readonly string[]).includes(value);
}
