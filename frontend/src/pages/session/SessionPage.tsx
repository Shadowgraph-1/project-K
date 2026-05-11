import { TooltipProvider } from "@/shared/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/shared/ui/sidebar";
import { useLocation, useParams } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { useModalStore } from "@/shared/model/useModalStore";
import { useAssistantChat } from "@/widgets/assistant/model/useAssistantChat";
import { useSessionTasks } from "@/entities/task/model/useSessionTasks";
import AppSidebar from "./ui/AppSidebar";
import {
  SESSION_CHARACTERS,
  live2dModelIndexForCharacter,
} from "./model/sessionConstants";
import { SessionPageHeader } from "./ui/SessionPageHeader";
import { SessionMainArea } from "./ui/SessionMainArea";
import { SessionAssistantDock } from "./ui/SessionAssistantDock";
import { useSessionCompanionChatStore } from "@/shared/model/useSessionCompanionChatStore";

const EMPTY_TASK: never[] = [];

function SessionPage() {
  const [character, setCharacter] = useState("nekko");
  const [withTask, setWithTask] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);

  const handleSessionHomeClick = useCallback(() => {
    useSessionCompanionChatStore.getState().setShowChat(false);
  }, []);

  const openLogin = useModalStore((state) => state.openLogin);
  const openRegister = useModalStore((state) => state.openRegister);

  const tasks = useSessionTasks((state) => state.tasks);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const selectedCharacter = SESSION_CHARACTERS.find((c) => c.id === character);

  const { cardId } = useParams();
  const location = useLocation();
  const isNewWorkspace = location.pathname === "/session/workspace/new";
  const inWorkspaceFlow = Boolean(cardId) || isNewWorkspace;

  const { question, setQuestion, answer, error, askAssistant, history } =
    useAssistantChat({
      tasks: withTask ? tasks : EMPTY_TASK,
      characterId: character,
    });

  const modelIndex = useMemo(
    () => live2dModelIndexForCharacter(character),
    [character],
  );

  return (
    <div className="h-dvh overflow-hidden">
      <TooltipProvider>
        <SidebarProvider
          defaultOpen={false}
          className="h-full min-h-0"
        >
          <AppSidebar />
          <SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <SessionPageHeader
              inWorkspaceFlow={inWorkspaceFlow}
              onSessionHomeClick={handleSessionHomeClick}
              isAuthenticated={isAuthenticated}
              hasUser={Boolean(user)}
              onOpenLogin={openLogin}
              onOpenRegister={openRegister}
              character={character}
              onCharacterChange={setCharacter}
              selectedCharacter={selectedCharacter}
            />

            <SessionMainArea
              inWorkspaceFlow={inWorkspaceFlow}
              isNewWorkspace={isNewWorkspace}
              modelIndex={modelIndex}
              character={character}
              onCharacterChange={setCharacter}
            />

            {isAuthenticated && user ? (
              <SessionAssistantDock
                error={error}
                answer={answer}
                assistantName={selectedCharacter?.name}
                historyOpen={historyOpen}
                onHistoryOpenChange={setHistoryOpen}
                history={history}
                selectedCharacter={selectedCharacter}
                question={question}
                onQuestionChange={setQuestion}
                onSend={() => void askAssistant()}
                withTask={withTask}
                onToggleWithTask={() => setWithTask((v) => !v)}
              />
            ) : null}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}

export default SessionPage;
