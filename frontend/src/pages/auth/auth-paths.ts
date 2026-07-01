export const AUTH_PATHS = {
  login: "/login",
  register: "/register",
} as const;

export function authPathWithRedirect(
  path: (typeof AUTH_PATHS)[keyof typeof AUTH_PATHS],
  redirectTo?: string,
) {
  if (!redirectTo || redirectTo === "/") {
    return path;
  }
  return `${path}?redirect=${encodeURIComponent(redirectTo)}`;
}
