import type { Task } from "@/entities/task/model/types";
import type { TaskStatus } from "@/shared/constants/task-statuses";
import TaskTimeline from "./list/TaskTimeline";
import type { TasksView } from "../model/sessionWorkspaceTypes";
import { WorkspaceKanbanView } from "./kanban/WorkspaceKanbanView";
import { WorkspaceListView } from "./list/WorkspaceListView";
import { WorkspaceTasksEmptyState } from "./workspace-tasks-empty";

type WorkspaceTasksSectionProps = {
  workspaceId: string;
  view: TasksView;
  tasks: Task[];
  creating: boolean;
  statusFilter?: TaskStatus | null;
  onClearStatusFilter?: () => void;
  isTaskChecked: (task: Task) => boolean;
  onToggleTaskChecked: (id: string) => void;
  onOpenCreate?: () => void;
  onRemove: (id: string) => void;
  onOpenTask: (taskId: string) => void;
};

export function WorkspaceTasksSection({
  workspaceId,
  view,
  tasks,
  creating,
  statusFilter = null,
  onClearStatusFilter,
  isTaskChecked,
  onToggleTaskChecked,
  onOpenCreate,
  onRemove,
  onOpenTask,
}: WorkspaceTasksSectionProps) {
  const showEmptyState = tasks.length === 0 && !creating;

  if (showEmptyState) {
    return (
      <section className="flex min-h-0 min-w-0 flex-1 flex-col lg:min-h-0">
        <WorkspaceTasksEmptyState
          statusFilter={statusFilter}
          onClearStatusFilter={onClearStatusFilter}
          onOpenCreate={onOpenCreate}
        />
      </section>
    );
  }

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col lg:min-h-0">
      {view === "timeline" ? (
        <TaskTimeline
          tasks={tasks}
          isTaskChecked={isTaskChecked}
          onOpenTask={onOpenTask}
        />
      ) : view === "kanban" ? (
        <WorkspaceKanbanView
          workspaceId={workspaceId}
          tasks={tasks}
          onOpenTask={onOpenTask}
        />
      ) : (
        <WorkspaceListView
          tasks={tasks}
          isTaskChecked={isTaskChecked}
          onToggleTaskChecked={onToggleTaskChecked}
          onRemove={onRemove}
          onOpenTask={onOpenTask}
        />
      )}
    </section>
  );
}
