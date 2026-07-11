import { useState } from "react";
import { Bell, SquareMousePointer } from "lucide-react";

import { useNotifys } from "@/entities/notification/model/useNotifys";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { useInviteCountQuery } from "@/hooks/use-invites-query";
import { useAgentMode } from "@/pages/session/model/AgentModeContext";
import { useNotificationPrefsStore } from "@/shared/model/useNotificationPrefsStore";
import { useSearchBar } from "@/hooks/use-searchBar";
import { Button } from "@/shared/ui/button";
import { SidebarTrigger, useSidebar } from "@/shared/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { sessionToolbarIconButton } from "@/pages/session/lib/session-styles";
import { cn } from "@/shared/lib/utils";
import NotifysCenter from "../widgets/NotifysCenter";
import { SearchBar } from "../widgets/SearchBar";
import { WorkspaceCollaborationDialog } from "../workspace/WorkspaceCollaborationDialog";
import { SessionBreadcrumbs } from "./SessionBreadcrumbs";
import { SessionTooltip } from "./SessionTooltip";

export function SessionShellHeader() {
  const { state: sidebarState } = useSidebar();
  const sidebarExpanded = sidebarState === "expanded";
  const { focus, setFocus } = useSearchBar();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { open: agentOpen, toggle: toggleAgent } = useAgentMode();

  const taskHistoryEnabled = useNotificationPrefsStore(
    (s) => s.taskHistoryEnabled,
  );
  const teamInvitesEnabled = useNotificationPrefsStore(
    (s) => s.teamInvitesEnabled,
  );

  const { data: inviteCount = 0 } = useInviteCountQuery();
  const effectiveInviteCount = teamInvitesEnabled ? inviteCount : 0;
  const toastCount = useNotifys((s) => s.notifys.length);
  const notifyCount =
    (taskHistoryEnabled ? toastCount : 0) + effectiveInviteCount;

  const [openCenter, setOpenCenter] = useState(false);

  return (
    <>
      <header className="relative z-30 flex min-h-12 w-full shrink-0 items-center gap-2 border-b border-border/40 bg-background/95 px-3 py-2 sm:gap-3 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-6">
        <div className="flex min-w-0 items-center gap-1 sm:gap-2 md:justify-self-start">
          <SidebarTrigger
            className={cn(
              "size-7 shrink-0 rounded-md",
              sessionToolbarIconButton,
            )}
            title={sidebarExpanded ? "Свернуть меню" : "Развернуть меню"}
            aria-label={
              sidebarExpanded
                ? "Свернуть боковую панель"
                : "Развернуть боковую панель"
            }
          />
          <div className="hidden min-w-0 md:block">
            <SessionBreadcrumbs />
          </div>
        </div>

        <div className="hidden min-w-0 md:block" />

        <div className="relative z-10 ml-auto flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2 md:flex-none md:justify-self-end">
          <SearchBar
            className="min-w-0 flex-1 sm:flex-none"
            focused={focus}
            onFocusChange={setFocus}
          />
          {isAuthenticated ? (
            <SessionTooltip
              label={agentOpen ? "Закрыть агента · Ctrl+J" : "Агент · Ctrl+J"}
            >
              <button
                type="button"
                aria-label={agentOpen ? "Закрыть агента" : "Открыть агента"}
                aria-pressed={agentOpen}
                onClick={toggleAgent}
                className={cn(
                  "group relative flex h-8 shrink-0 items-center gap-1.5 overflow-hidden rounded-lg px-2 text-[13px] font-medium outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "bg-muted/50 text-foreground ring-1 ring-border/35",
                  "hover:bg-muted/70 hover:ring-border/50",
                  agentOpen && "bg-muted/80 ring-border/60",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 rounded-lg bg-linear-to-r from-violet-500/10 via-sky-500/10 to-emerald-500/10 transition-opacity duration-300",
                    agentOpen
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100",
                  )}
                />
                <span className="relative flex items-center gap-1.5">
                  <SquareMousePointer className="size-3.5 shrink-0" aria-hidden />
                  <span className="hidden sm:inline">Агент</span>
                </span>
              </button>
            </SessionTooltip>
          ) : null}
          <Button
            type="button"
            size="icon-sm"
            className={cn(
              "relative size-7 shrink-0 overflow-visible rounded-md",
              sessionToolbarIconButton,
            )}
            variant="ghost"
            onClick={() => setOpenCenter(true)}
            aria-expanded={openCenter}
            aria-controls="session-notifications-sheet"
            title={
              notifyCount > 0
                ? `Уведомления (${notifyCount})`
                : "Уведомления"
            }
            aria-label={
              notifyCount > 0
                ? `Уведомления, в списке ${notifyCount}`
                : "Уведомления"
            }
          >
            <Bell className="size-3.5 shrink-0" aria-hidden />
            {notifyCount > 0 ? (
              <span className="pointer-events-none absolute right-1 top-1 size-1.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            ) : null}
          </Button>
        </div>
      </header>

      <WorkspaceCollaborationDialog />

      <Sheet open={openCenter} onOpenChange={setOpenCenter}>
        <SheetContent
          id="session-notifications-sheet"
          side="right"
          className="flex w-full flex-col p-0 sm:max-w-md"
        >
          <SheetHeader className="shrink-0 border-b border-border/60 p-4 text-left">
            <SheetTitle>Уведомления</SheetTitle>
            <SheetDescription className="text-xs">
              История оповещений в этой сессии
            </SheetDescription>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col">
            <NotifysCenter />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}