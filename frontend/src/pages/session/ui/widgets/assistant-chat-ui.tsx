import { Bot } from "lucide-react";

import AssistantInput from "@/widgets/assistant/ui/AssistantInput";
import { Spinner } from "@/shared/ui/spinner";
import { normalizeAssistantText } from "@/shared/lib/normalize-assistant-text";
import type { AssistantPendingTurn } from "@/hooks/use-assistant-chat";
import { cn } from "@/shared/lib/utils";

export type AssistantChatProps = {
  error: string;
  answer: string;
  history: { role: "user" | "assistant"; content: string }[];
  question: string;
  onQuestionChange: (value: string) => void;
  onSend: () => void;
  withMcp: boolean;
  onToggleWithMcp: () => void;
  enabledCount: number;
  totalCount: number;
  isToolEnabled: (toolName: string) => boolean;
  onToggleTool: (toolName: string) => void;
  onSetAllTools: (enabled: boolean) => void;
  loading: boolean;
  pendingTurn: AssistantPendingTurn | null;
  userLabel: string;
};

type ChatTurn = {
  user: string;
  assistant?: string;
  pending?: AssistantPendingTurn["status"];
};

function lastAssistantContent(history: AssistantChatProps["history"]) {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === "assistant") return history[i].content;
  }
  return undefined;
}

function buildChatTurns(
  history: AssistantChatProps["history"],
  {
    pendingTurn,
    pendingAssistant,
  }: {
    pendingTurn: AssistantPendingTurn | null;
    pendingAssistant: string | null;
  },
): ChatTurn[] {
  const turns: ChatTurn[] = [];

  for (const msg of history) {
    if (msg.role === "user") {
      turns.push({ user: msg.content });
    } else if (turns.length > 0) {
      turns[turns.length - 1].assistant = msg.content;
    }
  }

  if (pendingTurn) {
    turns.push({
      user: pendingTurn.user,
      assistant:
        pendingTurn.status === "acting"
          ? "Выполняю действие…"
          : "Думаю…",
      pending: pendingTurn.status,
    });
  } else if (pendingAssistant) {
    const last = turns[turns.length - 1];
    if (last && !last.assistant) {
      last.assistant = pendingAssistant;
    } else {
      turns.push({ user: "", assistant: pendingAssistant });
    }
  }

  return turns;
}

function UserChatMessage({ children }: { children: string }) {
  return (
    <div className="flex w-full justify-end">
      <div className="max-w-[min(100%,85%)] rounded-2xl rounded-br-md bg-muted px-3.5 py-2.5">
        <p className="m-0 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-foreground">
          {children}
        </p>
      </div>
    </div>
  );
}

function AssistantChatMessage({
  children,
  pending,
}: {
  children: string;
  pending?: AssistantPendingTurn["status"];
}) {
  return (
    <div className="flex w-full justify-start gap-2.5">
      <div
        className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted"
        aria-hidden
      >
        {pending ? (
          <Spinner className="size-3.5 text-muted-foreground" />
        ) : (
          <Bot className="size-3.5 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0 max-w-[min(100%,calc(100%-2.5rem))] flex-1 pt-0.5">
        <p
          className={cn(
            "m-0 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word",
            pending ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {children}
        </p>
      </div>
    </div>
  );
}

export function AssistantChatMessages({ chat }: { chat: AssistantChatProps }) {
  const pendingAssistant =
    chat.answer.trim() &&
    lastAssistantContent(chat.history) !== chat.answer.trim()
      ? chat.answer.trim()
      : null;

  const turns = buildChatTurns(chat.history, {
    pendingTurn: chat.pendingTurn,
    pendingAssistant,
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {chat.error ? (
        <div
          role="alert"
          className="shrink-0 rounded-lg border border-destructive/40 bg-card px-3 py-2 text-sm text-destructive"
        >
          {chat.error}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-gutter:stable]">
        {turns.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-2 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-muted">
              <Bot className="size-5 text-muted-foreground" />
            </div>
            <div className="max-w-sm space-y-1.5">
              <p className="text-sm font-medium text-foreground">Kono AI</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Спросите про задачи или попросите создать через MCP
              </p>
              <p className="text-[11px] leading-relaxed text-muted-foreground/70">
                История чата доступна только в этой сессии и сбрасывается после
                перезагрузки страницы
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5 py-1">
            {turns.map((turn, index) => (
              <div
                key={`${index}-${turn.user}-${turn.assistant ?? ""}-${turn.pending ?? "done"}`}
                className="flex flex-col gap-3"
              >
                {turn.user ? (
                  <UserChatMessage>{turn.user}</UserChatMessage>
                ) : null}
                {turn.assistant ? (
                  <AssistantChatMessage pending={turn.pending}>
                    {turn.pending
                      ? turn.assistant
                      : normalizeAssistantText(turn.assistant)}
                  </AssistantChatMessage>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AssistantChatInput({
  chat,
  className,
}: {
  chat: AssistantChatProps;
  className?: string;
}) {
  return (
    <AssistantInput
      className={className}
      placeholder="Спросите Kono AI…"
      value={chat.question}
      onChange={chat.onQuestionChange}
      onSend={chat.onSend}
      withMcp={chat.withMcp}
      onToggleMcp={chat.onToggleWithMcp}
      enabledCount={chat.enabledCount}
      totalCount={chat.totalCount}
      isToolEnabled={chat.isToolEnabled}
      onToggleTool={chat.onToggleTool}
      onSetAllTools={chat.onSetAllTools}
      loading={chat.loading}
    />
  );
}

export function AssistantChatDisclaimer({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "w-full text-center text-[10px] text-muted-foreground/80 sm:text-[11px] sm:whitespace-nowrap",
        className,
      )}
    >
      Kono AI может ошибаться, криво вызвать MCP или лениться — надёжнее{" "}
      <span className="whitespace-nowrap">теми самыми руками.</span>
    </p>
  );
}