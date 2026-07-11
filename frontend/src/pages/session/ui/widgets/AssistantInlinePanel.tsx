import { useAssistantChatProps } from "@/pages/session/model/AssistantChatContext";

import {
  AssistantChatDisclaimer,
  AssistantChatInput,
  AssistantChatMessages,
} from "./assistant-chat-ui";

/** Full-session agent chat: one centered column, messages + composer aligned. */
export function AssistantInlinePanel() {
  const chat = useAssistantChatProps();

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {!chat ? (
        <div className="flex flex-1 items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">
            Войдите в аккаунт, чтобы открыть чат компаньона.
          </p>
        </div>
      ) : (
        <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col px-4 sm:px-6">
          <div className="flex min-h-0 flex-1 flex-col py-4 sm:py-6">
            <AssistantChatMessages chat={chat} />
          </div>

          <div className="shrink-0 space-y-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:pt-4">
            <AssistantChatInput chat={chat} className="mx-0 max-w-none" />
            <AssistantChatDisclaimer />
          </div>
        </div>
      )}
    </div>
  );
}
