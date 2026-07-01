import type { Workspace } from "../model/workspace";

export type WorkspaceKind = Workspace["kind"];

export function partitionWorkspaces(workspaces: Workspace[]) {
  const owned: Workspace[] = [];
  const shared: Workspace[] = [];

  for (const workspace of workspaces) {
    if (workspace.kind === "owned") {
      owned.push(workspace);
    } else {
      shared.push(workspace);
    }
  }

  return { owned, shared };
}
