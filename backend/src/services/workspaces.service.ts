import { prisma } from "../db/prisma.js";
import { WorkspaceRole } from "../generated/prisma/client.js";
import { getWorkspaceAccess } from "../permissions.js";

export type WorkspaceListItem =
  | {
      id: string;
      name: string;
      myRole: typeof WorkspaceRole.OWNER;
      kind: "owned";
    }
  | {
      id: string;
      name: string;
      myRole: WorkspaceRole;
      kind: "shared";
    };

export type WorkspaceDetail = {
  id: string;
  name: string;
  myRole: WorkspaceRole;
  kind: "owned" | "shared";
};

export async function listWorkspaces(userId: number): Promise<WorkspaceListItem[]> {
  const owned = await prisma.workspaces.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  const memberships = await prisma.workspace_members.findMany({
    where: { user_id: userId },
    include: {
      workspaces: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { joined_at: "asc" },
  });

  const ownedIds = new Set(owned.map((workspace) => workspace.id));

  const shared = memberships
    .filter((membership) => !ownedIds.has(membership.workspaces.id))
    .map((membership) => ({
      id: membership.workspaces.id,
      name: membership.workspaces.name,
      myRole: membership.role,
    }));

  return [
    ...owned.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      myRole: WorkspaceRole.OWNER,
      kind: "owned" as const,
    })),
    ...shared.map((workspace) => ({
      ...workspace,
      kind: "shared" as const,
    })),
  ];
}

export async function getWorkspace(
  workspaceId: string,
  userId: number,
): Promise<WorkspaceDetail | null> {
  const access = await getWorkspaceAccess(workspaceId, userId);
  if (!access) {
    return null;
  }

  const workspace = await prisma.workspaces.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
    },
  });

  if (!workspace) {
    return null;
  }

  return {
    ...workspace,
    myRole: access.role,
    kind: access.isOwner ? "owned" : "shared",
  };
}

export async function createWorkspace(
  userId: number,
  name: string,
): Promise<WorkspaceListItem & { kind: "owned" }> {
  const workspace = await prisma.workspaces.create({
    data: {
      user_id: userId,
      name: name.trim(),
    },
    select: {
      id: true,
      name: true,
    },
  });

  return {
    ...workspace,
    myRole: WorkspaceRole.OWNER,
    kind: "owned",
  };
}

export async function deleteWorkspace(
  workspaceId: string,
  userId: number,
): Promise<{ ok: true } | null> {
  const access = await getWorkspaceAccess(workspaceId, userId);
  if (!access?.isOwner) {
    return null;
  }

  await prisma.workspaces.delete({
    where: { id: workspaceId },
  });

  return { ok: true };
}
