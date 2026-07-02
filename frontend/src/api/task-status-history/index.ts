import { api } from "../client";
import type { TaskStatus } from "@/shared/constants/task-statuses";

export type TaskStatusHistoryEntry = {
  id: string;
  taskId: string;
  fromStatus: TaskStatus | null;
  toStatus: TaskStatus;
  userId: number | null;
  userName: string | null;
  changedAt: string;
};

export async function getTaskStatusHistoryOnApi(
  taskId: string,
): Promise<TaskStatusHistoryEntry[]> {
  const { data } = await api.get(`/tasks/${taskId}/status-history`);
  return data;
}
