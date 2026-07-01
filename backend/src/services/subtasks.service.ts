import { prisma } from "../db/prisma.js";
import { assertTaskAccess } from "../permissions.js";
import { SubtaskStatus } from "../constants/subtask-statuses.js";
import { Activity } from "../constants/activity-types.js";
import { subtaskSelect, type SubtaskRow } from "../mappers/subtask.mapper.js";
import { ApiHttpError } from "../utils/api-errors.js";
import type { SubtaskPatchInput } from "../schemas/subtask.schema.js";

export type { SubtaskPatchInput as SubtaskPatch };

export async function listSubtasks(
  taskId: string,
  userId: number,
): Promise<SubtaskRow[]> {
  if (!(await assertTaskAccess(taskId, userId, "view"))) {
    throw new ApiHttpError("task_not_found");
  }

  return prisma.subtasks.findMany({
    where: { task_id: taskId },
    orderBy: { created_at: "asc" },
    select: subtaskSelect,
  });
}

export async function createSubtask(
  taskId: string,
  userId: number,
  title: string,
): Promise<SubtaskRow> {
  if (!(await assertTaskAccess(taskId, userId, "create_subtask"))) {
    throw new ApiHttpError("task_not_found");
  }

  return prisma.$transaction(async (tx) => {
    const created = await tx.subtasks.create({
      data: { task_id: taskId, user_id: userId, title: title.trim() },
      select: subtaskSelect,
    });

    await tx.task_activity.create({
      data: {
        task_id: taskId,
        user_id: userId,
        type: Activity.SUBTASK_CREATED,
        title: "Создана подзадача",
        body: created.title,
        metadata: { subtaskId: created.id },
      },
    });

    return created;
  });
}

export async function updateSubtask(
  subtaskId: string,
  userId: number,
  patch: SubtaskPatchInput,
): Promise<SubtaskRow> {
  const current = await prisma.subtasks.findUnique({
    where: { id: subtaskId },
    select: { id: true, task_id: true, title: true, status: true },
  });
  if (!current) throw new ApiHttpError("subtask_not_found");

  if (!(await assertTaskAccess(current.task_id, userId, "edit_subtask"))) {
    throw new ApiHttpError("subtask_not_found");
  }

  const status: SubtaskStatus | undefined = patch.status;

  return prisma.$transaction(async (tx) => {
    const updated = await tx.subtasks.update({
      where: { id: subtaskId },
      data: {
        title: patch.title?.trim(),
        status,
      },
      select: subtaskSelect,
    });

    if (patch.title !== undefined && patch.title.trim() !== current.title) {
      await tx.task_activity.create({
        data: {
          task_id: current.task_id,
          user_id: userId,
          type: Activity.SUBTASK_TITLE_CHANGED,
          title: "Название подзадачи изменено",
          body: updated.title,
          metadata: {
            subtaskId: current.id,
            from: current.title,
            to: updated.title,
          },
        },
      });
    }

    if (status !== undefined && status !== current.status) {
      await tx.task_activity.create({
        data: {
          task_id: current.task_id,
          user_id: userId,
          type: Activity.SUBTASK_STATUS_CHANGED,
          title: "Статус подзадачи изменён",
          body: updated.title,
          metadata: {
            subtaskId: current.id,
            from: current.status,
            to: updated.status,
          },
        },
      });
    }

    return updated;
  });
}

export async function deleteSubtask(
  subtaskId: string,
  userId: number,
): Promise<{ ok: true }> {
  const current = await prisma.subtasks.findUnique({
    where: { id: subtaskId },
    select: { id: true, task_id: true, title: true },
  });
  if (!current) throw new ApiHttpError("subtask_not_found");

  if (!(await assertTaskAccess(current.task_id, userId, "edit_subtask"))) {
    throw new ApiHttpError("subtask_not_found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.subtasks.delete({ where: { id: subtaskId } });
    await tx.task_activity.create({
      data: {
        task_id: current.task_id,
        user_id: userId,
        type: Activity.SUBTASK_DELETED,
        title: "Подзадача удалена",
        body: current.title,
        metadata: { subtaskId: current.id },
      },
    });
  });

  return { ok: true };
}
