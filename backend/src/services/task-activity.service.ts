import { prisma } from "../db/prisma.js";
import { assertTaskAccess } from "../permissions.js";
import { Activity } from "../constants/activity-types.js";
import { createTaskActivityData } from "../utils/task-activity-data.js";
import { activitySelect, type ActivityRow } from "../mappers/task-activity.mapper.js";
import { apiErr, type ApiError } from "../utils/api-errors.js";

export type CreateTaskActivityInput = {
  body: string;
  parentActivityId?: string;
};

export async function listTaskActivity(
  taskId: string,
  userId: number,
): Promise<ActivityRow[] | null> {
  if (!(await assertTaskAccess(taskId, userId, "view"))) {
    return null;
  }

  return prisma.task_activity.findMany({
    where: { task_id: taskId },
    orderBy: { created_at: "desc" },
    select: activitySelect,
  });
}

export async function createTaskActivity(
  taskId: string,
  userId: number,
  input: CreateTaskActivityInput,
): Promise<ActivityRow | ApiError | null> {
  const text = input.body.trim();
  const parentActivityId = input.parentActivityId?.trim();

  if (!text) {
    return apiErr("activity_empty_body");
  }

  if (!(await assertTaskAccess(taskId, userId, "comment"))) {
    return null;
  }

  if (parentActivityId) {
    const parent = await prisma.task_activity.findFirst({
      where: { id: parentActivityId, task_id: taskId },
      select: { id: true },
    });
    if (!parent) {
      return apiErr("activity_parent_not_found");
    }
  }

  return prisma.task_activity.create({
    data: createTaskActivityData({
      task_id: taskId,
      user_id: userId,
      type: Activity.UPDATE_CREATED,
      title: "Добавлена запись",
      body: text,
      metadata: parentActivityId ? { parentActivityId } : undefined,
    }),
    select: activitySelect,
  });
}

export async function clearTaskActivity(
  taskId: string,
  userId: number,
): Promise<{ ok: true } | null> {
  if (!(await assertTaskAccess(taskId, userId, "edit_task"))) {
    return null;
  }

  await prisma.task_activity.deleteMany({
    where: { task_id: taskId },
  });

  return { ok: true };
}
