import { useMemo, useState, type ReactNode } from "react";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import { Box, ChevronDown, LayoutGrid, Trash2, Users } from "lucide-react";

import { getTaskStatus, type Task } from "@/entities/task/model/types";
import {
  useDeleteTaskMutation,
  useTasksQueries,
} from "@/entities/task/model/use-tasks-query";
import { partitionWorkspaces } from "@/entities/workspace/lib/partition-workspaces";
import type { Workspace } from "@/entities/workspace/model/workspace";
import {
  useDeleteWorkspaceMutation,
  useWorkspaceQuery,
} from "@/entities/workspace/model/use-workspace-query";
import { notify } from "@/shared/lib/notify";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import { cn } from "@/shared/lib/utils";
import { canPerformWorkspaceAction } from "@/shared/lib/workspace-permissions";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/shared/ui/context-menu";
import { TaskStatusIcon } from "@/pages/session/ui/tasks/task-status-icons";
import { SidebarTreeSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
import { linearContextMenuContentClass } from "@/pages/session/ui/tasks/task-context-menu";
import {
  SidebarTaskContextMenuItems,
  SidebarWorkspaceContextMenuItems,
} from "./sidebar-context-menus";
import {
  isSessionProjectsListPath,
  SESSION_PATHS,
} from "../../model/sessionPaths";

function WorkspaceSidebarIcon({ workspace }: { workspace: Workspace }) {
  if (workspace.kind === "owned") {
    return (
      <Box
        aria-hidden
        className="size-4 shrink-0"
        strokeWidth={1.75}
      />
    );
  }

  return (
    <Users
      aria-hidden
      className="size-4 shrink-0"
      strokeWidth={1.75}
    />
  );
}

function SectionCollapseArrow({ open, className }: { open: boolean; className?: string }) {
  return (
    <ChevronDown
      aria-hidden
      data-open={open}
      className={cn("session-sidebar-collapse-arrow size-3 opacity-70", className)}
    />
  );
}

function SidebarTreeLink({
  to,
  active,
  icon,
  children,
  className,
}: {
  to: string;
  active?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      data-active={active ? "true" : "false"}
      className={cn("session-sidebar-link", className)}
    >
      {icon}
      <span className="min-w-0 truncate">{children}</span>
    </Link>
  );
}

function SidebarRowDeleteButton({
  ariaLabel,
  onClick,
}: {
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      className="session-sidebar-row-delete"
    >
      <Trash2 aria-hidden className="size-3.5" />
    </button>
  );
}

function WorkspaceTasksList({
  workspace,
  tasks,
  activeTaskId,
}: {
  workspace: Workspace;
  tasks: Task[];
  activeTaskId?: string;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const deleteTaskMutation = useDeleteTaskMutation();
  const canDeleteTask = canPerformWorkspaceAction(
    workspace.myRole,
    "delete_task",
  );

  if (tasks.length === 0) return null;

  async function deleteTask(task: Task) {
    const label = task.title?.trim() || task.id;
    const confirmed = await notifyConfirm({
      title: "Удалить задачу?",
      description: `Будет удалена задача «${label}»`,
      confirmLabel: "Удалить",
      cancelLabel: "Отмена",
    });
    if (!confirmed) return;

    try {
      await deleteTaskMutation.mutateAsync({
        id: task.id,
        workspaceId: workspace.id,
      });
      notify({
        title: "Задача удалена",
        variant: "success",
      });
    } catch {
      notify({
        title: "Не удалось удалить задачу",
        description: "Попробуйте через пару минут",
        variant: "error",
      });
      return;
    }

    const taskPath = SESSION_PATHS.workspaceTask(workspace.publicKey, task.id);
    if (pathname === taskPath) {
      navigate(SESSION_PATHS.workspace(workspace.publicKey));
    }
  }

  return (
    <div className="session-sidebar-nested">
      {tasks.map((task) => {
        const isActive = activeTaskId === task.id;
        const taskPath = SESSION_PATHS.workspaceTask(workspace.publicKey, task.id);

        return (
          <ContextMenu key={task.id}>
            <ContextMenuTrigger asChild>
              <div
                className="session-sidebar-nested-link session-sidebar-nested-task-link"
                data-active={isActive ? "true" : "false"}
              >
                <TaskStatusIcon
                  status={getTaskStatus(task)}
                  className="size-3.5 shrink-0"
                />
                <Link to={taskPath} className="session-sidebar-nested-nav">
                  <span className="min-w-0 truncate">{task.title}</span>
                </Link>
                {canDeleteTask ? (
                  <SidebarRowDeleteButton
                    ariaLabel={`Удалить задачу «${task.title}»`}
                    onClick={() => void deleteTask(task)}
                  />
                ) : null}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className={linearContextMenuContentClass}>
              <SidebarTaskContextMenuItems
                task={task}
                workspace={workspace}
                onOpen={() => navigate(taskPath)}
                onDelete={() => void deleteTask(task)}
              />
            </ContextMenuContent>
          </ContextMenu>
        );
      })}
    </div>
  );
}

function WorkspaceTreeItem({
  workspace,
  tasks,
  expanded,
  onToggle,
  activeTaskId,
}: {
  workspace: Workspace;
  tasks: Task[];
  expanded: boolean;
  onToggle: () => void;
  activeTaskId?: string;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const deleteWorkspace = useDeleteWorkspaceMutation();
  const workspacePath = SESSION_PATHS.workspace(workspace.publicKey);
  const isWorkspaceActive =
    pathname === workspacePath ||
    Boolean(
      matchPath(
        { path: "/workspaces/:publicKey/:taskId", end: true },
        pathname,
      )?.params.publicKey === workspace.publicKey,
    );
  const canDeleteWorkspace =
    workspace.kind === "owned" && workspace.myRole === "OWNER";

  async function deleteWorkspaceItem() {
    const taskHint =
      tasks.length > 0
        ? ` В проекте ${tasks.length} задач — они тоже будут убраны из списка.`
        : "";

    const confirmed = await notifyConfirm({
      title: "Удалить проект?",
      description: `«${workspace.title}» будет удалена без возможности восстановления.${taskHint}`,
      confirmLabel: "Удалить",
      cancelLabel: "Отмена",
    });
    if (!confirmed) return;

    try {
      await deleteWorkspace.mutateAsync(workspace.id);
      notify({
        title: "Проект удалён",
        variant: "success",
      });
    } catch {
      notify({
        title: "Ошибка удаления",
        description: "Попробуйте через пару минут",
        variant: "error",
      });
      return;
    }

    if (
      pathname === workspacePath ||
      pathname.startsWith(`${workspacePath}/`)
    ) {
      navigate(SESSION_PATHS.sessionRoot);
    }
  }

  const isActive = isWorkspaceActive && !activeTaskId;
  const hasTasks = tasks.length > 0;

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className="session-sidebar-link session-sidebar-workspace-link"
            data-active={isActive ? "true" : "false"}
            data-expanded={expanded ? "true" : "false"}
          >
            <WorkspaceSidebarIcon workspace={workspace} />
            <Link to={workspacePath} className="session-sidebar-workspace-nav">
              <span className="min-w-0 truncate">{workspace.title}</span>
            </Link>
            {hasTasks ? (
              <button
                type="button"
                aria-label={expanded ? "Свернуть задачи" : "Развернуть задачи"}
                aria-expanded={expanded}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onToggle();
                }}
                className="session-sidebar-workspace-chevron"
              >
                <SectionCollapseArrow open={expanded} />
              </button>
            ) : null}
            {canDeleteWorkspace ? (
              <SidebarRowDeleteButton
                ariaLabel={`Удалить проект «${workspace.title}»`}
                onClick={() => void deleteWorkspaceItem()}
              />
            ) : null}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className={linearContextMenuContentClass}>
          <SidebarWorkspaceContextMenuItems
            workspace={workspace}
            taskCount={tasks.length}
            expanded={expanded}
            onOpen={() => navigate(workspacePath)}
            onToggleTasks={onToggle}
            onOpenMembers={() =>
              navigate(SESSION_PATHS.workspaceMembers(workspace.publicKey))
            }
            onDelete={() => void deleteWorkspaceItem()}
          />
        </ContextMenuContent>
      </ContextMenu>
      {expanded ? (
        <WorkspaceTasksList
          workspace={workspace}
          tasks={tasks}
          activeTaskId={activeTaskId}
        />
      ) : null}
    </div>
  );
}

