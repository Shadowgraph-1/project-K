export type TasksView = "line" | "square";

export const VIEW_LAYOUT: Record<TasksView, string> = {
  line: "flex list-none flex-col gap-3 p-0 mt-2",
  square:
    "list-none mt-2 grid h-full min-h-0 grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3 auto-rows-[minmax(min(280px,42vh),1fr)] [&>li]:h-full [&>li]:min-h-0",
};

export type CompanionSize = "small" | "default" | "large";

export const COMPANION_SIZE: Record<CompanionSize, string> = {
  small: "h-[min(300px,40vh)] w-[min(220px,25vw)]",
  default: "h-[min(500px,70vh)] w-[min(380px,42vw)]",
  large: "h-[min(900px,100vh)] w-[min(520px,56vw)]",
};
