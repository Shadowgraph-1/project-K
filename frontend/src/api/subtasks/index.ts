import { api } from "../client";
import type { SubtaskStatus } from "@/shared/constants/subtask-statuses";

export type { SubtaskStatus } from "@/shared/constants/subtask-statuses";
export { SUBTASK_STATUSES, isSubtaskStatus } from "@/shared/constants/subtask-statuses";

export type Subtask = {
    id: string;
    taskId: string;
    userId: number | null;
    title: string;
    status: SubtaskStatus;
    createdAt: string;
    updatedAt: string;
};

export async function getSubtasksOnApi(taskId: string) {
    const { data } = await api.get(`/tasks/${taskId}/subtasks`);
    return data
}

export async function createSubtaskOnApi(payload: {
    taskId: string;
    title: string;
}): Promise<Subtask> {
    const { data } = await api.post(`/tasks/${payload.taskId}/subtasks`, {
        title: payload.title,
    });
    return data;
}

export async function updateSubtaskOnApi(
    id: string,
    patch: Partial<Pick<Subtask, "title" | "status">>,
): Promise<Subtask> {
    const { data } = await api.patch(`/subtasks/${id}`, patch);
    return data
}

export async function deleteSubtaskOnApi(id: string): Promise<{ ok: boolean}> {
    const { data } = await api.delete(`/subtasks/${id}`)
    return data;
}

