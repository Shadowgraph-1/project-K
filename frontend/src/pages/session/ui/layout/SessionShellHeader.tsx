import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

import { useNotifys } from "@/entities/notification/model/useNotifys";
import { useInvitesQuery } from "@/hooks/use-invites-query";
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
import { SessionHeaderSectionSelect } from "./SessionHeaderSectionSelect";
import { useSessionPageSectionConfig } from "../../model/SessionPageSectionContext";

function isAuthenticatedSessionPath(pathname: string) {
  return (
    pathname.startsWith("/projects") || pathname.startsWith("/workspaces")
  );
}

export function SessionShellHeader() {
  const { pathname } = useLocation();
  const { state: sidebarState } = useSidebar();
  const sidebarExpanded = sidebarState === "expanded";
  const { focus, setFocus } = useSearchBar();

  const taskHistoryEnabled = useNotificationPrefsStore(
    (s) => s.taskHistoryEnabled,
  );
  const teamInvitesEnabled = useNotificationPrefsStore(
    (s) => s.teamInvitesEnabled,
  );

  const { data: incoming } = useInvitesQuery();
  const inviteCount = teamInvitesEnabled ? (incoming?.length ?? 0) : 0;
  const toastCount = useNotifys((s) => s.notifys.length);
  const notifyCount =
    (taskHistoryEnabled ? toastCount : 0) + inviteCount;

  const [openCenter, setOpenCenter] = useState(false);
  const sectionConfig = useSessionPageSectionConfig();
  const showSectionNav = sectionConfig !== null;

  if (!isAuthenticatedSessionPath(pathname)) {
    return null;
  }

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
          {showSectionNav ? (
            <SessionHeaderSectionSelect className="md:hidden" />
          ) : null}
        </div>

        <div className="hidden min-w-0 items-center justify-center gap-1 md:flex">
          {showSectionNav ? <SessionHeaderSectionSelect /> : null}
        </div>

        <div className="relative z-10 ml-auto flex shrink-0 items-center gap-1 sm:gap-2 md:justify-self-end">
          <SearchBar focused={focus} onFocusChange={setFocus} />
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
