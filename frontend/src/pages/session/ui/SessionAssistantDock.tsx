import { motion, AnimatePresence } from "motion/react";
import AssistantInput from "@/widgets/assistant/ui/AssistantInput";
import type { SessionCharacter } from "../model/sessionConstants";
import { AssistantHistoryPanel } from "./AssistantHistoryPanel";
import { useSessionCompanionChatStore } from "@/shared/model/useSessionCompanionChatStore";

type SessionAssistantDockProps = {
  error: string;
  answer: string;
  assistantName: string | undefined;
  historyOpen: boolean;
  onHistoryOpenChange: (open: boolean) => void;
  history: { role: "user" | "assistant"; content: string }[];
  selectedCharacter: SessionCharacter | undefined;
  question: string;
  onQuestionChange: (value: string) => void;
  onSend: () => void;
  withTask: boolean;
  onToggleWithTask: () => void;
};

export function SessionAssistantDock({
  error,
  answer,
  assistantName,
  historyOpen,
  onHistoryOpenChange,
  history,
  selectedCharacter,
  question,
  onQuestionChange,
  onSend,
  withTask,
  onToggleWithTask,
}: SessionAssistantDockProps) {
  const showChat = useSessionCompanionChatStore((s) => s.showChat);

  return (
    <AnimatePresence>
      {showChat ? (
        <motion.div
          key="assistant-composer"
          className="absolute inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-4"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 320,
          }}
        >
          <div className="mx-auto flex w-full max-w-[700px] flex-col gap-2">
            {error ? (
              <div
                role="alert"
                className="w-full rounded-lg border border-destructive/40 bg-card px-3 py-2 text-sm text-destructive"
              >
                {error}
              </div>
            ) : null}
            {answer ? (
              <>
                <p className="mx-auto rounded-lg border border-border bg-card px-2 py-0.5 text-sm text-muted-foreground">
                  {assistantName}
                </p>
                <div className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground whitespace-pre-wrap">
                  {answer}
                </div>
              </>
            ) : null}
            {historyOpen ? (
              <AssistantHistoryPanel
                history={history}
                selectedCharacter={selectedCharacter}
                onClose={() => onHistoryOpenChange(false)}
              />
            ) : null}
            <AssistantInput
              className="w-full"
              value={question}
              onChange={onQuestionChange}
              onSend={onSend}
              withTasks={withTask}
              onToggleTasks={onToggleWithTask}
              name={assistantName}
              onToggleHistory={() => onHistoryOpenChange(!historyOpen)}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
