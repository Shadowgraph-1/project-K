import { api } from "../client";

export type AdminOverview = {
  stats: {
    users: number;
    workspaces: number;
    tasks: number;
    subtasks: number;
    llmKeys: number;
    recentUsers: number;
  };
  health: {
    status: "healthy" | "degraded" | "unhealthy";
    timestamp: string;
    version: string;
    checks: {
      database: { status: "ok" | "down"; latencyMs: number; message?: string };
      ai: { status: "ok" | "down"; latencyMs: number; message?: string };
    };
  };
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  ownedWorkspaces: number;
  memberships: number;
};

export type AdminUsersResponse = {
  total: number;
  items: AdminUser[];
};

export type AdminErrorLog = {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  statusCode: number;
  message: string;
  code?: string;
};

export type FeatureFlagKey =
  | "assistant_enabled"
  | "registration_open"
  | "workspace_creation"
  | "llm_user_keys";

export type FeatureFlag = {
  key: FeatureFlagKey;
  label: string;
  description: string;
  enabled: boolean;
};

export async function fetchAdminAccess(): Promise<{ isAdmin: boolean }> {
  const { data } = await api.get<{ isAdmin: boolean }>("/admin/access");
  return data;
}

export async function fetchAdminOverview(): Promise<AdminOverview> {
  const { data } = await api.get<AdminOverview>("/admin/overview");

  if (
    !data?.stats ||
    typeof data.stats.users !== "number" ||
    !data.health?.checks?.database ||
    !data.health.checks.ai
  ) {
    throw new Error("Некорректный ответ /admin/overview");
  }

  return data;
}

export async function fetchAdminUsers(
  limit = 50,
  offset = 0,
): Promise<AdminUsersResponse> {
  const { data } = await api.get<AdminUsersResponse>("/admin/users", {
    params: { limit, offset },
  });
  return data;
}

export async function fetchAdminErrorLogs(
  limit = 50,
): Promise<AdminErrorLog[]> {
  const { data } = await api.get<AdminErrorLog[]>("/admin/error-logs", {
    params: { limit },
  });

  if (!Array.isArray(data)) {
    throw new Error("Некорректный ответ /admin/error-logs");
  }

  return data;
}

export async function clearAdminErrorLogs(): Promise<void> {
  await api.delete("/admin/error-logs");
}

export async function fetchAdminFeatureFlags(): Promise<FeatureFlag[]> {
  const { data } = await api.get<FeatureFlag[]>("/admin/feature-flags");

  if (!Array.isArray(data)) {
    throw new Error("Некорректный ответ /admin/feature-flags");
  }

  return data;
}

export async function updateAdminFeatureFlag(
  key: FeatureFlagKey,
  enabled: boolean,
): Promise<FeatureFlag> {
  const { data } = await api.patch<FeatureFlag>(`/admin/feature-flags/${key}`, {
    enabled,
  });
  return data;
}

export async function deleteAdminUser(userId: number): Promise<void> {
  await api.delete(`/admin/users/${userId}`);
}
