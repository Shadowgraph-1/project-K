import { prisma } from "../db/prisma.js";
import { env } from "../config/env.js";
import { checkDatabase, checkLlm } from "./health.service.js";
import { listErrorLogs, clearErrorLogs } from "../utils/error-log-store.js";
import {
  listFeatureFlags,
  setFeatureFlag,
  type FeatureFlagKey,
} from "./feature-flags.service.js";
import { ApiHttpError } from "../utils/api-errors.js";
import { isAdminUser } from "../utils/admin-access.js";

export async function getAdminOverview() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const countLlmKeys = async () => {
    try {
      return await prisma.user_llm_keys.count();
    } catch {
      return 0;
    }
  };

  const [
    users,
    workspaces,
    tasks,
    subtasks,
    llmKeys,
    recentUsers,
    database,
    ai,
  ] = await Promise.all([
    prisma.users.count(),
    prisma.workspaces.count(),
    prisma.tasks.count(),
    prisma.subtasks.count(),
    countLlmKeys(),
    prisma.users.count({ where: { created_at: { gte: weekAgo } } }),
    checkDatabase(),
    checkLlm(),
  ]);

  const checks = { database, ai };
  const allOk = Object.values(checks).every((c) => c.status === "ok");
  const anyDown = Object.values(checks).some((c) => c.status === "down");
  const healthStatus = allOk ? "healthy" : anyDown ? "degraded" : "unhealthy";

  return {
    stats: {
      users,
      workspaces,
      tasks,
      subtasks,
      llmKeys,
      recentUsers,
    },
    health: {
      status: healthStatus as "healthy" | "degraded" | "unhealthy",
      timestamp: new Date().toISOString(),
      version: env.VERSION,
      checks,
    },
  };
}

export async function listAdminUsers(limit = 50, offset = 0) {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safeOffset = Math.max(offset, 0);

  const [total, users] = await Promise.all([
    prisma.users.count(),
    prisma.users.findMany({
      take: safeLimit,
      skip: safeOffset,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        _count: {
          select: {
            workspaces: true,
            workspace_members: true,
          },
        },
      },
    }),
  ]);

  return {
    total,
    items: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at.toISOString(),
      ownedWorkspaces: user._count.workspaces,
      memberships: user._count.workspace_members,
    })),
  };
}

export function getAdminErrorLogs(limit?: number) {
  return listErrorLogs(limit);
}

export function clearAdminErrorLogs() {
  clearErrorLogs();
}

export function getAdminFeatureFlags() {
  return listFeatureFlags();
}

export function updateAdminFeatureFlag(key: FeatureFlagKey, enabled: boolean) {
  return setFeatureFlag(key, enabled);
}

export async function deleteAdminUser(
  actorId: number,
  targetUserId: number,
): Promise<{ ok: true }> {
  if (actorId === targetUserId) {
    throw new ApiHttpError("self_remove_forbidden");
  }

  const target = await prisma.users.findUnique({
    where: { id: targetUserId },
    select: { id: true, email: true },
  });
  if (!target) throw new ApiHttpError("user_not_found");

  if (await isAdminUser({ id: target.id, email: target.email })) {
    throw new ApiHttpError("forbidden");
  }

  await prisma.users.delete({ where: { id: targetUserId } });
  return { ok: true };
}
