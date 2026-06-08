import { api } from "../client";
import type { TaskPriority, Tasks } from "@/entities/task/model/useSessionTasks";

export type TaskPatch = Partial<
  Pick<
    Tasks,
    | "title"
    | "description"
    | "startDate"
    | "dueDate"
    | "creator"
    | "status"
  >
> & {
  /** Pass `""` to clear priority stored in `tags`. */
  tags?: TaskPriority | "";
};

export async function getTaskOnApi(workspace_id: string) {
  const { data } = await api.get(`/tasks?workspaceId=${workspace_id}`);
  return data;
}

export async function createTaskOnApi(payload: {
  title: string;
  description?: string;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  creator?: string;
  workspaceId: string;
}) {
  const { data } = await api.post("/tasks", payload);
  return data;
}

export async function deleteTaskOnApi(id: string) {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
}

export async function deleteAllTasksInWorkspaceOnApi(workspaceId: string) {
  const { data } = await api.delete(`/tasks?workspaceId=${workspaceId}`);
  return data;
}

export async function updateTaskOnAPI(id: string, patch: TaskPatch) {
  const { data } = await api.patch(`/tasks/${id}`, patch);
  return data;
}
