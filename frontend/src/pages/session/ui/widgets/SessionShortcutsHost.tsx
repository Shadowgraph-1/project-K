import { useSessionShortcuts } from "@/hooks/use-session-shortcuts";

export function SessionShortcutsHost() {
  useSessionShortcuts();
  return null;
}
