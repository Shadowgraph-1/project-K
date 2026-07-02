import { Plus } from "lucide-react";

import {
  canPerformWorkspaceAction,
  type WorkspaceRole,
} from "@/shared/lib/workspace-permissions";
import { Button } from "@/shared/ui/button";
import { SessionPageHeader } from "../layout/SessionPageHeader";
import { TaskDetailsPropertiesButton } from "./task-details/TaskDetailsSubheader";
import { WorkspaceTaskSettingsButton } from "./Workspacetasksubheader";
import type { Task } from "@/entities/task/model/types";
import type { TasksView, TaskSort, TaskSortDirection } from "./sessionWorkspaceTypes";
import type { TaskStatus } from "@/shared/constants/task-statuses";

type SessionTasksPageHeaderProps = {
  routeTaskId?: string;
  selectedTask: Task | null;
  selectedTaskWorkspaceName?: string;
  showTasksListHeader: boolean;
  isWorkspaceHub: boolean;
  taskCountLabel: string;
  showTaskSettings: boolean;
  view: TasksView;
  statusFilter: TaskStatus | null;
  sortBy: TaskSort;
  sortDirection: TaskSortDirection;
  totalCount: number;
  canCreateTask: boolean;
  myRole?: WorkspaceRole;
  onStatusFilterChange: (status: TaskStatus | null) => void;
  onSortChange: (sort: TaskSort) => void;
  onSortDirectionChange: (direction: TaskSortDirection) => void;
  onViewChange: (view: TasksView) => void;
  onCreate: () => void;
  onRemoveAll?: () => void;
};

export function SessionTasksPageHeader({
  routeTaskId,
  selectedTask,
  selectedTaskWorkspaceName,
  showTasksListHeader,
  isWorkspaceHub,
  taskCountLabel,
  showTaskSettings,
  view,
  statusFilter,
  sortBy,
  sortDirection,
  totalCount,
  canCreateTask,
  myRole,
  onStatusFilterChange,
  onSortChange,
  onSortDirectionChange,
  onViewChange,
  onCreate,
  onRemoveAll,
}: SessionTasksPageHeaderProps) {
  if (routeTaskId && selectedTask) {
    return (
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
    );
  }

  if (!showTasksListHeader) return null;

  const createTaskAction = canCreateTask ? (
    <Button
      type="button"
      className="h-8 gap-1 rounded-full px-3.5 text-sm shadow-sm"
      onClick={onCreate}
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
            onStatusFilterChange={onStatusFilterChange}
            sortBy={sortBy}
            onSortChange={onSortChange}
            sortDirection={sortDirection}
            onSortDirectionChange={onSortDirectionChange}
            onViewChange={onViewChange}
            totalCount={totalCount}
            onCreate={canCreateTask ? onCreate : undefined}
            onRemoveAll={
              totalCount > 0 &&
              canPerformWorkspaceAction(myRole, "delete_task")
                ? onRemoveAll
                : undefined
            }
          />
        ) : null}
        {createTaskAction}
      </>
    ) : undefined;

  return (
    <SessionPageHeader
      variant="toolbar"
      title="Задачи"
      meta={!isWorkspaceHub ? taskCountLabel : undefined}
      actions={taskListHeaderActions}
      className="px-0 pt-0"
    />
  );
}
