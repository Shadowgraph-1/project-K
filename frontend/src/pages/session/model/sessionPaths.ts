import { matchPath } from "react-router-dom";

export const SESSION_PATHS = {
  root: "/",
  sessionRoot: "/projects",
  membersHub: "/projects/members",
  tasks: "/projects/tasks",
  workspaceNew: "/projects/workspace/new",
  project: (workspaceId: string) => `/project/${workspaceId}`,
  projectMembers: (workspaceId: string) => `/project/${workspaceId}/members`,
  projectTask: (workspaceId: string, taskId: string) =>
    `/project/${workspaceId}/${taskId}`,
} as const;

export function isMembersHubPath(pathname: string) {
  return pathname === SESSION_PATHS.membersHub;
}

export function isSessionProjectsListPath(pathname: string) {
  return pathname === SESSION_PATHS.sessionRoot;
}

export function isProjectMembersPath(pathname: string) {
  return matchPath("/project/:workspaceId/members", pathname) !== null;
}

export function isSessionTasksPath(pathname: string) {
  if (isProjectMembersPath(pathname)) return false;
  if (isMembersHubPath(pathname)) return false;
  if (pathname === SESSION_PATHS.sessionRoot) return false;
  if (pathname === SESSION_PATHS.workspaceNew) return false;
  return pathname === SESSION_PATHS.tasks || pathname.startsWith("/project/");
}

export function isProjectTaskDetailsPath(pathname: string) {
  return matchPath("/project/:workspaceId/:taskId", pathname) !== null;
}

export function isProjectWorkspacePath(pathname: string) {
  return (
    matchPath({ path: "/project/:workspaceId", end: true }, pathname) !== null
  );
}
