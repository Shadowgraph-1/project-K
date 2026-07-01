import type { WorkspaceRole } from "@/shared/lib/workspace-permissions";

export type Workspace = {
  id: string;
  publicKey: string;
  title: string;
  hint: string;
  myRole: WorkspaceRole;
  kind: "owned" | "shared";
};
