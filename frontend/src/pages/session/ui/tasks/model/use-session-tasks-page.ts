import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateTaskMutation } from "@/entities/task/model/use-tasks-query";
import { useWorkspaceTaskHandlers } from "@/entities/task/model/use-workspace-task-handlers";
import { getWorkspacePublicKey } from "@/entities/workspace/lib/resolve-workspace";
import { SESSION_CREATE_TASK_EVENT } from "@/shared/config/session-shortcuts";
import { notifyWithCenter } from "@/shared/lib/notifyWithCenter";

import { resolveCreatorField } from "../../../lib/sessionWorkspaceUtils";
import { SESSION_PATHS } from "../../../model/sessionPaths";
import type { CreateTaskPayload as ModalCreateTaskPayload } from "../ui/CreateTaskModal";
import { useTasksViewState } from "./use-tasks-view-state";
import { useWorkspaceTasksData } from "./use-workspace-tasks-data";

export function useSessionTasksPage() {
  const navigate = useNavigate();
  const viewState = useTasksViewState();
  const {
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    view,
    setView,
    creating,
    setCreating,
    createModalKey,
    targetWorkspaceIdRef,
    clearStatusFilter,
    openCreateForWorkspace,
  } = viewState;

  const data = useWorkspaceTasksData({
    statusFilter,
    sortBy,
    sortDirection,
  });

  const createTask = useCreateTaskMutation();
  const workspaceTaskHandlers = useWorkspaceTaskHandlers(
    data.workspaceId ?? "",
    data.tasks,
  );

  const openTaskDetails = useCallback(
    (taskId: string) => {
      const publicKey =
        data.routePublicKey ??
        getWorkspacePublicKey(
          data.workspaces,
          data.tasks.find((task) => task.id === taskId)?.workspaceId,
        );
      if (!publicKey) return;
      navigate(SESSION_PATHS.workspaceTask(publicKey, taskId));
    },
    [navigate, data.routePublicKey, data.tasks, data.workspaces],
  );

  const goBackToWorkspaceTasks = useCallback(() => {
    const publicKey =
      data.routePublicKey ??
      getWorkspacePublicKey(
        data.workspaces,
        data.workspaceId ?? data.selectedTask?.workspaceId,
      );
    if (!publicKey) {
      navigate(SESSION_PATHS.tasks);
      return;
    }
    navigate(SESSION_PATHS.workspace(publicKey));
  }, [
    data.routePublicKey,
    data.workspaceId,
    data.selectedTask,
    data.workspaces,
    navigate,
  ]);

  const headerOnCreate = useCallback(() => {
    const workspaceId = data.workspaceId ?? data.workspaces[0]?.id;
    if (!workspaceId) {
      notifyWithCenter({
        title: "Нет проектов",
        description: "Сначала создайте проект",
        variant: "warning",
      });
      return;
    }
    if (data.isWorkspaceHub && !data.routePublicKey) {
      notifyWithCenter({
        title: "Выберите проект",
        description: "Откройте проект, чтобы добавить задачу",
        variant: "warning",
      });
      return;
    }
    openCreateForWorkspace(workspaceId);
  }, [
    data.workspaceId,
    data.workspaces,
    data.isWorkspaceHub,
    data.routePublicKey,
    openCreateForWorkspace,
  ]);

  useEffect(() => {
    const onCreateTaskShortcut = () => headerOnCreate();
    window.addEventListener(SESSION_CREATE_TASK_EVENT, onCreateTaskShortcut);
    return () =>
      window.removeEventListener(
        SESSION_CREATE_TASK_EVENT,
        onCreateTaskShortcut,
      );
  }, [headerOnCreate]);

  const submitCreateTask = useCallback(
    async (payload: ModalCreateTaskPayload) => {
      const workspaceId = targetWorkspaceIdRef.current;
      if (!workspaceId) {
        notifyWithCenter({
          title: "Не выбран проект",
          description: "Выберите проект и создайте задачу снова",
          variant: "error",
        });
        throw new Error("missing workspace");
      }

      try {
        const createdTask = await createTask.mutateAsync({
          ...payload,
          workspaceId,
          creator: resolveCreatorField(payload.creator, data.user),
        });

        notifyWithCenter({
          title: "Задача создана",
          description: createdTask.title,
          variant: "success",
        });
      } catch {
        notifyWithCenter({
          title: "Не удалось создать задачу",
          description: "Проверьте соединение и попробуйте снова",
          variant: "error",
        });
        throw new Error("create task failed");
      }
    },
    [createTask, data.user, targetWorkspaceIdRef],
  );

  return {
    navigate,
    ...data,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    view,
    setView,
    creating,
    setCreating,
    createModalKey,
    targetWorkspaceIdRef,
    clearStatusFilter,
    openCreateForWorkspace,
    workspaceTaskHandlers,
    openTaskDetails,
    goBackToWorkspaceTasks,
    headerOnCreate,
    submitCreateTask,
  };
}

export type SessionTasksPageModel = ReturnType<typeof useSessionTasksPage>;
