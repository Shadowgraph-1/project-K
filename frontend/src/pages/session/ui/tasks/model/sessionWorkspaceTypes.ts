export type { TaskSort, TaskSortDirection } from "@/features/tasks/model/task-sort";

export type TasksView = "line" | "timeline" | "kanban";

export const TASK_LIST_LAYOUT = "flex list-none flex-col gap-0 p-0 m-0";

export const TASK_ROW_GRID_COLUMNS =
  "18px 16px minmax(51px, auto) 16px minmax(0, 1fr) minmax(40px, auto) 28px";
