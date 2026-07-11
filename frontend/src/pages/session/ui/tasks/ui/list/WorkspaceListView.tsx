import { useMemo } from "react";

import type { Subtask } from "@/api/subtasks";
import type { Task } from "@/entities/task/model/types";
import { useSubtasksQueries } from "@/entities/subtask/model/use-subtasks-query";
import { TASK_LIST_LAYOUT } from "../../model/sessionWorkspaceTypes";
import { TaskRow } from "./TaskRow";

type WorkspaceListViewProps = {
  tasks: Task[];
  isTaskChecked: (task: Task) => boolean;
  onToggleTaskChecked: (id: string) => void;
  onRemove: (id: string) => void;
  onOpenTask: (taskId: string) => void;
};

export function WorkspaceListView({
  tasks,
  isTaskChecked,
  onToggleTaskChecked,
  onRemove,
  onOpenTask,
}: WorkspaceListViewProps) {
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const subtaskQueries = useSubtasksQueries(taskIds);
const subtaskProgressByTaskId = useMemo(() => {
    const map = new Map<string, { done: number; total: number }>();
    tasks.forEach((task, index) => {
      const subtasks = subtaskQueries[index]?.data;
      if (!subtasks || subtasks.length === 0) return;
      const done = subtasks.filter((s: Subtask) => s.status === "DONE").length;
      map.set(task.id, { done, total: subtasks.length });
    });
    return map;
  }, [tasks, subtaskQueries]);

  return (
    <ul
      className={`${TASK_LIST_LAYOUT} session-panel-scroll min-h-0 flex-1 overflow-y-auto`}
    >
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          isChecked={isTaskChecked(task)}
          subtaskProgress={subtaskProgressByTaskId.get(task.id)}
          onToggleChecked={onToggleTaskChecked}
          onRemove={onRemove}
          onOpen={onOpenTask}
        />
      ))}
    </ul>
  );
}
