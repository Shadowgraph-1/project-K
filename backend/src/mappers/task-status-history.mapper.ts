export const taskStatusHistorySelect = {
  id: true,
  task_id: true,
  from_status: true,
  to_status: true,
  user_id: true,
  changed_at: true,
  users: {
    select: {
      name: true,
    },
  },
} as const;

export type TaskStatusHistoryRow = {
  id: string;
  task_id: string;
  from_status: string | null;
  to_status: string;
  user_id: number | null;
  changed_at: Date;
  users: { name: string } | null;
};

export function toTaskStatusHistoryDto(row: TaskStatusHistoryRow) {
  return {
    id: row.id,
    taskId: row.task_id,
    fromStatus: row.from_status,
    toStatus: row.to_status,
    userId: row.user_id,
    userName: row.users?.name ?? null,
    changedAt: row.changed_at.toISOString(),
  };
}
