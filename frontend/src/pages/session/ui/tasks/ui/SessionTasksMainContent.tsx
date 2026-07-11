import { LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/shared/lib/utils";

import { SESSION_PATHS } from "../../../model/sessionPaths";
import EmptySession from "../../workspace/EmptySession";
import { WorkspaceHubListSkeleton } from "../../workspace/WorkspaceHubListSkeleton";
import { WorkspaceHubPicker } from "../../workspace/WorkspaceHubPicker";
import { useTasksPage } from "../model/tasks-page-context";
import TaskDetailsPage from "./TaskDetailsPage";
import { WorkspaceTasksBlock } from "./WorkspaceTasksBlock";
import { WorkspaceTasksSkeleton } from "./WorkspaceTasksSkeleton";

export function SessionTasksMainContent() {
  const navigate = useNavigate();
  const {
    routeTaskId,
    routePublicKey,
    isWorkspaceHub,
    workspaces,
    workspacesLoading,
    workspaceId,
    tasksLoading,
    selectedTask,
    sortedTasks,
    view,
    creating,
    statusFilter,
    sortBy,
    sortDirection,
    showEmptyHub,
    showUnknownWorkspace,
    showUnknownTask,
    canCreateTask,
    taskCountByWorkspaceId,
    clearStatusFilter,
    openCreateForWorkspace,
    openTaskDetails,
    goBackToWorkspaceTasks,
  } = useTasksPage();

  if (showEmptyHub) {
    return (
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
    );
  }

  return (
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
        ) : !isWorkspaceHub && routePublicKey && workspacesLoading ? (
          <WorkspaceTasksSkeleton />
        ) : showUnknownWorkspace ? (
          <EmptySession
            titleName="Проект не найден"
            descriptionName="Возможно, ссылка устарела или у вас нет доступа"
            footerAction={{
              label: "К списку проектов",
              onClick: () => navigate(SESSION_PATHS.tasks),
            }}
          />
        ) : showUnknownTask ? (
          <EmptySession
            titleName="Задача не найдена"
            descriptionName="Возможно, она была удалена или ещё не загрузилась в этом проекте"
            footerAction={{
              label: "К задачам проекта",
              onClick: goBackToWorkspaceTasks,
            }}
          />
        ) : routeTaskId && selectedTask ? (
          <TaskDetailsPage task={selectedTask} />
        ) : workspaceId ? (
          tasksLoading ? (
            <WorkspaceTasksSkeleton />
          ) : (
            <WorkspaceTasksBlock
              key={`${statusFilter ?? "all"}-${sortBy}-${sortDirection}`}
              workspaceId={workspaceId}
              view={view}
              tasks={sortedTasks}
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
  );
}
