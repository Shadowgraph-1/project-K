import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";

import { getTaskStatus, type Task } from "@/entities/task/model/types";
import { useUpdateTaskMutation } from "@/entities/task/model/use-tasks-query";
import {
  getStatusLabel,
  type TaskStatus,
} from "@/shared/constants/task-statuses";
import { KanbanCard } from "./KanbanCard";
import { KanbanColumn } from "./KanbanColumn";

const KANBAN_COLUMN_ORDER: TaskStatus[] = [
  "TODO",
  "ISSUES",
  "DEFERRED",
  "DONE",
];

type WorkspaceKanbanViewProps = {
  workspaceId: string;
  tasks: Task[];
  onOpenTask: (taskId: string) => void;
};

export function WorkspaceKanbanView({
  workspaceId,
  tasks,
  onOpenTask,
}: WorkspaceKanbanViewProps) {
  const updateTask = useUpdateTaskMutation();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const grouped = useMemo(() => {
    const map = Object.fromEntries(
      KANBAN_COLUMN_ORDER.map((status) => [status, [] as Task[]]),
    ) as Record<TaskStatus, Task[]>;

    for (const task of tasks) {
      map[getTaskStatus(task)].push(task);
    }

    return map;
  }, [tasks]);

  const activeTask = activeTaskId
    ? tasks.find((task) => task.id === activeTaskId)
    : undefined;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = over.id as TaskStatus;

    if (!KANBAN_COLUMN_ORDER.includes(newStatus)) return;

    const task = tasks.find((item) => item.id === taskId);
    if (!task || getTaskStatus(task) === newStatus) return;

    updateTask.mutate({
      id: taskId,
      patch: { status: newStatus },
      workspaceId,
    });
  };

  const handleDragCancel = () => {
    setActiveTaskId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
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

      <DragOverlay dropAnimation={null}>
        {activeTask ? <KanbanCard task={activeTask} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
