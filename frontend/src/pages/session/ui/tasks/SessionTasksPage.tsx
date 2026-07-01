import { useCallback, useMemo, useState, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, Plus } from "lucide-react";

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

import { WorkspaceTaskSettingsButton } from "./Workspacetasksubheader";
import { TaskDetailsPropertiesButton } from "./task-details/TaskDetailsSubheader";
import { CreateTaskModal } from "./CreateTaskModal";
import { WorkspaceTasksBlock } from "./WorkspaceTasksBlock";
import {
  resolveCreatorField,
  suggestedCreatorLabel,
} from "../../lib/sessionWorkspaceUtils";
import type { TasksView } from "./sessionWorkspaceTypes";
import {
  parseWorkspaceParams,
  SESSION_PATHS,
} from "../../model/sessionPaths";
import { notifyWithCenter } from "@/shared/lib/notifyWithCenter";
import EmptySession from "../workspace/EmptySession";
import { WorkspaceHubPicker } from "../workspace/WorkspaceHubPicker";
import { Button } from "@/shared/ui/button";
import { WorkspaceHubListSkeleton } from "../workspace/WorkspaceHubListSkeleton";
import { WorkspaceTasksSkeleton } from "./WorkspaceTasksSkeleton";
import TaskDetailsPage from "./TaskDetailsPage";
import { cn } from "@/shared/lib/utils";
import { canPerformWorkspaceAction } from "@/shared/lib/workspace-permissions";
import type { TaskStatus } from "@/shared/constants/task-statuses";
import { SessionPageHeader } from "../layout/SessionPageHeader";

function SessionTasksPage() {
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
  const [view, setView] = useState<TasksView>("line");
  const [creating, setCreating] = useState(false);
  const [createModalKey, setCreateModalKey] = useState(0);
  const [targetWorkspaceId, setTargetWorkspaceId] = useState<string | null>(
    null,
  );

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

  const tasksInView = isWorkspaceHub || !workspaceId ? [] : tasks;

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

  const openCreateForWorkspace = useCallback((workspaceId: string) => {
    setTargetWorkspaceId(workspaceId);
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

  const totalCount = tasksInView.length;

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
    !isWorkspaceHub &&
    routePublicKey &&
    !activeWorkspace &&
    tasksInView.length === 0;

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

  const createTaskAction = canCreateTask ? (
    <Button
      type="button"
      className="h-8 gap-1 rounded-full px-3.5 text-sm shadow-sm"
      onClick={headerOnCreate}
    >
      <Plus className="size-3.5" aria-hidden />
      Создать
    </Button>
  ) : null;

  const taskListHeaderActions =
    !isWorkspaceHub && (showTaskSettings || createTaskAction) ? (
      <>
        {showTaskSettings ? (
          <WorkspaceTaskSettingsButton
            view={view}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onViewChange={setView}
            totalCount={totalCount}
            onCreate={canCreateTask ? headerOnCreate : undefined}
            onRemoveAll={
              workspaceId &&
              totalCount > 0 &&
              canPerformWorkspaceAction(activeWorkspace?.myRole, "delete_task")
                ? workspaceTaskHandlers.onRemoveAll
                : undefined
            }
          />
        ) : null}
        {createTaskAction}
      </>
    ) : undefined;

  return (
    <div
      className={cn(
        "relative flex w-full min-h-0 flex-1 flex-col",
        routeTaskId ? "gap-0 pb-0" : "gap-3 pb-4",
      )}
    >
      {routeTaskId && selectedTask ? (
        <SessionPageHeader
          title={selectedTask.title}
          actions={
            <TaskDetailsPropertiesButton
              task={selectedTask}
              workspaceName={selectedTaskWorkspaceName}
            />
          }
          className="shrink-0 border-b border-border/30 px-6 pb-4 pt-4"
        />
      ) : showTasksListHeader ? (
        <SessionPageHeader
          variant="toolbar"
          title="Задачи"
          meta={!isWorkspaceHub ? taskCountLabel : undefined}
          actions={taskListHeaderActions}
          className="px-0 pt-0"
        />
      ) : null}

      {showEmptyHub ? (
        <EmptySession
          titleName="Добавьте задачи"
          descriptionName="Создайте проект и начните с первой задачи"
          suggestions={[
            {
              title: "К проектам",
              description: "Создайте проект и откройте список задач",
              icon: <LayoutGrid />,
              iconClassName:
                "bg-[#E6F0FC] text-[#296BD6] dark:bg-blue-500/15 dark:text-blue-400",
              onClick: () => navigate(SESSION_PATHS.sessionRoot),
            },
          ]}
          footerAction={{
            label: "К проектам",
            onClick: () => navigate(SESSION_PATHS.sessionRoot),
          }}
        />
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
                  getTaskCount={(id) => taskCountByWorkspaceId.get(id) ?? 0}
                  onSelect={(publicKey) =>
                    navigate(SESSION_PATHS.workspace(publicKey))
                  }
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
              <TaskDetailsPage task={selectedTask} />
            ) : workspaceId ? (
              tasksLoading ? (
                <WorkspaceTasksSkeleton />
              ) : (
                <WorkspaceTasksBlock
                  key={statusFilter ?? "all"}
                  workspaceId={workspaceId}
                  view={view}
                  tasks={tasksInView}
                  creating={creating}
                  statusFilter={statusFilter}
                  onClearStatusFilter={clearStatusFilter}
                  onOpenCreate={
                    canCreateTask
                      ? () => openCreateForWorkspace(workspaceId)
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
        }}
      />
    </div>
  );
}

export default memo(SessionTasksPage);
