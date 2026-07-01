import { DEFAULT_TASK_STATUS } from "@/shared/constants/task-statuses";
import { normalizeTaskPriority } from "./task-priority";
import type { Task } from "./types";
import type { TaskDTO } from "@/api/tasks";

export function mapApiTask(raw: TaskDTO): Task {
  return {
    id: String(raw.id),
    title: raw.title,
    description: raw.description ?? "",
    workspaceId: raw.workspaceId,
    startDate: raw.startDate ?? undefined,
    dueDate: raw.dueDate ?? undefined,
    creator: raw.creator ?? undefined,
    tags: normalizeTaskPriority(raw.tags) ?? undefined,
    status: raw.status ?? DEFAULT_TASK_STATUS,
  };
}
