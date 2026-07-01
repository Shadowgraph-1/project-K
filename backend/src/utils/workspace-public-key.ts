import { nanoid } from "nanoid";

const PREFIX = "proj_";

export function generateWorkspacePublicKey(): string {
  return `${PREFIX}${nanoid(8)}`;
}
