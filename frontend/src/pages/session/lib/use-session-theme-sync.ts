import { useLayoutEffect } from "react";

import {
  applySessionTheme,
  clearSessionTheme,
} from "@/shared/lib/session-theme";
import { useSessionThemeStore } from "@/shared/model/useSessionThemeStore";

export function useSessionThemeSync() {
  const theme = useSessionThemeStore((s) => s.theme);

  useLayoutEffect(() => {
    applySessionTheme(theme);
    return clearSessionTheme;
  }, [theme]);
}