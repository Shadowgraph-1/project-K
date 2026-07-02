
const AUTH_TOKEN_STORAGE_KEY = "kono-auth-token";

export function getAuthToken(): string | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed === "string") return parsed;
    if (
      parsed &&
      typeof parsed === "object" &&
      "token" in parsed &&
      typeof (parsed as { token: unknown }).token === "string"
    ) {
      return (parsed as { token: string }).token;
    }
  } catch {
    return raw;
  }
  return raw;
}

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}
