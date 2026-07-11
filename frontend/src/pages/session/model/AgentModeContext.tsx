import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";

import { useSessionSecondarySidebarStore } from "@/shared/model/useSessionSecondarySidebarStore";

type AgentModeContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const AgentModeContext = createContext<AgentModeContextValue | null>(null);

export function AgentModeProvider({ children }: { children: ReactNode }) {
  const [open, setOpenState] = useState(false);

  const setOpen = useCallback((next: boolean) => {
    if (next) {
      useSessionSecondarySidebarStore.getState().setOpen(false);
    }
    setOpenState(next);
  }, []);

  const toggle = useCallback(() => {
    setOpenState((current) => {
      const next = !current;
      if (next) {
        useSessionSecondarySidebarStore.getState().setOpen(false);
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle,
    }),
    [open, setOpen, toggle],
  );

  return (
    <AgentModeContext.Provider value={value}>{children}</AgentModeContext.Provider>
  );
}

export function useAgentMode() {
  const context = useContext(AgentModeContext);
  if (!context) {
    throw new Error("useAgentMode must be used within AgentModeProvider");
  }
  return context;
}

/** Closes agent mode when user navigates to another page or project. */
export function useCloseAgentModeOnNavigate() {
  const { pathname } = useLocation();
  const { setOpen } = useAgentMode();

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);
}