export const activitySelect = {
  id: true,
  task_id: true,
  user_id: true,
  type: true,
  title: true,
  body: true,
  metadata: true,
  created_at: true,
  users: {
    select: {
      name: true,
    },
  },
} as const;

export type ActivityRow = {
  id: string;
  task_id: string;
  user_id: number | null;
  type: string;
  title: string;
  body: string | null;
  metadata: unknown;
  created_at: Date;
  users: { name: string } | null;
};

export function toActivityDto(activity: ActivityRow) {
  return {
    id: activity.id,
    taskId: activity.task_id,
    userId: activity.user_id,
    authorName: activity.users?.name ?? null,
    type: activity.type,
    title: activity.title,
    body: activity.body,
    metadata: activity.metadata,
    createdAt: activity.created_at,
  };
}
