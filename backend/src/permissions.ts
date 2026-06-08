import { prisma } from "./db/prisma.js";
import { WorkspaceRole } from "./generated/prisma/client.js";

export type WorkspaceAction =
  | "view"
  | "create_task"
  | "edit_task"
  | "delete_task"
  | "create_subtask"
  | "edit_subtask"
  | "comment"
  | "manage_members";

export type WorkspaceAccess = {
  workspaceId: string;
  userId: number;
  role: WorkspaceRole;
  isOwner: boolean;
};

export type TaskAccessResult = {
  task: { workspace_id: string };
  access: WorkspaceAccess;
};

const ROLE_PERMISSIONS: Record<WorkspaceRole, readonly WorkspaceAction[]> = {
  [WorkspaceRole.OWNER]: [
    "view",
    "create_task",
    "edit_task",
    "delete_task",
    "create_subtask",
    "edit_subtask",
    "comment",
    "manage_members",
  ],
  [WorkspaceRole.ADMIN]: [
    "view",
    "create_task",
    "edit_task",
    "delete_task",
    "create_subtask",
    "edit_subtask",
    "comment",
    "manage_members",
  ],
  [WorkspaceRole.EDITOR]: [
    "view",
    "create_task",
    "edit_task",
    "delete_task",
    "create_subtask",
    "edit_subtask",
    "comment",
  ],
  [WorkspaceRole.COMMENTER]: ["view", "comment"],
  [WorkspaceRole.VIEWER]: ["view"],
};

export function canPerformAction(
  role: WorkspaceRole,
  action: WorkspaceAction,
): boolean {
  return ROLE_PERMISSIONS[role].includes(action);
}

export async function getWorkspaceAccess(
  workspaceId: string,
  userId: number,
): Promise<WorkspaceAccess | null> {
  const workspace = await prisma.workspaces.findFirst({
    where: { id: workspaceId },
    select: { id: true, user_id: true },
  });

  if (!workspace) return null;

  if (workspace.user_id === userId) {
    return {
      workspaceId,
      userId,
      role: WorkspaceRole.OWNER,
      isOwner: true,
    };
  }

  const member = await prisma.workspace_members.findUnique({
    where: {
      workspace_id_user_id: { workspace_id: workspaceId, user_id: userId },
    },
    select: { role: true },
  });

  if (!member) return null;

  return {
    workspaceId,
    userId,
    role: member.role,
    isOwner: false,
  };
}

export async function assertWorkspaceAccess(
  workspaceId: string,
  userId: number,
  action: WorkspaceAction,
): Promise<WorkspaceAccess | null> {
  const access = await getWorkspaceAccess(workspaceId, userId);
  if (!access) return null;
  if (!canPerformAction(access.role, action)) return null;
  return access;
}

export async function assertTaskAccess(
  taskId: string,
  userId: number,
  action: WorkspaceAction,
): Promise<TaskAccessResult | null> {
  const task = await prisma.tasks.findUnique({
    where: { id: taskId },
    select: { workspace_id: true },
  });

  if (!task) return null;

  const access = await assertWorkspaceAccess(task.workspace_id, userId, action);
  if (!access) return null;

  return { task, access };
}
