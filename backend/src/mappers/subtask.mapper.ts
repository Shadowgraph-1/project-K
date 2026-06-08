export const subtaskSelect = {
  id: true,
  task_id: true,
  user_id: true,
  title: true,
  status: true,
  created_at: true,
  updated_at: true,
} as const;
export type SubtaskRow = {
  id: string;
  task_id: string;
  user_id: number | null;
  title: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};
export function toSubtaskDto(subtask: SubtaskRow) {
  return {
    id: subtask.id,
    taskId: subtask.task_id,
    userId: subtask.user_id,
    title: subtask.title,
    status: subtask.status,
    createdAt: subtask.created_at,
    updatedAt: subtask.updated_at,
  };
}
