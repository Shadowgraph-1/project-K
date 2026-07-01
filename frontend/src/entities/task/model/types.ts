import {
  DEFAULT_TASK_STATUS,
  TASK_STATUSES,
  type TaskStatus,
} from "@/shared/constants/task-statuses";

export type { TaskStatus };
export { DEFAULT_TASK_STATUS, TASK_STATUSES };

export const TASK_PRIORITIES = [
  "Срочный",
  "Высокий",
  "Средний",
  "Низкий",
] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export type Task = {
  id: string;
  title: string;
  description: string;
  workspaceId: string;
  startDate?: string;
  dueDate?: string;
  creator?: string;
  tags?: TaskPriority;
  status?: TaskStatus;
};

/** @deprecated use Task */
export type Tasks = Task;

export function getTaskStatus(task: Task): TaskStatus {
  return task.status ?? DEFAULT_TASK_STATUS;
}
