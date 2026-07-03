import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SessionPageSectionOption = {
  id: string;
  label: string;
};

export type SessionPageSectionConfig = {
  ariaLabel: string;
  options: readonly SessionPageSectionOption[];
  value: string;
  onChange: (id: string) => void;
};

type SessionPageSectionContextValue = {
  config: SessionPageSectionConfig | null;
  register: (config: SessionPageSectionConfig | null) => void;
};

const SessionPageSectionContext =
  createContext<SessionPageSectionContextValue | null>(null);

export function SessionPageSectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [config, setConfig] = useState<SessionPageSectionConfig | null>(null);

  const register = useCallback((next: SessionPageSectionConfig | null) => {
    setConfig(next);
  }, []);

  const value = useMemo(
    () => ({ config, register }),
    [config, register],
  );

  return (
    <SessionPageSectionContext.Provider value={value}>
      {children}
    </SessionPageSectionContext.Provider>
  );
}

export function useSessionPageSectionRegistry(
  config: SessionPageSectionConfig | null,
) {
  const register = useContext(SessionPageSectionContext)?.register;

  useEffect(() => {
    if (!register) return;
    register(config);
    return () => register(null);
  }, [register, config]);
}

export function useSessionPageSectionConfig() {
  return useContext(SessionPageSectionContext)?.config ?? null;
}
