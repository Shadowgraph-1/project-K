export type TasksView = "line" | "timeline" | "kanban";

export const TASK_LIST_LAYOUT = "flex list-none flex-col gap-0 p-0 m-0";

export const TASK_ROW_GRID_COLUMNS =
  "18px 16px minmax(51px, auto) 16px minmax(0, 1fr) minmax(40px, auto) 28px";

export const TASK_TREE = "";

export type CompanionSize = "small" | "default" | "large";

export const COMPANION_SIZE: Record<CompanionSize, string> = {
  small: "h-[min(300px,40vh)] w-[min(220px,25vw)]",
  default: "h-[min(500px,70vh)] w-[min(380px,42vw)]",
  large: "h-[min(900px,100vh)] w-[min(520px,56vw)]",
};
