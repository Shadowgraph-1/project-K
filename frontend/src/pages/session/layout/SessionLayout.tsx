import { type CSSProperties } from "react";
import { Outlet } from "react-router-dom";

import { TooltipProvider } from "@/shared/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/shared/ui/sidebar";
import { useConnectionStatus } from "@/hooks/use-connection-status";
import { ConnectionEmptyState } from "@/pages/offline/ConnectionEmptyState";
import { cn } from "@/shared/lib/utils";

import AppSidebar from "../ui/layout/AppSidebar";
import { AuthGate } from "../ui/layout/AuthGate";
import { SessionShellHeader } from "../ui/layout/SessionShellHeader";
import {
  AgentModeProvider,
  useAgentMode,
  useCloseAgentModeOnNavigate,
} from "../model/AgentModeContext";
import { AssistantChatProvider } from "../model/AssistantChatContext";
import { SessionShortcutsHost } from "../ui/widgets/SessionShortcutsHost";
import { useSessionThemeSync } from "../lib/use-session-theme-sync";
import "../ui/session-shell.css";

function SessionMainContent() {
  const { anyDown, online, retryConnection } = useConnectionStatus();
  const { open: agentInlineOpen } = useAgentMode();

  // Agent panel is a sibling below the header — keep main empty while open.
  if (agentInlineOpen) return null;

  if (anyDown) {
    return (
      <ConnectionEmptyState online={online} onRetry={retryConnection} />
    );
  }

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Outlet />
    </div>
  );
}

function SessionLayoutContent() {
  useSessionThemeSync();
  useCloseAgentModeOnNavigate();

  const { open: agentInlineOpen } = useAgentMode();

  const sessionMain = (
    <AuthGate>
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-col overflow-hidden",
          // When agent is open, header stays compact; agent panel takes the rest.
          agentInlineOpen ? "shrink-0" : "flex-1",
        )}
      >
        <SessionShellHeader />
        <SessionMainContent />
      </div>
    </AuthGate>
  );

  return (
    <div className="session-shell flex h-dvh flex-col overflow-hidden">
      <TooltipProvider delayDuration={300}>
        <SidebarProvider
          defaultOpen
          keyboardShortcut={false}
          className="min-h-0 flex-1"
          style={{ "--sidebar-width": "244px" } as CSSProperties}
        >
          <SessionShortcutsHost />
          <AppSidebar />
          <SidebarInset className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background md:m-2 md:ml-0 md:rounded-2xl md:shadow-none md:ring-1 md:ring-border/30">
            <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <AssistantChatProvider main={sessionMain} />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}

export function SessionLayout() {
  return (
    <AgentModeProvider>
      <SessionLayoutContent />
    </AgentModeProvider>
  );
}

export default SessionLayout;