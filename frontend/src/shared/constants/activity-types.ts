const ACTIVITY_TYPES = [
  "task.created",
  "update.created",
  "subtask.created",
  "subtask.title_changed",
  "subtask.status_changed",
  "subtask.deleted",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const Activity = {
  TASK_CREATED: "task.created",
  UPDATE_CREATED: "update.created",
  SUBTASK_CREATED: "subtask.created",
  SUBTASK_TITLE_CHANGED: "subtask.title_changed",
  SUBTASK_STATUS_CHANGED: "subtask.status_changed",
  SUBTASK_DELETED: "subtask.deleted",
} as const satisfies Record<string, ActivityType>;

export function isActivityType(value: string): value is ActivityType {
  return (ACTIVITY_TYPES as readonly string[]).includes(value);
}
