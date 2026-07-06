import type { ReactNode } from "react";
import { Bot, Moon, Settings, Sun } from "lucide-react";
import { Link } from "react-router-dom";

import { sessionSidebarNavButton } from "../../lib/session-styles";
import { SESSION_PATHS } from "../../model/sessionPaths";
import { useRouteActive } from "../../lib/use-session-nav-active";
import { SessionTooltip } from "./SessionTooltip";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { useSessionSecondarySidebarStore } from "@/shared/model/useSessionSecondarySidebarStore";
import { useSessionThemeStore } from "@/shared/model/useSessionThemeStore";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";

type FooterIconButtonProps = {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
};

function FooterIconButton({
  active,
  label,
  onClick,
  children,
}: FooterIconButtonProps) {
  return (
    <SessionTooltip label={label}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        onClick={onClick}
        className={cn(
          "session-sidebar-footer-btn",
          active && "session-sidebar-footer-btn--active",
        )}
      >
        {children}
      </button>
    </SessionTooltip>
  );
}

export function SessionSidebarFooter() {
  const settingsActive = useRouteActive(SESSION_PATHS.settings);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const assistantOpen = useSessionSecondarySidebarStore((s) => s.open);
  const assistantPanel = useSessionSecondarySidebarStore((s) => s.panel);
  const setAssistantOpen = useSessionSecondarySidebarStore((s) => s.setOpen);
  const openAssistantFloating = useSessionSecondarySidebarStore(
    (s) => s.openAssistantFloating,
  );
  const assistantPresentation = useSessionSecondarySidebarStore(
    (s) => s.assistantPresentation,
  );

  const theme = useSessionThemeStore((s) => s.theme);
  const setTheme = useSessionThemeStore((s) => s.setTheme);
  const isDark = theme === "dark";

  const assistantActive =
    assistantOpen &&
    assistantPanel === "assistant" &&
    assistantPresentation === "floating";

  return (
    <div className="flex items-center gap-1">
      <SidebarMenu className="min-w-0 flex-1 gap-0.5">
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={settingsActive}
            className={sessionSidebarNavButton}
          >
            <Link to={SESSION_PATHS.settings}>
              <Settings />
              <span>Настройки</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <div className="shrink-0">
        {isAuthenticated ? (
          <FooterIconButton
            label="Kono AI"
            active={assistantActive}
            onClick={() => {
              if (assistantActive) {
                setAssistantOpen(false);
                return;
              }
              openAssistantFloating();
            }}
          >
            <Bot className="size-4" aria-hidden />
          </FooterIconButton>
        ) : null}

        <FooterIconButton
          label={isDark ? "Светлая тема" : "Тёмная тема"}
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? (
            <Sun className="size-4" aria-hidden />
          ) : (
            <Moon className="size-4" aria-hidden />
          )}
        </FooterIconButton>
      </div>
    </div>
  );
}