export const queryKeys = {
    workspaces: ['workspaces'] as const,
  
    invites: {
      all: ['invites'] as const,
      incoming: () => [...queryKeys.invites.all, 'incoming'] as const,
    },
  
    tasks: {
      all: ['tasks'] as const,
      byWorkspace: (workspaceId: string) =>
        [...queryKeys.tasks.all, workspaceId] as const,
    },
  
    subtasks: (taskId: string) => ['subtasks', taskId] as const,
    taskActivity: (taskId: string) => ['task-activity', taskId] as const,
    workspaceMembers: (workspaceId: string) => ['workspace-members', workspaceId] as const,
    team: ['team'] as const,
  } as const