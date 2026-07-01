import type { Workspace } from "../model/workspace";

export function findWorkspaceByPublicKey(
  workspaces: Workspace[],
  publicKey?: string,
): Workspace | undefined {
  if (!publicKey) return undefined;
  return workspaces.find((workspace) => workspace.publicKey === publicKey);
}

export function getWorkspacePublicKey(
  workspaces: Workspace[],
  workspaceId?: string,
): string | undefined {
  if (!workspaceId) return undefined;
  return workspaces.find((workspace) => workspace.id === workspaceId)
    ?.publicKey;
}
