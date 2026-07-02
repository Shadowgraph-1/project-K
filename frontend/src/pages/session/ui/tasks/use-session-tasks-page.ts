import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { SESSION_CREATE_TASK_EVENT } from "@/shared/config/session-shortcuts";
import { useWorkspaceQuery } from "@/entities/workspace/model/use-workspace-query";
import {
  findWorkspaceByPublicKey,
  getWorkspacePublicKey,
} from "@/entities/workspace/lib/resolve-workspace";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import {
  useTasksQueries,
  useTasksQuery,
  useCreateTaskMutation,
} from "@/entities/task/model/use-tasks-query";
import { useWorkspaceTaskHandlers } from "@/entities/task/model/use-workspace-task-handlers";
import { resolveCreatorField } from "../../lib/sessionWorkspaceUtils";
import type { CreateTaskPayload as ModalCreateTaskPayload } from "./CreateTaskModal";
import type { TasksView, TaskSort, TaskSortDirection } from "../tasks/sessionWorkspaceTypes";
import { sortTasks } from "../../lib/sort-tasks";
import {
  parseWorkspaceParams,
  SESSION_PATHS,
} from "../../model/sessionPaths";
import { notifyWithCenter } from "@/shared/lib/notifyWithCenter";
import { canPerformWorkspaceAction } from "@/shared/lib/workspace-permissions";
import type { TaskStatus } from "@/shared/constants/task-statuses";

export function useSessionTasksPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isWorkspaceHub = location.pathname === SESSION_PATHS.tasks;
  const { publicKey: routePublicKey, taskId: routeTaskId } =
    parseWorkspaceParams(location.pathname);

  const { data: workspaces = [], isLoading: workspacesLoading } =
    useWorkspaceQuery();

  const user = useAuthStore((state) => state.user);
  const createTask = useCreateTaskMutation();

  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null);
  const [sortBy, setSortBy] = useState<TaskSort>("created");
  const [sortDirection, setSortDirection] = useState<TaskSortDirection>("desc");
  const [view, setView] = useState<TasksView>("line");
  const [creating, setCreating] = useState(false);
  const [createModalKey, setCreateModalKey] = useState(0);
  const targetWorkspaceIdRef = useRef<string | null>(null);

  const clearStatusFilter = useCallback(() => setStatusFilter(null), []);

  const workspaceIds = useMemo(() => workspaces.map((w) => w.id), [workspaces]);
  const hubTaskQueries = useTasksQueries(isWorkspaceHub ? workspaceIds : []);
  const taskCountByWorkspaceId = useMemo(() => {
    const map = new Map<string, number>();
    workspaces.forEach((ws, index) => {
      map.set(ws.id, hubTaskQueries[index]?.data?.length ?? 0);
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

  const openTaskDetails = useCallback(
    (taskId: string) => {
      const publicKey =
        routePublicKey ??
        getWorkspacePublicKey(
          workspaces,
          tasks.find((task) => task.id === taskId)?.workspaceId,
        );
      if (!publicKey) return;
      navigate(SESSION_PATHS.workspaceTask(publicKey, taskId));
    },
    [navigate, routePublicKey, tasks, workspaces],
  );

  const goBackToWorkspaceTasks = useCallback(() => {
    const publicKey =
      routePublicKey ??
      getWorkspacePublicKey(
        workspaces,
        workspaceId ?? selectedTask?.workspaceId,
      );
    if (!publicKey) {
      navigate(SESSION_PATHS.tasks);
      return;
    }
    navigate(SESSION_PATHS.workspace(publicKey));
  }, [routePublicKey, workspaceId, selectedTask, workspaces, navigate]);

  const openCreateForWorkspace = useCallback((wsId: string) => {
    targetWorkspaceIdRef.current = wsId;
    setCreateModalKey((k) => k + 1);
    setCreating(true);
  }, []);

  const headerOnCreate = useCallback(() => {
    const id = workspaceId ?? workspaces[0]?.id;
    if (!id) {
      notifyWithCenter({
        title: "Нет проектов",
        description: "Сначала создайте проект",
        variant: "warning",
      });
      return;
    }
    if (isWorkspaceHub && !routePublicKey) {
      notifyWithCenter({
        title: "Выберите проект",
        description: "Откройте проект, чтобы добавить задачу",
        variant: "warning",
      });
      return;
    }
    openCreateForWorkspace(id);
  }, [
    workspaceId,
    routePublicKey,
    workspaces,
    openCreateForWorkspace,
    isWorkspaceHub,
  ]);

  useEffect(() => {
    const onCreateTaskShortcut = () => headerOnCreate();
    window.addEventListener(SESSION_CREATE_TASK_EVENT, onCreateTaskShortcut);
    return () =>
      window.removeEventListener(SESSION_CREATE_TASK_EVENT, onCreateTaskShortcut);
  }, [headerOnCreate]);

  const totalCount = sortedTasks.length;

  const canCreateTask = canPerformWorkspaceAction(
    activeWorkspace?.myRole,
    "create_task",
  );
  const workspaceTaskHandlers = useWorkspaceTaskHandlers(
    workspaceId ?? "",
    tasks,
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

  async function submitCreateTask(payload: ModalCreateTaskPayload) {
    const wsId = targetWorkspaceIdRef.current;
    if (!wsId) {
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
        workspaceId: wsId,
        creator: resolveCreatorField(payload.creator, user),
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
  }

  return {
    navigate,
    isWorkspaceHub,
    routePublicKey,
    routeTaskId,
    workspaces,
    workspacesLoading,
    user,
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
    taskCountByWorkspaceId,
    activeWorkspace,
    workspaceId,
    tasks,
    tasksLoading,
    selectedTask,
    sortedTasks,
    selectedTaskWorkspaceName,
    openTaskDetails,
    goBackToWorkspaceTasks,
    openCreateForWorkspace,
    headerOnCreate,
    totalCount,
    canCreateTask,
    workspaceTaskHandlers,
    showEmptyHub,
    showUnknownWorkspace,
    showUnknownTask,
    showTasksListHeader,
    showTaskSettings,
    taskCountLabel,
    submitCreateTask,
  };
}
