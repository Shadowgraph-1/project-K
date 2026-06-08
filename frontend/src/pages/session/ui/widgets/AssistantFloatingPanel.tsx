import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Bot,
  KeyRound,
  ListChecks,
  Settings,
  X,
} from "lucide-react";

import AssistantInput from "@/widgets/assistant/ui/AssistantInput";
import { Button, buttonVariants } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { useSessionSecondarySidebarStore } from "@/shared/model/useSessionSecondarySidebarStore";
import { cn } from "@/shared/lib/utils";

export type AssistantFloatingPanelChatProps = {
  error: string;
  answer: string;
  history: { role: "user" | "assistant"; content: string }[];
  question: string;
  onQuestionChange: (value: string) => void;
  onSend: () => void;
  withTask: boolean;
  onToggleWithTask: () => void;
  loading: boolean;
  userLabel: string;
};

type AssistantFloatingPanelProps = {
  chat: AssistantFloatingPanelChatProps | null;
};

function lastAssistantContent(
  history: AssistantFloatingPanelChatProps["history"],
) {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === "assistant") return history[i].content;
  }
  return undefined;
}

type ChatTurn = {
  user: string;
  assistant?: string;
  thinking?: boolean;
};

function buildChatTurns(
  history: AssistantFloatingPanelChatProps["history"],
  {
    loading,
    question,
    pendingAssistant,
  }: {
    loading: boolean;
    question: string;
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

  const pendingQuestion = question.trim();

  if (loading && pendingQuestion) {
    turns.push({
      user: pendingQuestion,
      assistant: "Думаю...",
      thinking: true,
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
    <div className="flex justify-end">
      <div className="max-w-[min(100%,92%)] rounded-lg bg-muted px-3 py-2">
        <p className="m-0 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-foreground">
          {children}
        </p>
      </div>
    </div>
  );
}

function AssistantChatMessage({
  children,
  muted,
}: {
  children: string;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-start">
      <p
        className={cn(
          "m-0 max-w-full text-sm leading-relaxed whitespace-pre-wrap wrap-break-word",
          muted ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {children}
      </p>
    </div>
  );
}

function AssistantChatMessages({
  chat,
}: {
  chat: AssistantFloatingPanelChatProps;
}) {
  const pendingAssistant =
    chat.answer.trim() &&
    lastAssistantContent(chat.history) !== chat.answer.trim()
      ? chat.answer.trim()
      : null;

  const turns = buildChatTurns(chat.history, {
    loading: chat.loading,
    question: chat.question,
    pendingAssistant,
  });

  return (
    <>
      {chat.error ? (
        <div
          role="alert"
          className="shrink-0 rounded-lg border border-destructive/40 bg-card px-3 py-2 text-sm text-destructive"
        >
          {chat.error}
        </div>
      ) : null}

      <div
        className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pr-0.5 [scrollbar-gutter:stable]"
      >
        {turns.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Bot className="size-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Kono AI
              </p>
              <p className="text-xs text-muted-foreground">
                Спросите про задачи или попросите помочь с планом
              </p>
            </div>
          </div>
        ) : null}

        {turns.map((turn, i) => (
          <div
            key={`turn-${i}-${turn.user.slice(0, 16)}-${turn.assistant?.slice(0, 16) ?? ""}`}
            className="flex flex-col gap-3"
          >
            {turn.user ? <UserChatMessage>{turn.user}</UserChatMessage> : null}
            {turn.assistant ? (
              <AssistantChatMessage muted={turn.thinking}>
                {turn.assistant}
              </AssistantChatMessage>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}

export function AssistantFloatingPanel({ chat }: AssistantFloatingPanelProps) {
  const open = useSessionSecondarySidebarStore((s) => s.open);
  const setOpen = useSessionSecondarySidebarStore((s) => s.setOpen);
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        role="dialog"
        aria-modal="false"
        aria-label="Kono AI"
        className="fixed z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        style={{
          width: 400,
          height: 600,
          bottom: 24,
          right: 24,
        }}
      >
        <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-medium text-foreground">
              Kono AI
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  "size-7 text-muted-foreground",
                )}
                aria-label="Настройки AI"
                title="Настройки AI"
              >
                <Settings className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>AI настройки</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setAiSettingsOpen(true)}>
                  <KeyRound className="size-4" />
                  Подключить API ключ
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ListChecks className="size-4" />
                  Мои подключения
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7 text-muted-foreground"
              aria-label="Закрыть чат"
              title="Закрыть"
              onClick={() => setOpen(false)}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 px-3 py-3">
          {!chat ? (
            <p className="text-xs text-muted-foreground">
              Войдите в аккаунт, чтобы открыть чат компаньона.
            </p>
          ) : (
            <AssistantChatMessages chat={chat} />
          )}
        </div>

        <div className="shrink-0 border-t border-border p-2">
          {chat ? (
            <AssistantInput
              className="mx-0 max-w-none"
              placeholder="Спросите Kono AI…"
              value={chat.question}
              onChange={chat.onQuestionChange}
              onSend={chat.onSend}
              withTasks={chat.withTask}
              onToggleTasks={chat.onToggleWithTask}
            />
          ) : null}
        </div>
      </div>

      <Dialog open={aiSettingsOpen} onOpenChange={setAiSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Подключить AI API</DialogTitle>
            <DialogDescription>
              Добавьте свой API ключ, чтобы использовать внешнюю модель вместо
              стандартной Kono AI.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input placeholder="Название, например OpenRouter" />
            <Input placeholder="Base URL, например https://openrouter.ai/api/v1" />
            <Input placeholder="Модель, например openai/gpt-4o-mini" />
            <Input type="password" placeholder="API key" />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAiSettingsOpen(false)}
            >
              Отмена
            </Button>
            <Button type="button">Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>,
    document.body,
  );
}
