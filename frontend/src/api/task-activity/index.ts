import { api } from "../client";
import type { ActivityType } from "@/shared/constants/activity-types";

export type { ActivityType } from "@/shared/constants/activity-types";
export { Activity, ACTIVITY_TYPES, isActivityType } from "@/shared/constants/activity-types";

export type TaskActivity = {
  id: string;
  taskId: string;
  userId: number | null;
  authorName: string | null;
  type: ActivityType | string;
  title: string;
  body: string | null;
  metadata: unknown;
  createdAt: string;
};

export async function getTaskActivityOnApi(
  taskId: string,
): Promise<TaskActivity[]> {
  const { data } = await api.get(`/tasks/${taskId}/activity`);
  return data;
}

export async function createTaskActivityOnApi(payload: {
  taskId: string;
  body: string;
  parentActivityId?: string;
}): Promise<TaskActivity> {
  const { data } = await api.post(`/tasks/${payload.taskId}/activity`, {
    body: payload.body,
    ...(payload.parentActivityId
      ? { parentActivityId: payload.parentActivityId}
      : {}),
  });
  return data;
}

export async function clearTaskActivityOnApi(taskId: string): Promise<{ok: boolean}> {
    const { data } = await api.delete(`/tasks/${taskId}/activity`);
    return data
}