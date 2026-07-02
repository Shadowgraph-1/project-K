import type { TaskStatus } from "../constants/task-statuses.js";
import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../db/prisma.js";
import { assertTaskAccess } from "../permissions.js";
import {
  taskStatusHistorySelect,
  type TaskStatusHistoryRow,
} from "../mappers/task-status-history.mapper.js";
import { ApiHttpError } from "../utils/api-errors.js";

type Tx = Prisma.TransactionClient;

type RecordStatusChangeInput = {
  taskId: string;
  userId: number;
  fromStatus: TaskStatus | null;
  toStatus: TaskStatus;
  changedAt?: Date;
};

export async function recordTaskStatusChange(
  tx: Tx,
  input: RecordStatusChangeInput,
): Promise<void> {
  await tx.task_status_history.create({
    data: {
      task_id: input.taskId,
      from_status: input.fromStatus,
      to_status: input.toStatus,
      user_id: input.userId,
      ...(input.changedAt ? { changed_at: input.changedAt } : {}),
    },
  });
}

export async function listTaskStatusHistory(
  taskId: string,
  userId: number,
): Promise<TaskStatusHistoryRow[]> {
  if (!(await assertTaskAccess(taskId, userId, "view"))) {
    throw new ApiHttpError("task_not_found");
  }

  const rows = await prisma.task_status_history.findMany({
    where: { task_id: taskId },
    orderBy: [{ changed_at: "asc" }, { id: "asc" }],
    select: taskStatusHistorySelect,
  });

  if (rows.length > 0) return rows;

  const task = await prisma.tasks.findUnique({
    where: { id: taskId },
    select: { status: true, created_at: true },
  });
  if (!task) throw new ApiHttpError("task_not_found");

  return [
    {
      id: `initial-${taskId}`,
      task_id: taskId,
      from_status: null,
      to_status: task.status,
      user_id: null,
      changed_at: task.created_at,
      users: null,
    },
  ];
}
