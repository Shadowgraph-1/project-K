export type TasksView = "line" | "timeline";

export const TASK_LIST_LAYOUT =
  "flex list-none flex-col gap-3 p-0 mt-2";

export type CompanionSize = "small" | "default" | "large";

export const COMPANION_SIZE: Record<CompanionSize, string> = {
  small: "h-[min(300px,40vh)] w-[min(220px,25vw)]",
  default: "h-[min(500px,70vh)] w-[min(380px,42vw)]",
  large: "h-[min(900px,100vh)] w-[min(520px,56vw)]",
};
