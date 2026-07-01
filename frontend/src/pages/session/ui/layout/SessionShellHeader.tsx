import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

import { useNotifys } from "@/entities/notification/model/useNotifys";
import { useInvitesQuery } from "@/hooks/use-invites-query";
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
import { WorkspaceCollaborationDialog } from "../workspace/WorkspaceCollaborationDialog";
import { SessionBreadcrumbs } from "./SessionBreadcrumbs";

function isAuthenticatedSessionPath(pathname: string) {
  return (
    pathname.startsWith("/projects") || pathname.startsWith("/workspaces")
  );
}

export function SessionShellHeader() {
  const { pathname } = useLocation();
  const { state: sidebarState } = useSidebar();
  const sidebarExpanded = sidebarState === "expanded";

  const { data: incoming } = useInvitesQuery();
  const inviteCount = incoming?.length ?? 0;
  const toastCount = useNotifys((s) => s.notifys.length);
  const notifyCount = toastCount + inviteCount;

  const [openCenter, setOpenCenter] = useState(false);

  if (!isAuthenticatedSessionPath(pathname)) {
    return null;
  }

  return (
    <>
      <header className="flex min-h-12 w-full shrink-0 items-center justify-between gap-3 border-b border-border/40 bg-background/95 px-3 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
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
          <SessionBreadcrumbs />
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            size="icon-sm"
            className={cn(
              "relative size-7 overflow-visible rounded-md",
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