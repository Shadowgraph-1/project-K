import { useCallback, useState, memo } from "react";

import type { Task } from "@/entities/task/model/types";
import { useUpdateTaskMutation } from "@/entities/task/model/use-tasks-query";
import { useWorkspaceTaskHandlers } from "@/entities/task/model/use-workspace-task-handlers";
import type { TaskStatus } from "@/shared/constants/task-statuses";
import { notify } from "@/shared/lib/notify";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import { notifyWithCenter } from "@/shared/lib/notifyWithCenter";
import { WorkspaceTasksSection } from "./WorkspaceTasksSection";
import { TaskCheckedSelectionBar } from "./list/TaskCheckedSelectionBar";
import type { TasksView } from "../model/sessionWorkspaceTypes";

type WorkspaceTasksBlockProps = {
  workspaceId: string;
  view: TasksView;
  tasks: Task[];
  creating: boolean;
  statusFilter?: TaskStatus | null;
  onClearStatusFilter?: () => void;
  onOpenCreate?: () => void;
  onOpenTask: (taskId: string) => void;
};

export const WorkspaceTasksBlock = memo(function WorkspaceTasksBlock({
  workspaceId,
  view,
  tasks,
  creating,
  statusFilter = null,
  onClearStatusFilter,
  onOpenCreate,
  onOpenTask,
}: WorkspaceTasksBlockProps) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => new Set());
  const updateTask = useUpdateTaskMutation();
  const handlers = useWorkspaceTaskHandlers(workspaceId, tasks);
  const selectedCount = checkedIds.size;
  const isTaskChecked = (task: Task) => checkedIds.has(task.id);

  const onToggleTaskChecked = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const onClearSelection = () => setCheckedIds(new Set());

  const onDeleteSelected = useCallback(async () => {
    const selected = tasks.filter((t) => checkedIds.has(t.id));
    if (selected.length === 0) return;
    const confirmed = await notifyConfirm({
      title: "Удалить выбранные задачи?",
      description: `Будет удалено: ${selected.length}`,
      confirmLabel: "Удалить",
      cancelLabel: "Отмена",
    });
    if (!confirmed) return;
    let removed = 0;
    const results = await Promise.all(
      selected.map((task) => handlers.removeTaskCore(task.id)),
    );
    removed = results.filter((result) => result.ok).length;
    if (removed > 0) {
      notifyWithCenter({
        title: removed === 1 ? "Задача удалена" : `Удалено задач: ${removed}`,
        variant: "success",
      });
      onClearSelection();
    }
  }, [tasks, handlers, checkedIds]);

  const onStatusSelected = useCallback(
    async (status: TaskStatus) => {
      const selected = tasks.filter((t) => checkedIds.has(t.id));
      if (selected.length === 0) return;
      try {
        await Promise.all(
          selected.map((task) =>
            updateTask.mutateAsync({
              id: task.id,
              patch: { status },
              workspaceId,
            }),
          ),
        );
        onClearSelection();
        notify({
          title: "Статус обновлён",
          description: `Изменено задач: ${selected.length}`,
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
    [tasks, updateTask, workspaceId, checkedIds],
  );

  return (
    <>
      <section
        id={`workspace-section-${workspaceId}`}
        className="flex min-h-0 min-w-0 flex-1 scroll-mt-24 flex-col"
      >
        <WorkspaceTasksSection
          workspaceId={workspaceId}
          view={view}
          tasks={tasks}
          creating={creating}
          statusFilter={statusFilter}
          onClearStatusFilter={onClearStatusFilter}
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
