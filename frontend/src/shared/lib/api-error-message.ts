import axios from "axios";

export function getApiErrorMessage(
  err: unknown,
  fallback: string,
): string {
  if (!axios.isAxiosError(err)) return fallback;

  const data = err.response?.data;
  if (data && typeof data === "object" && "error" in data) {
    const error = (data as { error: unknown }).error;
    if (typeof error === "string" && error.trim()) return error;
  }

  return fallback;
}
