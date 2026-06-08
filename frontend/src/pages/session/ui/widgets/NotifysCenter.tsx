import { useState } from "react";
import { Bell, CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useNotifys } from "@/entities/notification/model/useNotifys";
import {
  useInvitesQuery,
  useInvitesActions,
} from "@/entities/workspace/model/useInvitesQuery";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";

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

function notifyCountLabel(n: number, invites: number): string {
  const total = n + invites;
  if (total === 0) return "Нет уведомлений";
  const mod10 = total % 10;
  const mod100 = total % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${total} уведомлений`;
  if (mod10 === 1) return `${total} уведомление`;
  if (mod10 >= 2 && mod10 <= 4) return `${total} уведомления`;
  return `${total} уведомлений`;
}

const ICON_MAP = {
  success: <CheckCircle className="size-4 text-emerald-500" />,
  error: <XCircle className="size-4 text-destructive" />,
  warning: <AlertTriangle className="size-4 text-amber-500" />,
  info: <Info className="size-4 text-blue-500" />,
  default: <Bell className="size-4 text-muted-foreground" />,
};

const BORDER_MAP: Record<string, string> = {
  success: "border-emerald-500/20 bg-emerald-500/5",
  error: "border-destructive/20 bg-destructive/5",
  warning: "border-amber-500/20 bg-amber-500/5",
  info: "border-blue-500/20 bg-blue-500/5",
  default: "border-border/70 bg-muted/30",
  invite: "border-violet-500/25 bg-violet-500/5",
};

function NotifysCenter() {
  const notifys = useNotifys((state) => state.notifys);
  const clearNotifys = useNotifys((state) => state.clearNotifys);
  const removeNotify = useNotifys((state) => state.removeNotify);

  const { data: incoming} = useInvitesQuery()
  const { accept, decline } = useInvitesActions();

  const [actingId, setActingId] = useState<string | null>(null);

  const hasAny = notifys.length > 0 || (incoming?.length ?? 0) > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4 pt-2">
      <div className="flex shrink-0 items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{notifyCountLabel(notifys.length, incoming?.length ?? 0)}</span>
        {notifys.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              void (async () => {
                const confirmed = await notifyConfirm({
                  title: "Очистить все уведомления?",
                  description: `Будет удалено: ${notifys.length}`,
                  confirmLabel: "Очистить",
                  cancelLabel: "Отмена",
                });
                if (!confirmed) return;
                clearNotifys();
              })();
            }}
          >
            Очистить всё
          </Button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {!hasAny ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <Bell className="size-8 text-muted-foreground/50" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Всё тихо</p>
              <p className="text-xs text-muted-foreground">
                Даже слишком тихо
              </p>
            </div>
          </div>
        ) : (
          <>
            {(incoming ?? []).map((invite) => (
              <div
                key={invite.id}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-sm",
                  BORDER_MAP.invite,
                )}
              >
                <p className="font-medium leading-snug text-foreground">
                  Вас пригласили в проект
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  «{invite.workspaceName}» · от {invite.inviterName}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground/60">
                  {inviteTimeAgo(invite.createdAt)}
                </p>
                <div className="mt-2.5 flex gap-2">
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

            {notifys.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "group relative rounded-lg border px-3 py-2.5 text-sm transition-colors",
                  BORDER_MAP[n.status] ?? BORDER_MAP.default,
                )}
              >
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 shrink-0">
                    {ICON_MAP[n.status as keyof typeof ICON_MAP] ??
                      ICON_MAP.default}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug text-foreground">
                      {n.title}
                    </p>
                    {n.description ? (
                      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                        {n.description}
                      </p>
                    ) : null}
                    <p className="mt-1.5 text-[10px] uppercase tracking-wide text-muted-foreground/60">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
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
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default NotifysCenter;
