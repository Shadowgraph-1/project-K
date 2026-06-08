export type WorkspaceRole =
  | "OWNER"
  | "ADMIN"
  | "EDITOR"
  | "COMMENTER"
  | "VIEWER";

export type WorkspaceAction =
  | "view"
  | "create_task"
  | "edit_task"
  | "delete_task"
  | "create_subtask"
  | "edit_subtask"
  | "comment"
  | "manage_members";

const ROLE_PERMISSIONS: Record<WorkspaceRole, readonly WorkspaceAction[]> = {
  OWNER: [
    "view",
    "create_task",
    "edit_task",
    "delete_task",
    "create_subtask",
    "edit_subtask",
    "comment",
    "manage_members",
  ],
  ADMIN: [
    "view",
    "create_task",
    "edit_task",
    "delete_task",
    "create_subtask",
    "edit_subtask",
    "comment",
    "manage_members",
  ],
  EDITOR: [
    "view",
    "create_task",
    "edit_task",
    "delete_task",
    "create_subtask",
    "edit_subtask",
    "comment",
  ],
  COMMENTER: ["view", "comment"],
  VIEWER: ["view"],
};

export function canPerformWorkspaceAction(
  role: WorkspaceRole | undefined,
  action: WorkspaceAction,
): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(action);
}
