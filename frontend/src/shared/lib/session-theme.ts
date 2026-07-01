import type { SessionTheme } from "@/shared/model/useSessionThemeStore";

const STORAGE_KEY = "kono-session-theme";

export function getStoredSessionTheme(): SessionTheme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return "light";

    const parsed = JSON.parse(raw) as { state?: { theme?: SessionTheme } };
    return parsed.state?.theme === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function applySessionTheme(theme: SessionTheme) {
  const root = document.documentElement;
  root.classList.add("session-theme-active", "session-theme-changing");
  root.classList.toggle("dark", theme === "dark");

  requestAnimationFrame(() => {
    root.classList.remove("session-theme-changing");
  });
}

export function clearSessionTheme() {
  document.documentElement.classList.remove(
    "session-theme-active",
    "dark",
    "session-theme-changing",
  );
}