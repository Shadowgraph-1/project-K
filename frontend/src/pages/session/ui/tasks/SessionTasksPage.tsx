import { memo } from "react";

import { suggestedCreatorLabel } from "../../lib/sessionWorkspaceUtils";
import { cn } from "@/shared/lib/utils";

import { CreateTaskModal } from "./CreateTaskModal";
import { SessionTasksMainContent } from "./SessionTasksMainContent";
import { SessionTasksPageHeader } from "./SessionTasksPageHeader";
import { useSessionTasksPage } from "./use-session-tasks-page";

function SessionTasksPage() {
  const page = useSessionTasksPage();

  return (
    <div
      className={cn(
        "relative flex w-full min-h-0 flex-1 flex-col",
        page.routeTaskId ? "gap-0 pb-0" : "gap-3 pb-4",
      )}
    >
      <SessionTasksPageHeader
        routeTaskId={page.routeTaskId}
        selectedTask={page.selectedTask}
        selectedTaskWorkspaceName={page.selectedTaskWorkspaceName}
        showTasksListHeader={page.showTasksListHeader}
        isWorkspaceHub={page.isWorkspaceHub}
        taskCountLabel={page.taskCountLabel}
        showTaskSettings={page.showTaskSettings}
        view={page.view}
        statusFilter={page.statusFilter}
        sortBy={page.sortBy}
        sortDirection={page.sortDirection}
        totalCount={page.totalCount}
        canCreateTask={page.canCreateTask}
        myRole={page.activeWorkspace?.myRole}
        onStatusFilterChange={page.setStatusFilter}
        onSortChange={page.setSortBy}
        onSortDirectionChange={page.setSortDirection}
        onViewChange={page.setView}
        onCreate={page.headerOnCreate}
        onRemoveAll={page.workspaceTaskHandlers.onRemoveAll}
      />

      <SessionTasksMainContent
        routeTaskId={page.routeTaskId}
        routePublicKey={page.routePublicKey}
        isWorkspaceHub={page.isWorkspaceHub}
        workspaces={page.workspaces}
        workspacesLoading={page.workspacesLoading}
        workspaceId={page.workspaceId}
        tasksLoading={page.tasksLoading}
        selectedTask={page.selectedTask}
        sortedTasks={page.sortedTasks}
        view={page.view}
        creating={page.creating}
        statusFilter={page.statusFilter}
        sortBy={page.sortBy}
        sortDirection={page.sortDirection}
        showEmptyHub={page.showEmptyHub}
        showUnknownWorkspace={page.showUnknownWorkspace}
        showUnknownTask={page.showUnknownTask}
        canCreateTask={page.canCreateTask}
        taskCountByWorkspaceId={page.taskCountByWorkspaceId}
        onClearStatusFilter={page.clearStatusFilter}
        onOpenCreate={page.openCreateForWorkspace}
        onOpenTask={page.openTaskDetails}
        onGoBackToWorkspaceTasks={page.goBackToWorkspaceTasks}
      />

      <CreateTaskModal
        key={page.createModalKey}
        open={page.creating}
        onOpenChange={(open) => {
          page.setCreating(open);
          if (!open) page.targetWorkspaceIdRef.current = null;
        }}
        defaultCreator={suggestedCreatorLabel(page.user)}
        onSubmit={page.submitCreateTask}
      />
    </div>
  );
}

export default memo(SessionTasksPage);
