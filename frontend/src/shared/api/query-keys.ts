import type { LlmKeyListParams } from "@/api/llm-settings";
import type { TaskStatus } from "../constants/task-statuses";

export const queryKeys = {
    workspaces: ['workspaces'] as const,
  
    invites: {
      all: ['invites'] as const,
      incoming: () => [...queryKeys.invites.all, 'incoming'] as const,
    },
  
    tasks: {
      all: ['tasks'] as const,
      byWorkspace: (workspaceId: string, filters?: { status?: TaskStatus}) =>
        [...queryKeys.tasks.all, workspaceId, filters ?? {}] as const,
    },
  
    subtasks: (taskId: string) => ['subtasks', taskId] as const,
    taskActivity: (taskId: string) => ['task-activity', taskId] as const,
    workspaceMembers: (workspaceId: string) => ['workspace-members', workspaceId] as const,
    team: ['team'] as const,
    health: ['health'] as const,
    llmKeys: (params?: LlmKeyListParams) => ["llm-keys", params ?? {}] as const,
    admin: {
      all: ['admin'] as const,
      access: () => [...queryKeys.admin.all, 'access'] as const,
      overview: () => [...queryKeys.admin.all, 'overview'] as const,
      users: () => [...queryKeys.admin.all, 'users'] as const,
      errorLogs: () => [...queryKeys.admin.all, 'error-logs'] as const,
      featureFlags: () => [...queryKeys.admin.all, 'feature-flags'] as const,
    },
  } as const