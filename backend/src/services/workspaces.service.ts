import { prisma } from "../db/prisma.js";
import { Prisma, WorkspaceRole } from "../generated/prisma/client.js";
import { getWorkspaceAccess } from "../permissions.js";
import { ApiHttpError } from "../utils/api-errors.js";
import { generateWorkspacePublicKey } from "../utils/workspace-public-key.js";

const workspacePublicFields = {
  id: true,
  publicKey: true,
  name: true,
} as const;

type WorkspacePublic = {
  id: string;
  publicKey: string;
  name: string;
};

export type WorkspaceListItem =
  | (WorkspacePublic & {
      myRole: typeof WorkspaceRole.OWNER;
      kind: "owned";
    })
  | (WorkspacePublic & {
      myRole: WorkspaceRole;
      kind: "shared";
    });

export type WorkspaceDetail = WorkspacePublic & {
  myRole: WorkspaceRole;
  kind: "owned" | "shared";
};

function isPublicKeyConflict(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function listWorkspaces(
  userId: number,
): Promise<WorkspaceListItem[]> {
  const owned = await prisma.workspaces.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "asc" },
    select: workspacePublicFields,
  });

  const memberships = await prisma.workspace_members.findMany({
    where: { user_id: userId },
    include: {
      workspaces: {
        select: workspacePublicFields,
      },
    },
    orderBy: { joined_at: "asc" },
  });

  const ownedIds = new Set(owned.map((workspace) => workspace.id));

  const shared = memberships
    .filter((membership) => !ownedIds.has(membership.workspaces.id))
    .map((membership) => ({
      ...membership.workspaces,
      myRole: membership.role,
    }));

  return [
    ...owned.map((workspace) => ({
      ...workspace,
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
): Promise<WorkspaceDetail> {
  const access = await getWorkspaceAccess(workspaceId, userId);
  if (!access) {
    throw new ApiHttpError("workspace_not_found");
  }

  const workspace = await prisma.workspaces.findUnique({
    where: { id: workspaceId },
    select: workspacePublicFields,
  });

  if (!workspace) {
    throw new ApiHttpError("workspace_not_found");
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
  const workspace = await prisma.$transaction(async (tx) => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const publicKey = generateWorkspacePublicKey();
      try {
        return await tx.workspaces.create({
          data: {
            user_id: userId,
            name: name.trim(),
            publicKey,
          },
          select: workspacePublicFields,
        });
      } catch (error) {
        if (isPublicKeyConflict(error)) continue;
        throw error;
      }
    }
    throw new ApiHttpError("internal_server_error");
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
): Promise<{ ok: true }> {
  const access = await getWorkspaceAccess(workspaceId, userId);
  if (!access?.isOwner) {
    throw new ApiHttpError("workspace_not_found");
  }

  await prisma.workspaces.delete({
    where: { id: workspaceId },
  });

  return { ok: true };
}

export async function deleteAllOwnedWorkspaces(
  userId: number,
): Promise<{ ok: true; deletedCount: number }> {
  const result = await prisma.workspaces.deleteMany({
    where: { user_id: userId },
  });

  return { ok: true, deletedCount: result.count };
}
