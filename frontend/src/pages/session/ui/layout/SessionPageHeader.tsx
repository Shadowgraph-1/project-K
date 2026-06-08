import { useLocation } from "react-router-dom";
import { Bell, Bot } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { SidebarTrigger, useSidebar } from "@/shared/ui/sidebar";
import { useSessionSecondarySidebarStore } from "@/shared/model/useSessionSecondarySidebarStore";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/ui/sheet";
import NotifysCenter from "../widgets/NotifysCenter";
import { useNotifys } from "@/entities/notification/model/useNotifys";
import { isSessionTasksPath } from "../../model/sessionPaths";
import { WorkspaceCollaborationDialog } from "../workspace/WorkspaceCollaborationDialog";
import { useInvitesQuery } from "@/entities/workspace/model/useInvitesQuery";
import { SessionBreadcrumbs } from "./SessionBreadcrumbs";

type SessionPageHeaderProps = {
  isAuthenticated: boolean;
  hasUser: boolean;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
};

export function SessionPageHeader({
  isAuthenticated,
  hasUser,
}: SessionPageHeaderProps) {
  const { pathname } = useLocation();
  const secondaryOpen = useSessionSecondarySidebarStore((s) => s.open);
  const toggleSecondarySidebar = useSessionSecondarySidebarStore(
    (s) => s.toggle,
  );

  const { data: incoming } = useInvitesQuery();
  const inviteCount = incoming?.length ?? 0;

  const [openCenter, setOpenCenter] = useState(false);

  const toastCount = useNotifys((s) => s.notifys.length);
  const notifyCount = toastCount + inviteCount;

  const inSession =
    isAuthenticated &&
    hasUser &&
    (pathname.startsWith("/projects") || pathname.startsWith("/project"));
  const onTasks = isSessionTasksPath(pathname);
  const showNotifications = inSession;
  const showAssistant = inSession && onTasks;

  const { state: sidebarState } = useSidebar();
  const sidebarExpanded = sidebarState === "expanded";

  return (
    <>
      <header className="flex min-h-12 w-full shrink-0 items-center justify-between gap-3 border-b border-border/40 bg-background/95 px-3 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <SidebarTrigger
            className="size-7 shrink-0 rounded-md text-muted-foreground hover:bg-muted/60"
            title={sidebarExpanded ? "Свернуть меню" : "Развернуть меню"}
            aria-label={
              sidebarExpanded
                ? "Свернуть боковую панель"
                : "Развернуть боковую панель"
            }
          />
          <SessionBreadcrumbs />
        </div>

        {inSession ? (
          <div className="flex shrink-0 items-center gap-1">
            {showNotifications ? (
              <Button
                type="button"
                size="icon-sm"
                className="relative size-7 overflow-visible rounded-md text-muted-foreground hover:bg-muted/60"
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
                  <span className="pointer-events-none absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                ) : null}
              </Button>
            ) : null}
            {showAssistant ? (
              <Button
                type="button"
                size="sm"
                variant={secondaryOpen ? "secondary" : "outline"}
                className="h-7 gap-1.5 px-2.5 text-xs font-medium"
                aria-pressed={secondaryOpen}
                title={secondaryOpen ? "Скрыть Kono AI" : "Kono AI"}
                aria-label={secondaryOpen ? "Скрыть Kono AI" : "Открыть Kono AI"}
                onClick={() => toggleSecondarySidebar()}
              >
                <Bot className="size-3.5 shrink-0" aria-hidden />
                <span className="leading-none">Kono AI</span>
              </Button>
            ) : null}
          </div>
        ) : null}
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
