import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Bot, KeyRound, Settings, X } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { useAssistantChatProps } from "@/pages/session/model/AssistantChatContext";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { Button, buttonVariants } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useSessionSecondarySidebarStore } from "@/shared/model/useSessionSecondarySidebarStore";
import { cn } from "@/shared/lib/utils";
import { sessionToolbarIconButton } from "@/pages/session/lib/session-styles";
import { SessionTooltip } from "@/pages/session/ui/layout/SessionTooltip";

import { AssistantChatInput, AssistantChatMessages } from "./assistant-chat-ui";

export function AssistantFloatingPanel() {
  const isMobile = useIsMobile();
  const chat = useAssistantChatProps();
  const navigate = useNavigate();
  const open = useSessionSecondarySidebarStore((s) => s.open);
  const panel = useSessionSecondarySidebarStore((s) => s.panel);
  const presentation = useSessionSecondarySidebarStore(
    (s) => s.assistantPresentation,
  );
  const setOpen = useSessionSecondarySidebarStore((s) => s.setOpen);

  if (
    typeof document === "undefined" ||
    isMobile ||
    !open ||
    panel !== "assistant" ||
    presentation !== "floating"
  ) {
    return null;
  }

  const close = () => setOpen(false);

  return createPortal(
    <dialog
      open
      aria-label="Kono AI"
      className={cn(
        "fixed z-50 m-0 flex animate-in flex-col overflow-hidden rounded-2xl border-0 bg-background/95 shadow-[0_24px_70px_-16px_rgba(0,0,0,0.4)] ring-1 ring-border/35 backdrop-blur-xl",
        "bottom-6 right-6 left-auto top-auto max-h-[calc(100dvh-3rem)]",
        "fade-in slide-in-from-right-4 duration-200",
      )}
      style={{
        width: 400,
        height: 600,
      }}
    >
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 px-4 shadow-[inset_0_-1px_0_0_color-mix(in_oklch,var(--border)_30%,transparent)]">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
            <Bot className="size-3.5 text-muted-foreground" />
          </div>
          <span className="truncate text-sm font-medium text-foreground">
            Kono AI
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <DropdownMenu>
            <SessionTooltip label="Настройки AI">
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  "size-7",
                  sessionToolbarIconButton,
                )}
                aria-label="Настройки AI"
              >
                <Settings className="size-3.5" />
              </DropdownMenuTrigger>
            </SessionTooltip>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>AI настройки</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate(SESSION_PATHS.llmKeys)}>
                <KeyRound className="size-4" />
                API ключи
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SessionTooltip label="Закрыть">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className={cn("size-7", sessionToolbarIconButton)}
              aria-label="Закрыть чат"
              onClick={close}
            >
              <X className="size-3.5" />
            </Button>
          </SessionTooltip>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 py-4">
        {!chat ? (
          <p className="text-xs text-muted-foreground">
            Войдите в аккаунт, чтобы открыть чат компаньона.
          </p>
        ) : (
          <AssistantChatMessages chat={chat} />
        )}
      </div>

      <div className="shrink-0 p-2.5 shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--border)_30%,transparent)]">
        {chat ? <AssistantChatInput chat={chat} className="mx-0 max-w-none" /> : null}
      </div>
    </dialog>,
    document.body,
  );
}