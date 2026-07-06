import type { NavigateFunction } from "react-router-dom";

import { AUTH_PATHS, authPathWithRedirect } from "@/pages/auth/auth-paths";

let navigateRef: NavigateFunction | null = null;

export function setRouterNavigate(navigate: NavigateFunction) {
  navigateRef = navigate;
}

export function redirectToLogin(redirectTo?: string) {
  const target = authPathWithRedirect(AUTH_PATHS.login, redirectTo);

  if (navigateRef) {
    navigateRef(target, { replace: true });
    return;
  }

  window.location.href = target;
}