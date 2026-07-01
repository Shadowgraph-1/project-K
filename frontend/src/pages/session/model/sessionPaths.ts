import { matchPath } from "react-router-dom";

export const SESSION_PATHS = {
  root: "/",
  sessionRoot: "/projects",
  membersHub: "/projects/members",
  llmKeys: "/projects/api-keys",
  settings: "/projects/settings",
  admin: "/projects/admin",
  systemStatus: "/projects/system",
  tasks: "/projects/tasks",
  workspaceNew: "/projects/workspace/new",
  workspace: (publicKey: string) => `/workspaces/${publicKey}`,
  workspaceMembers: (publicKey: string) => `/workspaces/${publicKey}/members`,
  workspaceTask: (publicKey: string, taskId: string) =>
    `/workspaces/${publicKey}/${taskId}`,
} as const;

export function isMembersHubPath(pathname: string) {
  return pathname === SESSION_PATHS.membersHub;
}

export function isLlmKeysPath(pathname: string) {
  return pathname === SESSION_PATHS.llmKeys;
}

export function isSettingsPath(pathname: string) {
  return pathname === SESSION_PATHS.settings;
}

export function isAdminPath(pathname: string) {
  return pathname === SESSION_PATHS.admin;
}

export function isSystemStatusPath(pathname: string) {
  return pathname === SESSION_PATHS.systemStatus;
}

export function isSessionProjectsListPath(pathname: string) {
  return pathname === SESSION_PATHS.sessionRoot;
}

export function isWorkspaceMembersPath(pathname: string) {
  return matchPath("/workspaces/:publicKey/members", pathname) !== null;
}

export function isSessionTasksPath(pathname: string) {
  if (isWorkspaceMembersPath(pathname)) return false;
  if (isMembersHubPath(pathname)) return false;
  if (isLlmKeysPath(pathname)) return false;
  if (isSettingsPath(pathname)) return false;
  if (isAdminPath(pathname)) return false;
  if (isSystemStatusPath(pathname)) return false;
  if (pathname === SESSION_PATHS.sessionRoot) return false;
  if (pathname === SESSION_PATHS.workspaceNew) return false;
  return pathname === SESSION_PATHS.tasks || pathname.startsWith("/workspaces/");
}

export function isWorkspaceTaskDetailsPath(pathname: string) {
  return matchPath("/workspaces/:publicKey/:taskId", pathname) !== null;
}

export function isWorkspaceDetailPath(pathname: string) {
  return (
    matchPath({ path: "/workspaces/:publicKey", end: true }, pathname) !== null
  );
}

/**
 * Извлекает параметры workspace-маршрута из pathname.
 *
 * Используется вместо `useParams` потому что корневой маршрут в App.tsx —
 * `/workspaces/*` (catch-all), и React Router не заполняет `:publicKey`
 * автоматически. `matchPath` — официальный API React Router v6/v7 для
 * матчинга pathname против шаблона; он корректно достаёт именованные
 * параметры даже под wildcard-сегментом.
 *
 * Важно: порядок проверок от частного к общему — сначала `/members`,
 * затем `/:taskId`, затем сам workspace, иначе более общий шаблон
 * «съест» более частный.
 */
export function parseWorkspaceParams(pathname: string): {
  publicKey?: string;
  taskId?: string;
} {
  const membersMatch = matchPath(
    { path: "/workspaces/:publicKey/members", end: true },
    pathname,
  );
  if (membersMatch) {
    return {
      publicKey: membersMatch.params.publicKey as string | undefined,
    };
  }

  const taskMatch = matchPath(
    { path: "/workspaces/:publicKey/:taskId", end: true },
    pathname,
  );
  if (taskMatch) {
    return {
      publicKey: taskMatch.params.publicKey as string | undefined,
      taskId: taskMatch.params.taskId as string | undefined,
    };
  }

  const workspaceMatch = matchPath(
    { path: "/workspaces/:publicKey", end: true },
    pathname,
  );
  if (workspaceMatch) {
    return {
      publicKey: workspaceMatch.params.publicKey as string | undefined,
    };
  }

  return {};
}
