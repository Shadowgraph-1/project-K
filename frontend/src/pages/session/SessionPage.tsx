import { type CSSProperties } from "react";

import { TooltipProvider } from "@/shared/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/shared/ui/sidebar";
import { useAssistantChat } from "@/hooks/use-assistant-chat";
import { useAssistantContext } from "@/hooks/use-assistant-context";
import { useConnectionStatus } from "@/hooks/use-connection-status";
import { ConnectionEmptyState } from "@/pages/offline/ConnectionEmptyState";
import { useAuthStore } from "@/entities/user/model/useAuthStore";

import AppSidebar from "./ui/layout/AppSidebar";
import { AuthGate } from "./ui/layout/AuthGate";
import { SessionMainArea } from "./ui/layout/SessionMainArea";
import { SessionShellHeader } from "./ui/layout/SessionShellHeader";
import { AgentModeFab } from "./ui/widgets/AgentModeFab";
import { AssistantFloatingPanel } from "./ui/widgets/AssistantFloatingPanel";
import { AssistantInlinePanel } from "./ui/widgets/AssistantInlinePanel";
import {
  AgentModeProvider,
  useAgentMode,
  useCloseAgentModeOnNavigate,
} from "./model/AgentModeContext";
import { SessionShortcutsHost } from "./ui/widgets/SessionShortcutsHost";
import { useSessionRouteState } from "./model/use-session-route-state";
import { SessionPageSectionProvider } from "./model/SessionPageSectionContext";
import { useSessionThemeSync } from "./lib/use-session-theme-sync";
import "./ui/session-shell.css";

function SessionPageContent() {
  useSessionThemeSync();

  const route = useSessionRouteState();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { anyDown, online, retryConnection } = useConnectionStatus();

  const assistantContext = useAssistantContext();

  const {
    question,
    setQuestion,
    answer,
    error,
    askAssistant,
    history,
    loading,
    withMcp,
    toggleWithMcp,
    enabledCount,
    totalCount,
    isToolEnabled,
    toggleTool,
    setAllTools,
    pendingTurn,
  } = useAssistantChat({
    getContext: () => assistantContext,
  });

  useCloseAgentModeOnNavigate();

  const { open: agentInlineOpen } = useAgentMode();

  const assistantChat =
    isAuthenticated && user
      ? {
          error,
          answer,
          history,
          question,
          onQuestionChange: setQuestion,
          onSend: () => void askAssistant(),
          withMcp,
          onToggleWithMcp: toggleWithMcp,
          enabledCount,
          totalCount,
          isToolEnabled,
          onToggleTool: toggleTool,
          onSetAllTools: setAllTools,
          loading,
          pendingTurn,
          userLabel:
            user.name?.trim() ||
            user.email.split("@")[0] ||
            "Вы",
        }
      : null;

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
              <AuthGate>
                <SessionPageSectionProvider>
                  <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                    <SessionShellHeader />
                    {agentInlineOpen ? (
                      <AssistantInlinePanel chat={assistantChat} />
                    ) : anyDown ? (
                      <ConnectionEmptyState
                        online={online}
                        onRetry={retryConnection}
                      />
                    ) : (
                      <SessionMainArea
                        inWorkspaceFlow={route.inWorkspaceFlow}
                        isNewWorkspace={route.isNewWorkspace}
                      />
                    )}
                  </div>
                </SessionPageSectionProvider>
              </AuthGate>
            </div>

            <AgentModeFab />

            {assistantChat ? (
              <AssistantFloatingPanel chat={assistantChat} />
            ) : null}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}

function SessionPage() {
  return (
    <AgentModeProvider>
      <SessionPageContent />
    </AgentModeProvider>
  );
}

export default SessionPage;
