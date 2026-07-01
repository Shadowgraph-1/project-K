import { useCallback } from "react";

import type { Task } from "@/entities/task/model/types";
import {
  useDeleteAllTasksMutation,
  useDeleteTaskMutation,
} from "@/entities/task/model/use-tasks-query";
import { notifyWithCenter } from "@/shared/lib/notifyWithCenter";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";

export function useWorkspaceTaskHandlers(workspaceId: string, tasks: Task[]) {
  const deleteTask = useDeleteTaskMutation();
  const deleteAllTasks = useDeleteAllTasksMutation();

  const removeTaskCore = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      const label = task?.title?.trim() || id;
      try {
        await deleteTask.mutateAsync({ id, workspaceId });
        return { ok: true as const, label };
      } catch {
        notifyWithCenter({
          title: "Сервер недоступен",
          description: "Не удалось удалить задачу. Попробуйте позже",
          variant: "warning",
        });
        return { ok: false as const, label };
      }
    },
    [deleteTask, tasks, workspaceId],
  );

  const onRemove = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      const label = task?.title?.trim() || id;
      const confirmed = await notifyConfirm({
        title: "Удалить задачу?",
        description: task
          ? `Будет удалена задача «${label}»`
          : `Будет удалена задача (id: ${id})`,
        confirmLabel: "Удалить",
        cancelLabel: "Отмена",
      });
      if (!confirmed) return;
      const result = await removeTaskCore(id);
      if (result.ok) {
        notifyWithCenter({
          title: "Задача удалена",
          description: `«${result.label}» удалена`,
          variant: "success",
        });
      }
    },
    [tasks, removeTaskCore],
  );

  const onRemoveAll = useCallback(async () => {
    try {
      await deleteAllTasks.mutateAsync(workspaceId);
      notifyWithCenter({
        title: "Задачи удалены",
        description: "Список в этом проекте очищен",
        variant: "success",
      });
    } catch {
      notifyWithCenter({
        title: "Сервер недоступен",
        description: "Не удалось очистить список",
        variant: "warning",
      });
    }
  }, [deleteAllTasks, workspaceId]);

  return {
    onRemove,
    onRemoveAll,
    removeTaskCore,
  };
}
