import { Activity } from "../constants/activity-types.js";
import { TaskStatus } from "../constants/task-statuses.js";
import { prisma } from "../db/prisma.js";
import { taskSelect, type TaskRow } from "../mappers/task.mapper.js";
import { assertTaskAccess, assertWorkspaceAccess } from "../permissions.js";
import { recordTaskStatusChange } from "./task-status-history.service.js";
import type {
  TaskCreateInput,
  TaskPatchInput,
} from "../schemas/task.schema.js";
import { ApiHttpError } from "../utils/api-errors.js";

export type { TaskCreateInput, TaskPatchInput as TaskPatch };

export async function listTasksByWorkspace(
  workspaceId: string,
  userId: number,
  filters?: { status?: TaskStatus },
): Promise<TaskRow[]> {
  if (!(await assertWorkspaceAccess(workspaceId, userId, "view"))) {
    throw new ApiHttpError("workspace_not_found");
  }

  return prisma.tasks.findMany({
    where: {
      workspace_id: workspaceId,
      ...(filters?.status ? { status: filters.status } : {}),
    },
    orderBy: [{ sort_order: "asc" }, { created_at: "asc" }],
    select: taskSelect,
  });
}

export async function createTask(
  userId: number,
  input: TaskCreateInput,
): Promise<TaskRow> {
  if (
    !(await assertWorkspaceAccess(input.workspaceId, userId, "create_task"))
  ) {
    throw new ApiHttpError("workspace_not_found");
  }

  return prisma.$transaction(async (tx) => {
    const created = await tx.tasks.create({
      data: {
        workspace_id: input.workspaceId,
        title: input.title.trim(),
        creator: input.creator ?? null,
      },
      select: taskSelect,
    });

    await tx.task_activity.create({
      data: {
        task_id: created.id,
        user_id: userId,
        type: Activity.TASK_CREATED,
        title: "Задача создана",
        body: created.title,
        metadata: {},
      },
    });

    await recordTaskStatusChange(tx, {
      taskId: created.id,
      userId,
      fromStatus: null,
      toStatus: created.status,
      changedAt: created.created_at,
    });

    return created;
  });
}

export async function deleteTask(
  taskId: string,
  userId: number,
): Promise<{ ok: true }> {
  if (!(await assertTaskAccess(taskId, userId, "delete_task"))) {
    throw new ApiHttpError("task_not_found");
  }

  await prisma.tasks.delete({
    where: { id: taskId },
  });

  return { ok: true };
}

export async function deleteAllTasksInWorkspace(
  workspaceId: string,
  userId: number,
): Promise<{ ok: true; message: string }> {
  if (!(await assertWorkspaceAccess(workspaceId, userId, "delete_task"))) {
    throw new ApiHttpError("workspace_not_found");
  }

  await prisma.tasks.deleteMany({
    where: { workspace_id: workspaceId },
  });

  return {
    ok: true,
    message: "Все задания этого проекта удалены",
  };
}

export async function updateTask(
  taskId: string,
  userId: number,
  patch: TaskPatchInput,
): Promise<TaskRow> {
  if (!(await assertTaskAccess(taskId, userId, "edit_task"))) {
    throw new ApiHttpError("task_not_found");
  }

  const current = await prisma.tasks.findUnique({
    where: { id: taskId },
    select: { status: true },
  });
  if (!current) throw new ApiHttpError("task_not_found");

  const nextStatus = patch.status;

  return prisma.$transaction(async (tx) => {
    const updated = await tx.tasks.update({
      where: { id: taskId },
      data: {
        title: patch.title?.trim(),
        description: patch.description ?? undefined,
        tags: patch.tags === "" ? null : (patch.tags ?? undefined),
        start_date: patch.startDate ?? undefined,
        due_date: patch.dueDate === "" ? null : (patch.dueDate ?? undefined),
        creator: patch.creator ?? undefined,
        status: nextStatus ?? undefined,
      },
      select: taskSelect,
    });

    if (
      nextStatus !== undefined &&
      nextStatus !== current.status
    ) {
      await recordTaskStatusChange(tx, {
        taskId,
        userId,
        fromStatus: current.status,
        toStatus: nextStatus,
      });
    }

    return updated;
  });
}
