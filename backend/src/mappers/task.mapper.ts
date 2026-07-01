import { TaskStatus } from "../constants/task-statuses.js";

export const taskSelect = {
  id: true,
  title: true,
  description: true,
  tags: true,
  start_date: true,
  due_date: true,
  creator: true,
  status: true,
  workspace_id: true,
} as const;

export type TaskRow = {
  id: string;
  title: string;
  description: string;
  tags: string | null;
  start_date: string | null;
  due_date: string | null;
  creator: string | null;
  status: TaskStatus;
  workspace_id: string;
};

export function toTaskDto(task: TaskRow) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    tags: task.tags,
    startDate: task.start_date,
    dueDate: task.due_date,
    creator: task.creator,
    status: task.status,
    workspaceId: task.workspace_id,
  };
}
