import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { useAssistantChat } from "@/hooks/use-assistant-chat";
import { useAssistantContext } from "@/hooks/use-assistant-context";
import { AssistantFloatingPanel } from "@/pages/session/ui/widgets/AssistantFloatingPanel";
import { AssistantInlinePanel } from "@/pages/session/ui/widgets/AssistantInlinePanel";
import type { AssistantChatProps } from "@/pages/session/ui/widgets/assistant-chat-ui";

import { useAgentMode } from "./AgentModeContext";

const AssistantChatContext = createContext<AssistantChatProps | null>(null);

export function useAssistantChatProps() {
  return useContext(AssistantChatContext);
}

type AssistantChatProviderProps = {
  main: ReactNode;
};

export function AssistantChatProvider({ main }: AssistantChatProviderProps) {
  const { open: agentInlineOpen } = useAgentMode();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
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

  const chat = useMemo((): AssistantChatProps | null => {
    if (!isAuthenticated || !user) return null;

    return {
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
        user.name?.trim() || user.email.split("@")[0] || "Вы",
    };
  }, [
    isAuthenticated,
    user,
    error,
    answer,
    history,
    question,
    setQuestion,
    askAssistant,
    withMcp,
    toggleWithMcp,
    enabledCount,
    totalCount,
    isToolEnabled,
    toggleTool,
    setAllTools,
    loading,
    pendingTurn,
  ]);

  return (
    <>
      {main}
      <AssistantChatContext.Provider value={chat}>
        {agentInlineOpen ? (
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-background">
            <AssistantInlinePanel />
          </div>
        ) : null}
        <AssistantFloatingPanel />
      </AssistantChatContext.Provider>
    </>
  );
}