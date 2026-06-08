import { useCallback, useEffect, useMemo, useState, memo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

import {
  useSessionTasks,
  type TaskStatus,
  type Tasks,
} from "@/entities/task/model/useSessionTasks";
import { useWorkspaceQuery } from "@/entities/workspace/model/useWorkspaceStoreQuery";
import { useAuthStore } from "@/entities/user/model/useAuthStore";

import WorkspaceTaskSubheader from "./Workspacetasksubheader";
import { CreateTaskModal } from "./CreateTaskModal";
import { WorkspaceTasksSection } from "./WorkspaceTasksSection";
import { TaskCheckedSelectionBar } from "./TaskCheckedSelectionBar";

import {
  resolveCreatorField,
  suggestedCreatorLabel,
} from "../../lib/sessionWorkspaceUtils";
import type { TasksView } from "./sessionWorkspaceTypes";
import { SESSION_PATHS } from "../../model/sessionPaths";
import { notifyWithCenter } from "@/shared/lib/notifyWithCenter";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import EmptySession from "../workspace/EmptySession";
import { WorkspaceHubPicker } from "../workspace/WorkspaceHubPicker";
import { Button } from "@/shared/ui/button";
import {
  createTaskOnApi,
  deleteTaskOnApi,
  deleteAllTasksInWorkspaceOnApi,
  getTaskOnApi,
  updateTaskOnAPI,
} from "@/api/tasks";
import { WorkspaceHubListSkeleton } from "../workspace/WorkspaceHubListSkeleton";
import { WorkspaceTasksSkeleton } from "./WorkspaceTasksSkeleton";
import TaskDetailsPage from "./TaskDetailsPage";
import { notify } from "../widgets/SonnerWidget";
import { cn } from "@/shared/lib/utils";
import { canPerformWorkspaceAction } from "@/shared/lib/workspace-permissions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";

function invalidateWorkspaceTasks(
  queryClient: ReturnType<typeof useQueryClient>,
  workspaceId: string,
) {
  if (!workspaceId) return;
  void queryClient.invalidateQueries({
    queryKey: queryKeys.tasks.byWorkspace(workspaceId),
  });
}

function useWorkspaceTaskHandlers(workspaceId: string) {
  const queryClient = useQueryClient();
  const removeTask = useSessionTasks((s) => s.removeTask);
  const removeAllTask = useSessionTasks((s) => s.removeTasksInWorkspace);
  const tasks = useSessionTasks((s) => s.tasks);
  const removeTaskCore = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      const label = task?.title?.trim() || id;
      try {
        await deleteTaskOnApi(id);
        removeTask(id);
        invalidateWorkspaceTasks(queryClient, workspaceId);
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
    [queryClient, removeTask, tasks, workspaceId],
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
    [removeTaskCore, tasks],
  );
  const onRemoveAll = useCallback(async () => {
    let synced = false;
    try {
      await deleteAllTasksInWorkspaceOnApi(workspaceId);
      synced = true;
    } catch {
      notifyWithCenter({
        title: "Сервер недоступен",
        description: "Очистили список только в этом браузере",
        variant: "warning",
      });
    }
    removeAllTask(workspaceId);
    if (synced) {
      invalidateWorkspaceTasks(queryClient, workspaceId);
      notifyWithCenter({
        title: "Задачи удалены",
        description: "Список в этом проекте очищен",
        variant: "success",
      });
    }
  }, [queryClient, workspaceId, removeAllTask]);
  return {
    onRemove,
    onRemoveAll,
    removeTaskCore,
  };
}

type WorkspaceTasksBlockProps = {
  workspaceId: string;
  view: TasksView;
  tasks: Tasks[];
  creating: boolean;
  onOpenCreate?: () => void;
  onOpenTask: (taskId: string) => void;
};

const WorkspaceTasksBlockInner = memo(function WorkspaceTasksBlockInner({
  workspaceId,
  view,
  tasks,
  creating,
  onOpenCreate,
  onOpenTask,
}: WorkspaceTasksBlockProps) {
  const queryClient = useQueryClient();
  const handlers = useWorkspaceTaskHandlers(workspaceId ?? "");

  const { data: workspace = [] } = useWorkspaceQuery();
  const workspaceName = workspace.find((w) => w.id === workspaceId)?.title;

  const updateTask = useSessionTasks((t) => t.updateTask);
  const toggleTaskChecked = useSessionTasks((s) => s.toggleTaskChecked);
  const clearCheckedInWorkspace = useSessionTasks(
    (s) => s.clearCheckedInWorkspace,
  );

  const selectedCount = useMemo(
    () => tasks.filter((t) => t.checked).length,
    [tasks],
  );

  const isTaskChecked = useCallback((task: Tasks) => Boolean(task.checked), []);

  const onToggleTaskChecked = useCallback(
    (id: string) => {
      toggleTaskChecked(id);
    },
    [toggleTaskChecked],
  );

  const onClearSelection = useCallback(() => {
    clearCheckedInWorkspace(workspaceId);
  }, [clearCheckedInWorkspace, workspaceId]);

  const onDeleteSelected = useCallback(async () => {
    const selected = tasks.filter((t) => t.checked);
    if (selected.length === 0) return;

    const confirmed = await notifyConfirm({
      title: "Удалить выбранные задачи?",
      description: `Будет удалено: ${selected.length}`,
      confirmLabel: "Удалить",
      cancelLabel: "Отмена",
    });
    if (!confirmed) return;

    let removed = 0;
    for (const task of selected) {
      const result = await handlers.removeTaskCore(task.id);
      if (result.ok) removed += 1;
    }

    if (removed > 0) {
      notifyWithCenter({
        title: removed === 1 ? "Задача удалена" : `Удалено задач: ${removed}`,
        variant: "success",
      });
      clearCheckedInWorkspace(workspaceId);
    }
  }, [tasks, handlers, clearCheckedInWorkspace, workspaceId]);

  const onStatusSelected = useCallback(
    async (status: TaskStatus) => {
      const selected = tasks.filter((t) => t.checked);
      if (selected.length === 0) return;

      try {
        await Promise.all(
          selected.map(async (task) => {
            const updated = await updateTaskOnAPI(task.id, { status });
            updateTask(task.id, updated);
          }),
        );

        clearCheckedInWorkspace(workspaceId);
        invalidateWorkspaceTasks(queryClient, workspaceId);

        notify({
          title: "Статус обновлён",
          description: `Изменено задач: ${selected.length}`,
          variant: "success",
        });
        notifyWithCenter({
          title: "Статус для задач изменен",
          description: "Успешно",
          variant: "success",
        });
      } catch {
        notify({
          title: "Ошибка запроса",
          description: "Не удалось изменить статус выбранных задач",
          variant: "error",
        });
      }
    },
    [tasks, updateTask, clearCheckedInWorkspace, workspaceId, queryClient],
  );

  return (
    <>
      <section
        id={`workspace-section-${workspaceId}`}
        className="flex min-w-0 scroll-mt-24 flex-col gap-2"
      >
        <WorkspaceTasksSection
          view={view}
          tasks={tasks}
          creating={creating}
          workspaceName={workspaceName}
          isTaskChecked={isTaskChecked}
          onToggleTaskChecked={onToggleTaskChecked}
          onOpenCreate={onOpenCreate}
          onRemove={handlers.onRemove}
          onOpenTask={onOpenTask}
        />
      </section>

      <TaskCheckedSelectionBar
        count={selectedCount}
        onClear={onClearSelection}
        onDeletedSelected={onDeleteSelected}
        onStatusSelected={onStatusSelected}
      />
    </>
  );
});

function SessionTasksPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isWorkspaceHub = location.pathname === SESSION_PATHS.tasks;
  const { workspaceId: routeWorkspaceId, taskId: routeTaskId } = useParams<{
    workspaceId?: string;
    taskId?: string;
  }>();

  const queryClient = useQueryClient();

  const { data: workspaces = [], isLoading: workspacesLoading } =
    useWorkspaceQuery();

  const allTasks = useSessionTasks((s) => s.tasks);
  const addTask = useSessionTasks((s) => s.addTask);
  const setTasksForWorkspace = useSessionTasks((s) => s.setTasksForWorkspace);

  const user = useAuthStore((state) => state.user);

  const [view, setView] = useState<TasksView>("line");
  const [creating, setCreating] = useState(false);
  const [createModalKey, setCreateModalKey] = useState(0);
  const [targetWorkspaceId, setTargetWorkspaceId] = useState<string | null>(
    null,
  );

  const { data: fetchedTasks, isLoading: tasksLoading } = useQuery({
    queryKey: queryKeys.tasks.byWorkspace(routeWorkspaceId ?? ""),
    queryFn: () => getTaskOnApi(routeWorkspaceId!),
    enabled: !!routeWorkspaceId && !isWorkspaceHub,
  });

  useEffect(() => {
    if (!routeWorkspaceId || isWorkspaceHub || fetchedTasks == null) return;
    setTasksForWorkspace(routeWorkspaceId, fetchedTasks as Tasks[]);
  }, [fetchedTasks, routeWorkspaceId, isWorkspaceHub, setTasksForWorkspace]);

  const selectedTask = useMemo(
    () =>
      routeTaskId
        ? (allTasks.find((task) => task.id === routeTaskId) ?? null)
        : null,
    [allTasks, routeTaskId],
  );

  const effectiveWorkspaceId = routeWorkspaceId ?? selectedTask?.workspaceId;

  const selectedTaskWorkspaceName = useMemo(
    () =>
      selectedTask
        ? workspaces.find(
            (workspace) => workspace.id === selectedTask.workspaceId,
          )?.title
        : undefined,
    [selectedTask, workspaces],
  );

  const activeWorkspace = useMemo(
    () =>
      routeWorkspaceId
        ? workspaces.find((w) => w.id === routeWorkspaceId)
        : undefined,
    [routeWorkspaceId, workspaces],
  );

  const tasksInView = useMemo(() => {
    if (isWorkspaceHub || !effectiveWorkspaceId) return [];
    return allTasks.filter((t) => t.workspaceId === effectiveWorkspaceId);
  }, [allTasks, effectiveWorkspaceId, isWorkspaceHub]);

  const openTaskDetails = useCallback(
    (taskId: string) => {
      const workspaceId =
        routeWorkspaceId ??
        allTasks.find((task) => task.id === taskId)?.workspaceId;
      if (!workspaceId) return;
      navigate(SESSION_PATHS.projectTask(workspaceId, taskId));
    },
    [navigate, routeWorkspaceId, allTasks],
  );

  const goBackToWorkspaceTasks = useCallback(() => {
    if (!effectiveWorkspaceId) {
      navigate(SESSION_PATHS.tasks);
      return;
    }
    navigate(SESSION_PATHS.project(effectiveWorkspaceId));
  }, [effectiveWorkspaceId, navigate]);

  const openCreateForWorkspace = useCallback((workspaceId: string) => {
    setTargetWorkspaceId(workspaceId);
    setCreateModalKey((k) => k + 1);
    setCreating(true);
  }, []);

  const headerOnCreate = useCallback(() => {
    const id = routeWorkspaceId ?? workspaces[0]?.id;
    if (!id) {
      notifyWithCenter({
        title: "Нет проектов",
        description: "Сначала создайте проект",
        variant: "warning",
      });
      return;
    }
    if (isWorkspaceHub && !routeWorkspaceId) {
      notifyWithCenter({
        title: "Выберите проект",
        description: "Откройте проект, чтобы добавить задачу",
        variant: "warning",
      });
      return;
    }
    openCreateForWorkspace(id);
  }, [routeWorkspaceId, workspaces, openCreateForWorkspace, isWorkspaceHub]);

  const orphanGroups = useMemo(() => {
    const ids = new Set(workspaces.map((w) => w.id));
    const map = new Map<string, Tasks[]>();
    for (const t of allTasks) {
      if (ids.has(t.workspaceId)) continue;
      const list = map.get(t.workspaceId) ?? [];
      list.push(t);
      map.set(t.workspaceId, list);
    }
    return map;
  }, [allTasks, workspaces]);

  const totalCount = tasksInView.length;

  const canCreateTask = canPerformWorkspaceAction(
    activeWorkspace?.myRole,
    "create_task",
  );
  const workspaceTaskHandlers = useWorkspaceTaskHandlers(
    routeWorkspaceId ?? "",
  );

  const showEmptyHub =
    !workspacesLoading &&
    workspaces.length === 0 &&
    orphanGroups.size === 0 &&
    allTasks.length === 0;

  const showUnknownWorkspace =
    !isWorkspaceHub &&
    routeWorkspaceId &&
    !activeWorkspace &&
    tasksInView.length === 0;

  const showUnknownTask =
    Boolean(routeTaskId) && !tasksLoading && !selectedTask;

  return (
    <div
      className={cn(
        "relative flex w-full min-h-0 flex-1 flex-col",
        routeTaskId ? "gap-0 pb-0" : "gap-3 pb-4",
      )}
    >
      {!routeTaskId ? (
        <WorkspaceTaskSubheader
          className="shrink-0"
          view={view}
          onViewChange={setView}
          totalCount={totalCount}
          collaboration={
            routeWorkspaceId
              ? {
                  workspaceId: routeWorkspaceId,
                  workspaceTitle: activeWorkspace?.title,
                  myRole: activeWorkspace?.myRole,
                }
              : undefined
          }
          onCreate={canCreateTask ? headerOnCreate : undefined}
          onRemoveAll={
            routeWorkspaceId &&
            !isWorkspaceHub &&
            totalCount > 0 &&
            canPerformWorkspaceAction(activeWorkspace?.myRole, "delete_task")
              ? workspaceTaskHandlers.onRemoveAll
              : undefined
          }
        />
      ) : null}

      {showEmptyHub ? (
        <div className="flex flex-1 flex-col items-center justify-center py-12">
          <EmptySession
            titleName="Пока нет задач"
            descriptionName="Создайте проект и добавьте задачи"
            action={() => navigate(SESSION_PATHS.sessionRoot)}
            buttonName="К проектам"
            icon={<LayoutDashboard />}
          />
        </div>
      ) : (
        <div className="flex w-full min-h-0 min-w-0 flex-1 flex-col">
          <div
            className={cn(
              "flex min-h-0 min-w-0 flex-1 flex-col",
              routeTaskId ? "gap-0 overflow-hidden" : "gap-3 overflow-y-auto",
            )}
          >
            {isWorkspaceHub ? (
              workspacesLoading ? (
                <WorkspaceHubListSkeleton />
              ) : (
                <WorkspaceHubPicker
                  workspaces={workspaces}
                  allTasks={allTasks}
                  onSelect={(id) => navigate(SESSION_PATHS.project(id))}
                />
              )
            ) : showUnknownWorkspace ? (
              <p className="text-sm text-muted-foreground">
                Проект не найден.{" "}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0"
                  onClick={() => navigate(SESSION_PATHS.tasks)}
                >
                  К списку проектов
                </Button>
              </p>
            ) : showUnknownTask ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <p className="text-sm font-medium text-foreground">
                  Задача не найдена
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Возможно, она была удалена или ещё не загрузилась в этом
                  проекте.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBackToWorkspaceTasks}
                >
                  К задачам проекта
                </Button>
              </div>
            ) : routeTaskId && selectedTask ? (
              <TaskDetailsPage
                task={selectedTask}
                workspaceName={selectedTaskWorkspaceName}
              />
            ) : routeWorkspaceId ? (
              tasksLoading ? (
                <WorkspaceTasksSkeleton />
              ) : (
                <WorkspaceTasksBlockInner
                  workspaceId={routeWorkspaceId}
                  view={view}
                  tasks={tasksInView}
                  creating={creating}
                  onOpenCreate={
                    canCreateTask
                      ? () => openCreateForWorkspace(routeWorkspaceId)
                      : undefined
                  }
                  onOpenTask={openTaskDetails}
                />
              )
            ) : null}
          </div>
        </div>
      )}

      <CreateTaskModal
        key={createModalKey}
        open={creating}
        onOpenChange={(open) => {
          setCreating(open);
          if (!open) setTargetWorkspaceId(null);
        }}
        defaultCreator={suggestedCreatorLabel(user)}
        onSubmit={async (payload) => {
          const wsId = targetWorkspaceId;
          if (!wsId) {
            notifyWithCenter({
              title: "Не выбран проект",
              description: "Выберите проект и создайте задачу снова",
              variant: "error",
            });
            throw new Error("missing workspace");
          }

          try {
            const createdTask = await createTaskOnApi({
              ...payload,
              workspaceId: wsId,
              creator: resolveCreatorField(payload.creator, user),
            });

            addTask({
              ...createdTask,
              status: createdTask.status ?? "В очереди",
            });
            invalidateWorkspaceTasks(queryClient, wsId);
            notifyWithCenter({
              title: "Задача создана",
              description: createdTask.title,
              variant: "success",
            });

            navigate(SESSION_PATHS.projectTask(wsId, createdTask.id));
          } catch {
            notifyWithCenter({
              title: "Не удалось создать задачу",
              description: "Проверьте соединение и попробуйте снова",
              variant: "error",
            });
            throw new Error("create task failed");
          }
        }}
      />
    </div>
  );
}

export default memo(SessionTasksPage);
