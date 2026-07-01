import { useMemo, useState } from "react";

import type { AssistantContextItem } from "@/hooks/use-assistant-chat";
import { useSubtasksQueries } from "@/entities/subtask/model/use-subtasks-query";
import { getTaskStatus } from "@/entities/task/model/types";
import { useTasksQuery } from "@/entities/task/model/use-tasks-query";
import type { Workspace } from "@/entities/workspace/model/workspace";
import { findWorkspaceByPublicKey } from "@/entities/workspace/lib/resolve-workspace";

const EMPTY_CONTEXT: AssistantContextItem[] = [];

type UseAssistantContextOptions = {
  publicKey?: string;
  workspaces: Workspace[];
};

export type AssistantContext = {
  withTask: boolean;
  toggleWithTask: () => void;
  tasksContext: AssistantContextItem[];
  subtasksContext: AssistantContextItem[];
};

export function useAssistantContext({
  publicKey,
  workspaces,
}: UseAssistantContextOptions): AssistantContext {
  const [withTask, setWithTask] = useState(false);

  const activeWorkspace = findWorkspaceByPublicKey(workspaces, publicKey);
  const { data: tasks = [] } = useTasksQuery(activeWorkspace?.id);

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const subtaskQueries = useSubtasksQueries(
    withTask && activeWorkspace ? taskIds : [],
  );

  const tasksContext = useMemo<AssistantContextItem[]>(
    () =>
      withTask
        ? tasks.map((task) => ({
            title: task.title,
            done: getTaskStatus(task) === "DONE",
            description: task.description || undefined,
          }))
        : EMPTY_CONTEXT,
    [withTask, tasks],
  );

  const subtasksContext = useMemo<AssistantContextItem[]>(() => {
    if (!withTask) return EMPTY_CONTEXT;

    const items: AssistantContextItem[] = [];
    tasks.forEach((task, index) => {
      for (const subtask of subtaskQueries[index]?.data ?? []) {
        items.push({
          title: `${task.title} -> ${subtask.title}`,
          done: subtask.status === "DONE",
        });
      }
    });
    return items;
  }, [withTask, tasks, subtaskQueries]);

  return {
    withTask,
    toggleWithTask: () => setWithTask((v) => !v),
    tasksContext,
    subtasksContext,
  };
}
