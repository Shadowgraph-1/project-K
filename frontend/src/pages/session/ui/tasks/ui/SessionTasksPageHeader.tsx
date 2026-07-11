import { Plus } from "lucide-react";

import { canPerformWorkspaceAction } from "@/shared/lib/workspace-permissions";
import { Button } from "@/shared/ui/button";

import { SessionPageHeader } from "../../layout/SessionPageHeader";
import { useTasksPage } from "../model/tasks-page-context";
import { TaskDetailsPropertiesButton } from "./details/TaskDetailsSubheader";
import { WorkspaceTaskSettingsButton } from "./Workspacetasksubheader";

export function SessionTasksPageHeader() {
  const {
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
    activeWorkspace,
    setStatusFilter,
    setSortBy,
    setSortDirection,
    setView,
    headerOnCreate,
    workspaceTaskHandlers,
  } = useTasksPage();

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
      onClick={headerOnCreate}
    >
      <Plus className="size-3.5" aria-hidden />
      Создать
    </Button>
  ) : null;

  const myRole = activeWorkspace?.myRole;

  const taskListHeaderActions =
    !isWorkspaceHub && (showTaskSettings || createTaskAction) ? (
      <>
        {showTaskSettings ? (
          <WorkspaceTaskSettingsButton
            view={view}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
            onViewChange={setView}
            totalCount={totalCount}
            onCreate={canCreateTask ? headerOnCreate : undefined}
            onRemoveAll={
              totalCount > 0 &&
              canPerformWorkspaceAction(myRole, "delete_task")
                ? workspaceTaskHandlers.onRemoveAll
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
