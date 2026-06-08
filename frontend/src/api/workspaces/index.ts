import { api } from "../client";
import type { WorkspaceRole } from "@/shared/lib/workspace-permissions";

export type WorkspaceKind = "owned" | "shared";

export type WorkspaceApiItem = {
  id: string;
  name: string;
  myRole: WorkspaceRole;
  kind?: WorkspaceKind;
};

export async function getWorkspacesOnApi() {
  const { data } = await api.get<WorkspaceApiItem[]>("/workspaces");
  return data;
}

export async function createWorkspaceOnApi(name: string) {
  const { data } = await api.post<WorkspaceApiItem>("/workspaces", { name });
  return data;
}

export async function deleteWorkspaceOnApi(id: string) {
  const { data } = await api.delete(`/workspaces/${id}`);
  return data;
}
