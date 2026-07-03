import {
  AssistantChatDisclaimer,
  AssistantChatInput,
  AssistantChatMessages,
  type AssistantChatProps,
} from "./assistant-chat-ui";

type AssistantInlinePanelProps = {
  chat: AssistantChatProps | null;
};

export function AssistantInlinePanel({ chat }: AssistantInlinePanelProps) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6">
        {!chat ? (
          <p className="text-xs text-muted-foreground">
            Войдите в аккаунт, чтобы открыть чат компаньона.
          </p>
        ) : (
          <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
            <AssistantChatMessages chat={chat} />
          </div>
        )}
      </div>

      {chat ? (
        <div className="shrink-0 space-y-2 px-4 py-4 pr-28 sm:px-6 sm:pr-36">
          <AssistantChatInput chat={chat} className="mx-auto max-w-3xl" />
          <AssistantChatDisclaimer />
        </div>
      ) : null}
    </div>
  );
}