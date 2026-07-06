export type SessionBreadcrumbHandle =
  | { type: "single"; label: string }
  | { type: "workspace" }
  | { type: "workspace-members" }
  | { type: "workspace-task" };

export type SessionRouteHandle = {
  breadcrumb?: SessionBreadcrumbHandle;
};

export const SESSION_ROUTE_HANDLE = {
  projects: {
    breadcrumb: { type: "single", label: "Проекты" },
  },
  admin: {
    breadcrumb: { type: "single", label: "Админка" },
  },
  settings: {
    breadcrumb: { type: "single", label: "Настройки" },
  },
  llmKeys: {
    breadcrumb: { type: "single", label: "API ключи" },
  },
  connectors: {
    breadcrumb: { type: "single", label: "Коннекторы" },
  },
  mcp: {
    breadcrumb: { type: "single", label: "MCP" },
  },
  membersHub: {
    breadcrumb: { type: "single", label: "Участники" },
  },
  systemStatus: {
    breadcrumb: { type: "single", label: "Статус" },
  },
  workspace: {
    breadcrumb: { type: "workspace" },
  },
  workspaceMembers: {
    breadcrumb: { type: "workspace-members" },
  },
  workspaceTask: {
    breadcrumb: { type: "workspace-task" },
  },
} as const satisfies Record<string, SessionRouteHandle>;