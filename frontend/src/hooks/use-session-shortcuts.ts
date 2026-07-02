import { useEffect } from "react";

import { dispatchSessionCreateTask } from "@/shared/config/session-shortcuts";
import { useSessionSecondarySidebarStore } from "@/shared/model/useSessionSecondarySidebarStore";
import { useSidebar } from "@/shared/ui/sidebar";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export function useSessionShortcuts() {
  const { toggleSidebar } = useSidebar();
  const openAssistant = useSessionSecondarySidebarStore((s) => s.openPanel);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      const mod = event.ctrlKey || event.metaKey;
      if (!mod) return;

      switch (event.key.toLowerCase()) {
        case "b":
          event.preventDefault();
          toggleSidebar();
          break;
        case "n":
          event.preventDefault();
          dispatchSessionCreateTask();
          break;
        case "j":
          event.preventDefault();
          openAssistant("assistant");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar, openAssistant]);
}
