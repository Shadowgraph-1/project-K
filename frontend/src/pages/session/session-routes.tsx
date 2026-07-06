import { lazy, Suspense, type ReactNode } from "react";
import { useParams, type RouteObject } from "react-router-dom";

import { RequireAdmin } from "@/shared/lib/require-admin";
import { RouteFallback } from "@/shared/ui/route-fallback";

import { SessionLayout } from "./layout/SessionLayout";
import { SessionPageFrame } from "./layout/SessionPageFrame";
import { SESSION_ROUTE_HANDLE } from "./model/session-route-handle";

const Session = lazy(() => import("./ui/workspace/Session"));
const NewWorkspace = lazy(() => import("./ui/workspace/NewWorkspace"));
const SessionTasksPage = lazy(() => import("./ui/tasks/SessionTasksPage"));
const MembersHubPage = lazy(() =>
  import("./ui/members/MembersHubPage").then((m) => ({
    default: m.MembersHubPage,
  })),
);
const WorkspaceMembersPage = lazy(() =>
  import("./ui/members/WorkspaceMembersPage").then((m) => ({
    default: m.WorkspaceMembersPage,
  })),
);
const LlmKeysPage = lazy(() =>
  import("./ui/settings/LlmKeysPage").then((m) => ({
    default: m.LlmKeysPage,
  })),
);
const ConnectorsPage = lazy(() =>
  import("./ui/connectors/ConnectorsPage").then((m) => ({
    default: m.ConnectorsPage,
  })),
);
const McpSettingsPage = lazy(() =>
  import("./ui/settings/McpSettingsPage").then((m) => ({
    default: m.McpSettingsPage,
  })),
);
const AccountSettingsPage = lazy(() =>
  import("./ui/settings/AccountSettingsPage").then((m) => ({
    default: m.AccountSettingsPage,
  })),
);
const AdminPage = lazy(() =>
  import("./ui/admin/AdminPage").then((m) => ({
    default: m.AdminPage,
  })),
);
const SystemStatusPage = lazy(() =>
  import("./ui/system/SystemStatusPage").then((m) => ({
    default: m.SystemStatusPage,
  })),
);

function SessionSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

function WorkspaceTasksRoute() {
  const { taskId } = useParams<{ taskId?: string }>();

  return (
    <SessionPageFrame variant={taskId ? "tasks-detail" : "tasks"}>
      <SessionTasksPage />
    </SessionPageFrame>
  );
}

export const sessionRoutes: RouteObject = {
  element: (
    <SessionSuspense>
      <SessionLayout />
    </SessionSuspense>
  ),
  children: [
    {
      path: "projects",
      handle: SESSION_ROUTE_HANDLE.projects,
      element: (
        <SessionSuspense>
          <SessionPageFrame variant="projects">
            <Session />
          </SessionPageFrame>
        </SessionSuspense>
      ),
    },
    {
      path: "projects/workspace/new",
      element: (
        <SessionSuspense>
          <SessionPageFrame variant="workspace-new">
            <NewWorkspace />
          </SessionPageFrame>
        </SessionSuspense>
      ),
    },
    {
      path: "projects/tasks",
      element: (
        <SessionSuspense>
          <SessionPageFrame variant="tasks">
            <SessionTasksPage />
          </SessionPageFrame>
        </SessionSuspense>
      ),
    },
    {
      path: "projects/members",
      handle: SESSION_ROUTE_HANDLE.membersHub,
      element: (
        <SessionSuspense>
          <SessionPageFrame variant="flush">
            <MembersHubPage />
          </SessionPageFrame>
        </SessionSuspense>
      ),
    },
    {
      path: "projects/api-keys",
      handle: SESSION_ROUTE_HANDLE.llmKeys,
      element: (
        <SessionSuspense>
          <SessionPageFrame>
            <LlmKeysPage />
          </SessionPageFrame>
        </SessionSuspense>
      ),
    },
    {
      path: "projects/connectors",
      handle: SESSION_ROUTE_HANDLE.connectors,
      element: (
        <SessionSuspense>
          <SessionPageFrame>
            <ConnectorsPage />
          </SessionPageFrame>
        </SessionSuspense>
      ),
    },
    {
      path: "projects/mcp",
      handle: SESSION_ROUTE_HANDLE.mcp,
      element: (
        <SessionSuspense>
          <SessionPageFrame>
            <McpSettingsPage />
          </SessionPageFrame>
        </SessionSuspense>
      ),
    },
    {
      path: "projects/settings",
      handle: SESSION_ROUTE_HANDLE.settings,
      element: (
        <SessionSuspense>
          <SessionPageFrame>
            <AccountSettingsPage />
          </SessionPageFrame>
        </SessionSuspense>
      ),
    },
    {
      path: "projects/system",
      handle: SESSION_ROUTE_HANDLE.systemStatus,
      element: (
        <SessionSuspense>
          <SessionPageFrame>
            <SystemStatusPage />
          </SessionPageFrame>
        </SessionSuspense>
      ),
    },
    {
      path: "projects/admin",
      handle: SESSION_ROUTE_HANDLE.admin,
      element: (
        <SessionSuspense>
          <RequireAdmin>
            <SessionPageFrame>
              <AdminPage />
            </SessionPageFrame>
          </RequireAdmin>
        </SessionSuspense>
      ),
    },
    {
      path: "workspaces/:publicKey/members",
      handle: SESSION_ROUTE_HANDLE.workspaceMembers,
      element: (
        <SessionSuspense>
          <SessionPageFrame variant="flush">
            <WorkspaceMembersPage />
          </SessionPageFrame>
        </SessionSuspense>
      ),
    },
    {
      path: "workspaces/:publicKey/:taskId",
      handle: SESSION_ROUTE_HANDLE.workspaceTask,
      element: (
        <SessionSuspense>
          <WorkspaceTasksRoute />
        </SessionSuspense>
      ),
    },
    {
      path: "workspaces/:publicKey",
      handle: SESSION_ROUTE_HANDLE.workspace,
      element: (
        <SessionSuspense>
          <WorkspaceTasksRoute />
        </SessionSuspense>
      ),
    },
  ],
};