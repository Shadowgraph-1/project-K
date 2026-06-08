import { useLocation } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import Session from "../workspace/Session";
import NewWorkspace from "../workspace/NewWorkspace";
import {
  isMembersHubPath,
  isProjectMembersPath,
  isProjectTaskDetailsPath,
  isSessionTasksPath,
  SESSION_PATHS,
} from "../../model/sessionPaths";
import SessionTasksPage from "../tasks/SessionTasksPage";
import { WorkspaceMembersPage } from "../members/WorkspaceMembersPage";
import { MembersHubPage } from "../members/MembersHubPage";

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
  const onMembers = isProjectMembersPath(path);
  const onSessionTasks = isSessionTasksPath(path);
  const onTaskDetails = isProjectTaskDetailsPath(path);

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
      <div className="pointer-events-none absolute top-4 right-5 z-20 flex justify-end" />
      {inWorkspaceFlow ? isNewWorkspace ? <NewWorkspace /> : null : <Session />}
    </div>
  );
}
