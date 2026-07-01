import { useCallback } from "react";

import type { TaskPatch } from "@/api/tasks";
import { notify } from "@/shared/lib/notify";

import { useUpdateTaskMutation } from "./use-tasks-query";

type SaveTaskPatchOptions = {
  description?: string;
};

export function useSaveTaskPatch(taskId: string, workspaceId: string) {
  const updateTask = useUpdateTaskMutation();

  return useCallback(
    async (patch: TaskPatch, options?: SaveTaskPatchOptions) => {
      try {
        await updateTask.mutateAsync({ id: taskId, patch, workspaceId });
      } catch {
        notify({
          title: "Ошибка запроса",
          description: options?.description ?? "Не удалось сохранить",
          variant: "error",
        });
      }
    },
    [taskId, updateTask, workspaceId],
  );
}
