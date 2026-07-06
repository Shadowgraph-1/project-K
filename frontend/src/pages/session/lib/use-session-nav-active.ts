import { useMatch } from "react-router-dom";

import { SESSION_PATHS } from "../model/sessionPaths";

export function useRouteActive(path: string, end = true) {
  return useMatch({ path, end }) !== null;
}

export function useMembersNavActive() {
  const hubActive = useRouteActive(SESSION_PATHS.membersHub);
  const workspaceMembersActive =
    useMatch({ path: "/workspaces/:publicKey/members", end: true }) !== null;

  return hubActive || workspaceMembersActive;
}

export function useWorkspaceMembersRoutePublicKey() {
  return useMatch({ path: "/workspaces/:publicKey/members", end: true })
    ?.params.publicKey;
}