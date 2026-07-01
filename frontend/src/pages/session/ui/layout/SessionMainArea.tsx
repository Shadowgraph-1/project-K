import { useLocation } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import Session from "../workspace/Session";
import NewWorkspace from "../workspace/NewWorkspace";
import {
  isMembersHubPath,
  isLlmKeysPath,
  isWorkspaceMembersPath,
  isWorkspaceTaskDetailsPath,
  isSessionTasksPath,
  isSettingsPath,
  isAdminPath,
  isSystemStatusPath,
  SESSION_PATHS,
} from "../../model/sessionPaths";
import { SystemStatusPage } from "../system/SystemStatusPage";
import SessionTasksPage from "../tasks/SessionTasksPage";
import { WorkspaceMembersPage } from "../members/WorkspaceMembersPage";
import { MembersHubPage } from "../members/MembersHubPage";
import { LlmKeysPage } from "../settings/LlmKeysPage";
import { AccountSettingsPage } from "../settings/AccountSettingsPage";
import { AdminPage } from "../admin/AdminPage";

type SessionMainAreaProps = {
  inWorkspaceFlow: boolean;
  isNewWorkspace: boolean;
};

export function SessionMainArea({
  inWorkspaceFlow,
  isNewWorkspace,
}: SessionMainAreaProps) {
  const path = useLocation().pathname;

  const onMembersHub = isMembersHubPath(path);
  const onLlmKeys = isLlmKeysPath(path);
  const onSettings = isSettingsPath(path);
  const onAdmin = isAdminPath(path);
  const onSystemStatus = isSystemStatusPath(path);
  const onMembers = isWorkspaceMembersPath(path);
  const onSessionTasks = isSessionTasksPath(path);
  const onTaskDetails = isWorkspaceTaskDetailsPath(path);

  if (onSystemStatus) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col overflow-auto px-6 pb-6 pt-4 [scrollbar-gutter:stable] sm:pt-6">
        <SystemStatusPage />
      </div>
    );
  }

  if (onAdmin) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col overflow-auto px-6 pb-6 pt-4 [scrollbar-gutter:stable] sm:pt-6">
        <AdminPage />
      </div>
    );
  }

  if (onSettings) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col overflow-auto px-6 pb-6 pt-4 [scrollbar-gutter:stable] sm:pt-6">
        <AccountSettingsPage />
      </div>
    );
  }

  if (onLlmKeys) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col overflow-auto px-6 pb-6 pt-4 [scrollbar-gutter:stable] sm:pt-6">
        <LlmKeysPage />
      </div>
    );
  }

  if (onMembersHub) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col overflow-auto p-6 [scrollbar-gutter:stable]">
        <MembersHubPage />
      </div>
    );
  }

  if (onMembers) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col overflow-auto p-6 [scrollbar-gutter:stable]">
        <WorkspaceMembersPage />
      </div>
    );
  }

  if (onSessionTasks) {
    return (
      <div
        className={cn(
          "relative flex min-h-0 flex-1 flex-col [scrollbar-gutter:stable]",
          onTaskDetails ? "overflow-hidden p-0" : "overflow-auto p-6",
        )}
      >
        <SessionTasksPage />
      </div>
    );
  }

  const onWorkspacesList = path === SESSION_PATHS.sessionRoot;

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-1 flex-col [scrollbar-gutter:stable]",
        onWorkspacesList
          ? "overflow-hidden px-6 pb-6 pt-4"
          : cn("p-6", inWorkspaceFlow ? "overflow-y-auto" : "overflow-auto"),
      )}
    >
      {inWorkspaceFlow ? isNewWorkspace ? <NewWorkspace /> : null : <Session />}
    </div>
  );
}
