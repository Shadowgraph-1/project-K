import type { TaskActivity } from "@/api/task-activity";
import { Activity, isActivityType } from "@/shared/constants/activity-types";
import { cn } from "@/shared/lib/utils";

export type ActivityEntityTone =
  | "emerald"
  | "violet"
  | "red"
  | "amber"
  | "sky"
  | "rose"
  | "slate";

const ENTITY_TONE_CLASS: Record<ActivityEntityTone, string> = {
  emerald:
    "bg-emerald-500/12 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  violet:
    "bg-violet-500/12 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  red: "bg-red-500/12 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  amber:
    "bg-amber-500/12 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300",
  sky: "bg-sky-500/12 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  rose: "bg-rose-500/12 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300",
  slate: "bg-muted/55 text-foreground/85",
};

const ICON_SURFACE_TONE_CLASS: Record<ActivityEntityTone, string> = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  red: "bg-red-500/10 text-red-600 dark:text-red-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  slate: "bg-muted/40 text-muted-foreground",
};

const THREAD_LINE_TONE_CLASS: Record<ActivityEntityTone, string> = {
  emerald: "border-emerald-500/25",
  violet: "border-violet-500/30",
  red: "border-red-500/25",
  amber: "border-amber-500/25",
  sky: "border-sky-500/30",
  rose: "border-primary/25",
  slate: "border-border/45",
};

const ICON_RING_TONE_CLASS: Record<ActivityEntityTone, string> = {
  emerald: "ring-emerald-500/30",
  violet: "ring-violet-500/30",
  red: "ring-red-500/30",
  amber: "ring-amber-500/30",
  sky: "ring-sky-500/30",
  rose: "ring-rose-500/30",
  slate: "ring-border/35",
};

export function getActivityEntityTone(item: TaskActivity): ActivityEntityTone {
  if (!isActivityType(item.type)) return "slate";

  switch (item.type) {
    case Activity.TASK_CREATED:
      return "emerald";
    case Activity.SUBTASK_CREATED:
      return "violet";
    case Activity.SUBTASK_DELETED:
      return "red";
    case Activity.SUBTASK_TITLE_CHANGED:
      return "sky";
    case Activity.SUBTASK_STATUS_CHANGED:
      return "amber";
    case Activity.UPDATE_CREATED:
      return "rose";
    default:
      return "slate";
  }
}

export function activityIconSurfaceClass(item: TaskActivity) {
  return ICON_SURFACE_TONE_CLASS[getActivityEntityTone(item)];
}

export function activityIconRingClass(item: TaskActivity) {
  return ICON_RING_TONE_CLASS[getActivityEntityTone(item)];
}

export function activityThreadLineClass(item?: TaskActivity) {
  const tone = item ? getActivityEntityTone(item) : "rose";
  return THREAD_LINE_TONE_CLASS[tone];
}

export function activityEntityBadgeClass(
  tone: ActivityEntityTone,
  className?: string,
) {
  return cn(
    "rounded-md px-1.5 py-0.5 font-medium",
    ENTITY_TONE_CLASS[tone],
    className,
  );
}