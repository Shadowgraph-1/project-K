import { api } from "../client";
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/entities/task/model/types";


export type TaskDTO = {
  id: string;
  title: string;
  description: string;
  tags: string | null;
  startDate: string | null;
  dueDate: string | null;
  creator: string | null;
  status: TaskStatus;
  workspaceId: string;
};

export type TaskPatch = Partial<
  Pick<
    Task,
    | "title"
    | "description"
    | "startDate"
    | "dueDate"
    | "creator"
    | "status"
  >
> & {
  tags?: TaskPriority | "";
};

export type TaskListParams = {
  workspaceId: string;
  status?: TaskStatus;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  creator?: string;
  workspaceId: string;
};

export async function getTaskOnApi({
  workspaceId,
  status,
}: TaskListParams): Promise<TaskDTO[]> {
  const { data } = await api.get<TaskDTO[]>("/tasks", {
    params: {
      workspaceId,
      ...(status ? { status } : {}),
    },
  });
  return data;
}

export async function createTaskOnApi(
  payload: CreateTaskPayload,
): Promise<TaskDTO> {
  const { data } = await api.post<TaskDTO>("/tasks", payload);
  return data;
}

export async function deleteTaskOnApi(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

export async function deleteAllTasksInWorkspaceOnApi(
  workspaceId: string,
): Promise<void> {
  await api.delete(`/tasks?workspaceId=${workspaceId}`);
}

export async function updateTaskOnAPI(
  id: string,
  patch: TaskPatch,
): Promise<TaskDTO> {
  const { data } = await api.patch<TaskDTO>(`/tasks/${id}`, patch);
  return data;
}
