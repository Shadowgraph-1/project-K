import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { findWorkspaceByPublicKey } from "@/entities/workspace/lib/resolve-workspace";
import type { Task } from "@/entities/task/model/types";
import type { Subtask } from "@/api/subtasks";
import { queryKeys } from "@/shared/api/query-keys";
import type { Workspace } from "@/entities/workspace/model/workspace";

import { useParams } from "react-router-dom";

export type AssistantChatContextPayload = {
  context?: {
    workspaceId: string;
    workspaceName: string;
    taskId?: string;
    taskTitle?: string;
  };
  workspaces: Array<{
    id: string;
    name: string;
    publicKey: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    done: boolean;
    description?: string;
  }>;
  subtasks: Array<{
    id: string;
    title: string;
    done: boolean;
  }>;
};

export function useAssistantContext(): AssistantChatContextPayload {
  const queryClient = useQueryClient();
  const { publicKey, taskId } = useParams<{
    publicKey?: string;
    taskId?: string;
  }>();

  return useMemo(() => {
    const workspaces =
      queryClient.getQueryData<Workspace[]>(queryKeys.workspaces) ?? [];
    const workspaceSummaries = workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.title,
      publicKey: workspace.publicKey,
    }));
    const activeWorkspace = findWorkspaceByPublicKey(workspaces, publicKey);

    if (!activeWorkspace) {
      return { workspaces: workspaceSummaries, tasks: [], subtasks: [] };
    }

    const rawTasks =
      queryClient.getQueryData<Task[]>(
        queryKeys.tasks.byWorkspace(activeWorkspace.id, {}),
      ) ?? [];

    const tasks = rawTasks.map((task) => ({
      id: task.id,
      title: task.title,
      done: task.status === "DONE",
      description: task.description || undefined,
    }));

    const selectedTask = taskId
      ? tasks.find((task) => task.id === taskId)
      : undefined;

    const subtasks = taskId
      ? (queryClient.getQueryData<Subtask[]>(queryKeys.subtasks(taskId)) ?? []).map(
          (subtask) => ({
            id: subtask.id,
            title: subtask.title,
            done: subtask.status === "DONE",
          }),
        )
      : [];

    return {
      workspaces: workspaceSummaries,
      context: {
        workspaceId: activeWorkspace.id,
        workspaceName: activeWorkspace.title,
        ...(selectedTask
          ? { taskId: selectedTask.id, taskTitle: selectedTask.title }
          : {}),
      },
      tasks,
      subtasks,
    };
  }, [queryClient, publicKey, taskId]);
}