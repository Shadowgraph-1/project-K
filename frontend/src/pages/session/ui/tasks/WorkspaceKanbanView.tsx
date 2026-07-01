import { useMemo } from "react";

import { getTaskStatus, type Task } from "@/entities/task/model/types";
import {
  getStatusLabel,
  type TaskStatus,
} from "@/shared/constants/task-statuses";
import { KanbanColumn } from "./KanbanColumn";

const KANBAN_COLUMN_ORDER: TaskStatus[] = [
  "TODO",
  "ISSUES",
  "DEFERRED",
  "DONE",
];

type WorkspaceKanbanViewProps = {
  tasks: Task[];
  onOpenTask: (taskId: string) => void;
};

export function WorkspaceKanbanView({
  tasks,
  onOpenTask,
}: WorkspaceKanbanViewProps) {
  const grouped = useMemo(() => {
    const map = Object.fromEntries(
      KANBAN_COLUMN_ORDER.map((status) => [status, [] as Task[]]),
    ) as Record<TaskStatus, Task[]>;

    for (const task of tasks) {
      map[getTaskStatus(task)].push(task);
    }

    return map;
  }, [tasks]);

  return (
    <div className="session-kanban-board">
      <div className="session-kanban-columns">
        {KANBAN_COLUMN_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            label={getStatusLabel(status)}
            tasks={grouped[status]}
            onOpenTask={onOpenTask}
          />
        ))}
      </div>
    </div>
  );
}
