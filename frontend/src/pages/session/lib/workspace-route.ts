import { SESSION_PATHS } from "../model/sessionPaths";

export function isUnderWorkspacePath(pathname: string, publicKey: string) {
  const base = SESSION_PATHS.workspace(publicKey);
  return pathname === base || pathname.startsWith(`${base}/`);
}