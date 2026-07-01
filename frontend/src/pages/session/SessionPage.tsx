import { type CSSProperties } from "react";

import { TooltipProvider } from "@/shared/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/shared/ui/sidebar";
import { useAssistantChat } from "@/hooks/use-assistant-chat";
import { useConnectionStatus } from "@/hooks/use-connection-status";
import { ConnectionEmptyState } from "@/pages/Offline/ConnectionEmptyState";
import { useWorkspaceQuery } from "@/entities/workspace/model/use-workspace-query";
import { useAuthStore } from "@/entities/user/model/useAuthStore";

import AppSidebar from "./ui/layout/AppSidebar";
import { AuthGate } from "./ui/layout/AuthGate";
import { SessionMainArea } from "./ui/layout/SessionMainArea";
import { SessionShellHeader } from "./ui/layout/SessionShellHeader";
import { AssistantFloatingPanel } from "./ui/widgets/AssistantFloatingPanel";
import { useAssistantContext } from "./model/use-assistant-context";
import { useSessionRouteState } from "./model/use-session-route-state";
import { useSessionThemeSync } from "./lib/use-session-theme-sync";
import "./ui/session-shell.css";

function SessionPage() {
  useSessionThemeSync();

  const route = useSessionRouteState();
  const { data: workspaces = [] } = useWorkspaceQuery();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { anyDown, online, retryConnection } = useConnectionStatus();

  const {
    withTask,
    toggleWithTask,
    tasksContext,
    subtasksContext,
  } = useAssistantContext({ publicKey: route.publicKey, workspaces });

  const {
    question,
    setQuestion,
    answer,
    error,
    askAssistant,
    history,
    loading,
  } = useAssistantChat({ tasks: tasksContext, subtasks: subtasksContext });

  return (
    <div className="session-shell flex h-dvh flex-col overflow-hidden">
      <TooltipProvider delayDuration={300}>
        <SidebarProvider
          defaultOpen
          keyboardShortcut={false}
          className="min-h-0 flex-1"
          style={{ "--sidebar-width": "244px" } as CSSProperties}
        >
          <AppSidebar />
          <SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background md:m-2 md:ml-0 md:rounded-2xl md:shadow-none md:ring-1 md:ring-border/30">
            <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <AuthGate>
                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                  <SessionShellHeader />
                  {anyDown ? (
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
              </AuthGate>
            </div>

            {isAuthenticated && user ? (
              <AssistantFloatingPanel
                chat={{
                  error,
                  answer,
                  history,
                  question,
                  onQuestionChange: setQuestion,
                  onSend: () => void askAssistant(),
                  withTask,
                  onToggleWithTask: toggleWithTask,
                  loading,
                  userLabel:
                    user.name?.trim() ||
                    user.email.split("@")[0] ||
                    "Вы",
                }}
              />
            ) : null}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}

export default SessionPage;