export function AppSidebarProjectsTree() {
  const { pathname } = useLocation();
  const { data: workspaces = [], isLoading } = useWorkspaceQuery();
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [collapsedWorkspaceIds, setCollapsedWorkspaceIds] = useState<
    Set<string>
  >(() => new Set());

  const routeMatch = matchPath(
    { path: "/workspaces/:publicKey/:taskId?", end: true },
    pathname,
  );
  const routePublicKey = routeMatch?.params.publicKey;
  const routeTaskId = routeMatch?.params.taskId;

  const activeWorkspaces = useMemo(() => {
    const { owned, shared } = partitionWorkspaces(workspaces);
    return [...owned, ...shared];
  }, [workspaces]);

  const workspaceIds = useMemo(
    () => activeWorkspaces.map((workspace) => workspace.id),
    [activeWorkspaces],
  );

  const taskQueries = useTasksQueries(workspaceIds);
  const tasksByWorkspaceId = useMemo(() => {
    const map = new Map<string, Task[]>();
    activeWorkspaces.forEach((workspace, index) => {
      map.set(workspace.id, taskQueries[index]?.data ?? []);
    });
    return map;
  }, [activeWorkspaces, taskQueries]);

  const isProjectsHubActive = isSessionProjectsListPath(pathname);

  function toggleWorkspace(workspaceId: string) {
    setCollapsedWorkspaceIds((prev) => {
      const next = new Set(prev);
      if (next.has(workspaceId)) {
        next.delete(workspaceId);
      } else {
        next.add(workspaceId);
      }
      return next;
    });
  }

  return (
    <section className="session-sidebar-section">
      <button
        type="button"
        aria-expanded={projectsOpen}
        aria-controls="sidebar-projects"
        onClick={() => setProjectsOpen((open) => !open)}
        className="session-sidebar-section-header"
      >
        <span>Проекты</span>
        <SectionCollapseArrow open={projectsOpen} />
      </button>

      {projectsOpen ? (
        <div id="sidebar-projects" className="session-sidebar-section-body">
          <SidebarTreeLink
            to={SESSION_PATHS.sessionRoot}
            active={isProjectsHubActive}
            icon={<LayoutGrid className="size-4" />}
          >
            Все проекты
          </SidebarTreeLink>

          {isLoading ? (
            <SidebarTreeSkeleton />
          ) : (
            activeWorkspaces.map((workspace) => (
              <WorkspaceTreeItem
                key={workspace.id}
                workspace={workspace}
                tasks={tasksByWorkspaceId.get(workspace.id) ?? []}
                expanded={!collapsedWorkspaceIds.has(workspace.id)}
                onToggle={() => toggleWorkspace(workspace.id)}
                activeTaskId={
                  routePublicKey === workspace.publicKey
                    ? routeTaskId
                    : undefined
                }
              />
            ))
          )}

          {!isLoading && activeWorkspaces.length === 0 ? (
            <SidebarTreeLink
              to={SESSION_PATHS.workspaceNew}
              icon={<Box className="size-4" />}
            >
              Создать проект
            </SidebarTreeLink>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
