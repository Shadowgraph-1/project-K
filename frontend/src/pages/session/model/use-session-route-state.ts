import { useLocation } from "react-router-dom";

import {
  isAdminPath,
  isLlmKeysPath,
  isConnectorsPath,
  isMcpPath,
  isMembersHubPath,
  isSessionTasksPath,
  isSettingsPath,
  isSystemStatusPath,
  isWorkspaceMembersPath,
  parseWorkspaceParams,
  SESSION_PATHS,
} from "./sessionPaths";

export type SessionRouteState = {
  pathname: string;
  publicKey?: string;
  taskId?: string;
  isNewWorkspace: boolean;
  onTasksPage: boolean;
  onMembersPage: boolean;
  onMembersHub: boolean;
  onLlmKeys: boolean;
  onConnectors: boolean;
  onMcp: boolean;
  onSettings: boolean;
  onAdmin: boolean;
  onSystemStatus: boolean;
  inWorkspaceFlow: boolean;
};

export function useSessionRouteState(): SessionRouteState {
  const { pathname } = useLocation();
  const { publicKey, taskId } = parseWorkspaceParams(pathname);

  const isNewWorkspace = pathname === SESSION_PATHS.workspaceNew;
  const onTasksPage = isSessionTasksPath(pathname);
  const onMembersPage = isWorkspaceMembersPath(pathname);
  const onMembersHub = isMembersHubPath(pathname);
  const onLlmKeys = isLlmKeysPath(pathname);
  const onConnectors = isConnectorsPath(pathname);
  const onMcp = isMcpPath(pathname);
  const onSettings = isSettingsPath(pathname);
  const onAdmin = isAdminPath(pathname);
  const onSystemStatus = isSystemStatusPath(pathname);

  const inWorkspaceFlow =
    isNewWorkspace ||
    Boolean(publicKey) ||
    onTasksPage ||
    onMembersPage ||
    onMembersHub ||
    onLlmKeys ||
    onConnectors ||
    onMcp ||
    onSettings ||
    onAdmin ||
    onSystemStatus;

  return {
    pathname,
    publicKey,
    taskId,
    isNewWorkspace,
    onTasksPage,
    onMembersPage,
    onMembersHub,
    onLlmKeys,
    onConnectors,
    onMcp,
    onSettings,
    onAdmin,
    onSystemStatus,
    inWorkspaceFlow,
  };
}