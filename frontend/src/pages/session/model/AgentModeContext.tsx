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

type AgentModeContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const AgentModeContext = createContext<AgentModeContextValue | null>(null);

export function AgentModeProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle,
    }),
    [open, toggle],
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