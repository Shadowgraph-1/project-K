export const SESSION_PATHS = {
  root: "/",
  sessionRoot: "/projects",
  membersHub: "/projects/members",
  llmKeys: "/projects/api-keys",
  connectors: "/projects/connectors",
  mcp: "/projects/mcp",
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