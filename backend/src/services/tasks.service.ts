import { Activity } from "../constants/activity-types.js";
import { prisma } from "../db/prisma.js";
import { taskSelect, type TaskRow } from "../mappers/task.mapper.js";
import { assertTaskAccess, assertWorkspaceAccess } from "../permissions.js";
import { createTaskActivityData } from "../utils/task-activity-data.js";
import type { TaskCreateInput, TaskPatchInput } from "../schemas/task.schema.js";

export type { TaskCreateInput, TaskPatchInput as TaskPatch };

export async function listTasksByWorkspace(
  workspaceId: string,
  userId: number,
): Promise<TaskRow[] | null> {
  if (!(await assertWorkspaceAccess(workspaceId, userId, "view"))) {
    return null;
  }

  return prisma.tasks.findMany({
    where: { workspace_id: workspaceId },
    orderBy: [{ sort_order: "asc" }, { created_at: "asc" }],
    select: taskSelect,
  });
}

export async function createTask(
  userId: number,
  input: TaskCreateInput,
): Promise<TaskRow | null> {
  if (!(await assertWorkspaceAccess(input.workspaceId, userId, "create_task"))) {
    return null;
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
      data: createTaskActivityData({
        task_id: created.id,
        user_id: userId,
        type: Activity.TASK_CREATED,
        title: "Задача создана",
        body: created.title,
        metadata: {},
      }),
    });

    return created;
  });
}

export async function deleteTask(
  taskId: string,
  userId: number,
): Promise<{ ok: true } | null> {
  if (!(await assertTaskAccess(taskId, userId, "delete_task"))) {
    return null;
  }

  await prisma.tasks.delete({
    where: { id: taskId },
  });

  return { ok: true };
}

export async function deleteAllTasksInWorkspace(
  workspaceId: string,
  userId: number,
): Promise<{ ok: true; message: string } | null> {
  if (!(await assertWorkspaceAccess(workspaceId, userId, "delete_task"))) {
    return null;
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
): Promise<TaskRow | null> {
  if (!(await assertTaskAccess(taskId, userId, "edit_task"))) {
    return null;
  }

  return prisma.tasks.update({
    where: { id: taskId },
    data: {
      title: patch.title?.trim(),
      description: patch.description ?? undefined,
      tags: patch.tags === "" ? null : patch.tags ?? undefined,
      start_date: patch.startDate ?? undefined,
      due_date: patch.dueDate === "" ? null : patch.dueDate ?? undefined,
      creator: patch.creator ?? undefined,
      status: patch.status ?? undefined,
      checked: patch.checked ?? undefined,
    },
    select: taskSelect,
  });
}
