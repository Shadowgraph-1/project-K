import { memo } from "react";

import { cn } from "@/shared/lib/utils";

import { suggestedCreatorLabel } from "../../lib/sessionWorkspaceUtils";
import { TasksPageProvider, useTasksPage } from "./model/tasks-page-context";
import { CreateTaskModal } from "./ui/CreateTaskModal";
import { SessionTasksMainContent } from "./ui/SessionTasksMainContent";
import { SessionTasksPageHeader } from "./ui/SessionTasksPageHeader";

function SessionTasksPageView() {
  const {
    routeTaskId,
    creating,
    setCreating,
    createModalKey,
    targetWorkspaceIdRef,
    user,
    submitCreateTask,
  } = useTasksPage();

  return (
    <div
      className={cn(
        "relative flex w-full min-h-0 flex-1 flex-col",
        routeTaskId ? "gap-0 pb-0" : "gap-3 pb-4",
      )}
    >
      <SessionTasksPageHeader />
      <SessionTasksMainContent />

      <CreateTaskModal
        key={createModalKey}
        open={creating}
        onOpenChange={(open) => {
          setCreating(open);
          if (!open) targetWorkspaceIdRef.current = null;
        }}
        defaultCreator={suggestedCreatorLabel(user)}
        onSubmit={submitCreateTask}
      />
    </div>
  );
}

function SessionTasksPage() {
  return (
    <TasksPageProvider>
      <SessionTasksPageView />
    </TasksPageProvider>
  );
}

export default memo(SessionTasksPage);
