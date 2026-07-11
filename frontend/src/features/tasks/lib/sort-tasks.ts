import type { Task } from "@/entities/task/model/types";

import type { TaskSort, TaskSortDirection } from "../model/task-sort";

export type { TaskSort, TaskSortDirection } from "../model/task-sort";

export function sortTasks(
  tasks: Task[],
  sortBy: TaskSort,
  direction: TaskSortDirection,
): Task[] {
  const list = [...tasks];
  const factor = direction === "asc" ? 1 : -1;

  if (sortBy === "title") {
    return list.sort(
      (a, b) =>
        factor *
        a.title.localeCompare(b.title, "ru", { sensitivity: "base" }),
    );
  }

  return list.sort((a, b) => {
    const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
    return factor * (aTime - bTime);
  });
}
