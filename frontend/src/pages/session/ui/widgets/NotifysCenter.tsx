import { useState } from "react";
import { Bell, CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useNotifys } from "@/entities/notification/model/useNotifys";
import {
  useInvitesQuery,
  useInvitesActions,
} from "@/hooks/use-invites-query";
import { useNotificationPrefsStore } from "@/shared/model/useNotificationPrefsStore";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { cn } from "@/shared/lib/utils";
import { SessionTooltip } from "@/pages/session/ui/layout/SessionTooltip";

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "только что";
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
  return `${Math.floor(diff / 86400)} дн назад`;
}

function inviteTimeAgo(iso: string): string {
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return "";
  return timeAgo(ts);
}


const ICON_MAP = {
  success: <CheckCircle className="size-3.5 text-emerald-500" />,
  error: <XCircle className="size-3.5 text-destructive" />,
  warning: <AlertTriangle className="size-3.5 text-amber-500" />,
  info: <Info className="size-3.5 text-blue-500" />,
  default: <Bell className="size-3.5 text-muted-foreground" />,
};

const BORDER_MAP: Record<string, string> = {
  success: "bg-emerald-500/5 ring-1 ring-emerald-500/20",
  error: "bg-destructive/5 ring-1 ring-destructive/20",
  warning: "bg-amber-500/5 ring-1 ring-amber-500/20",
  info: "bg-blue-500/5 ring-1 ring-blue-500/20",
  default: "bg-muted/30 ring-1 ring-border/25",
  invite: "bg-violet-500/5 ring-1 ring-violet-500/20",
};

function NotifysCenter() {
  const notifys = useNotifys((state) => state.notifys);
  const removeNotify = useNotifys((state) => state.removeNotify);
  const taskHistoryEnabled = useNotificationPrefsStore(
    (s) => s.taskHistoryEnabled,
  );
  const teamInvitesEnabled = useNotificationPrefsStore(
    (s) => s.teamInvitesEnabled,
  );

  const { data: incoming } = useInvitesQuery();
  const { accept, decline } = useInvitesActions();

  const [actingId, setActingId] = useState<string | null>(null);

  const visibleNotifys = taskHistoryEnabled ? notifys : [];
  const visibleInvites = teamInvitesEnabled ? (incoming ?? []) : [];
  const hasAny = visibleNotifys.length > 0 || visibleInvites.length > 0;

  return (
    <div className="flex flex-col">

      <ScrollArea className="max-h-[min(24rem,var(--radix-popover-content-available-height))]">
        <div className="flex flex-col gap-2 p-2.5">
          {!hasAny ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <div className="rounded-full bg-muted p-3">
                <Bell className="size-5 text-muted-foreground/50" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">Всё тихо</p>
                <p className="text-xs text-muted-foreground">
                  Новые оповещения появятся здесь
                </p>
              </div>
            </div>
          ) : (
            <>
              {visibleInvites.map((invite) => (
                <div
                  key={invite.id}
                  className={cn(
                    "rounded-xl px-2.5 py-2 text-sm",
                    BORDER_MAP.invite,
                  )}
                >
                  <p className="text-[13px] font-medium leading-snug text-foreground">
                    Вас пригласили в проект
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                    «{invite.workspaceName}» · от {invite.inviterName}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground/70">
                    {inviteTimeAgo(invite.createdAt)}
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 flex-1 text-xs"
                      disabled={actingId === invite.id}
                      onClick={() => {
                        setActingId(invite.id);
                        void accept(invite).finally(() => setActingId(null));
                      }}
                    >
                      Принять
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 flex-1 text-xs"
                      disabled={actingId === invite.id}
                      onClick={() => {
                        setActingId(invite.id);
                        void decline(invite).finally(() => setActingId(null));
                      }}
                    >
                      Отклонить
                    </Button>
                  </div>
                </div>
              ))}

              {visibleNotifys.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "group relative rounded-xl px-2.5 py-2 text-sm transition-colors",
                    BORDER_MAP[n.status] ?? BORDER_MAP.default,
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">
                      {ICON_MAP[n.status as keyof typeof ICON_MAP] ??
                        ICON_MAP.default}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium leading-snug text-foreground">
                        {n.title}
                      </p>
                      {n.description ? (
                        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                          {n.description}
                        </p>
                      ) : null}
                      <p className="mt-1 text-[10px] text-muted-foreground/70">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                    <SessionTooltip label="Удалить уведомление">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeNotify(n.id)}
                        aria-label="Удалить уведомление"
                      >
                        <X className="size-3" />
                      </Button>
                    </SessionTooltip>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default NotifysCenter;
