import { useMemo } from "react";
import { useMatch, useParams } from "react-router-dom";

import { useAuthStore } from "@/entities/user/model/useAuthStore";
import {
  useTasksQueries,
  useTasksQuery,
} from "@/entities/task/model/use-tasks-query";
import { findWorkspaceByPublicKey } from "@/entities/workspace/lib/resolve-workspace";
import { useWorkspaceQuery } from "@/entities/workspace/model/use-workspace-query";
import { sortTasks } from "@/features/tasks/lib/sort-tasks";
import type { TaskStatus } from "@/shared/constants/task-statuses";
import { canPerformWorkspaceAction } from "@/shared/lib/workspace-permissions";

import { SESSION_PATHS } from "../../../model/sessionPaths";
import type { TaskSort, TaskSortDirection } from "./sessionWorkspaceTypes";

type WorkspaceTasksDataParams = {
  statusFilter: TaskStatus | null;
  sortBy: TaskSort;
  sortDirection: TaskSortDirection;
};

export function useWorkspaceTasksData({
  statusFilter,
  sortBy,
  sortDirection,
}: WorkspaceTasksDataParams) {
  const { publicKey: routePublicKey, taskId: routeTaskId } = useParams<{
    publicKey?: string;
    taskId?: string;
  }>();
  const isWorkspaceHub =
    useMatch({ path: SESSION_PATHS.tasks, end: true }) !== null;

  const { data: workspaces = [], isLoading: workspacesLoading } =
    useWorkspaceQuery();
  const user = useAuthStore((state) => state.user);

  const workspaceIds = useMemo(
    () => workspaces.map((workspace) => workspace.id),
    [workspaces],
  );

  const hubTaskQueries = useTasksQueries(isWorkspaceHub ? workspaceIds : []);

  const taskCountByWorkspaceId = useMemo(() => {
    const map = new Map<string, number>();
    workspaces.forEach((workspace, index) => {
      map.set(workspace.id, hubTaskQueries[index]?.data?.length ?? 0);
    });
    return map;
  }, [workspaces, hubTaskQueries]);

  const activeWorkspace = useMemo(
    () => findWorkspaceByPublicKey(workspaces, routePublicKey),
    [routePublicKey, workspaces],
  );
  const workspaceId = activeWorkspace?.id;

  const { data: tasks = [], isLoading: tasksLoading } = useTasksQuery(
    isWorkspaceHub ? undefined : workspaceId,
    statusFilter ? { status: statusFilter } : {},
  );

  const selectedTask = useMemo(
    () =>
      routeTaskId
        ? (tasks.find((task) => task.id === routeTaskId) ?? null)
        : null,
    [tasks, routeTaskId],
  );

  const sortedTasks = useMemo(() => {
    const tasksInView = isWorkspaceHub || !workspaceId ? [] : tasks;
    return sortTasks(tasksInView, sortBy, sortDirection);
  }, [isWorkspaceHub, workspaceId, tasks, sortBy, sortDirection]);

  const selectedTaskWorkspaceName = useMemo(
    () =>
      selectedTask
        ? workspaces.find(
            (workspace) => workspace.id === selectedTask.workspaceId,
          )?.title
        : undefined,
    [selectedTask, workspaces],
  );

  const totalCount = sortedTasks.length;

  const canCreateTask = canPerformWorkspaceAction(
    activeWorkspace?.myRole,
    "create_task",
  );

  const showEmptyHub = !workspacesLoading && workspaces.length === 0;
  const showUnknownWorkspace =
    !workspacesLoading &&
    !isWorkspaceHub &&
    Boolean(routePublicKey) &&
    !activeWorkspace;
  const showUnknownTask =
    Boolean(routeTaskId) && !tasksLoading && !selectedTask;
  const showTasksListHeader =
    !routeTaskId &&
    !showEmptyHub &&
    !showUnknownWorkspace &&
    (isWorkspaceHub
      ? !workspacesLoading && workspaces.length > 0
      : Boolean(activeWorkspace) &&
        !tasksLoading &&
        (totalCount > 0 || statusFilter !== null));
  const showTaskSettings =
    !routeTaskId &&
    !isWorkspaceHub &&
    Boolean(activeWorkspace) &&
    !tasksLoading &&
    (totalCount > 0 || statusFilter !== null);

  const taskCountLabel = `${totalCount} ${
    totalCount === 1 ? "задача" : totalCount < 5 ? "задачи" : "задач"
  }`;

  return {
    isWorkspaceHub,
    routePublicKey,
    routeTaskId,
    workspaces,
    workspacesLoading,
    user,
    activeWorkspace,
    workspaceId,
    tasks,
    tasksLoading,
    selectedTask,
    sortedTasks,
    selectedTaskWorkspaceName,
    taskCountByWorkspaceId,
    totalCount,
    canCreateTask,
    showEmptyHub,
    showUnknownWorkspace,
    showUnknownTask,
    showTasksListHeader,
    showTaskSettings,
    taskCountLabel,
  };
}
