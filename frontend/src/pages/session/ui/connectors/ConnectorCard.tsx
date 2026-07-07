import { memo } from "react";
import { AlertCircle, MoreVertical } from "lucide-react";

import type { ConnectorDefinition } from "@/shared/config/connectors";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Switch } from "@/shared/ui/switch";

import { ConnectorIcon } from "./ConnectorIcon";

type ConnectorCardProps = {
  connector: ConnectorDefinition;
  connected?: boolean;
  enabled?: boolean;
  configured?: boolean;
  busy?: boolean;
  onConnect?: (connectorId: string) => void;
  onToggle?: (connectorId: string, enabled: boolean) => void;
  onEditTelegram?: (connectorId: string) => void;
  onRemove?: (connectorId: string) => void;
  className?: string;
};

export const ConnectorCard = memo(function ConnectorCard({
  connector,
  connected = false,
  enabled = false,
  configured = false,
  busy = false,
  onConnect,
  onToggle,
  onEditTelegram,
  onRemove,
  className,
}: ConnectorCardProps) {
  const available = connector.available === true;
  const inactive = !connected && !available;
  const canConnect = available && configured && !connected;
  const needsServerSetup = available && !configured && !connected;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl border p-2.5 outline-none transition-colors",
        inactive
          ? "cursor-not-allowed border-border/40 bg-muted/20 opacity-70"
          : "border-border/60",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <ConnectorIcon connector={connector} inactive={inactive && !connected} />
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-sm font-medium",
              inactive && !connected
                ? "text-muted-foreground"
                : "text-foreground",
            )}
          >
            {connector.name}
          </p>
          {connector.description && !connected ? (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {needsServerSetup
                ? "Подключение временно недоступно"
                : connector.description}
            </p>
          ) : connected ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {enabled ? "Уведомления включены" : "Уведомления выключены"}
            </p>
          ) : null}
        </div>
      </div>

      {connected ? (
        <div className="flex shrink-0 items-center gap-2">
          {connector.status === "reauth" ? (
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="rounded-full text-amber-700 dark:text-amber-400"
              disabled
            >
              <AlertCircle className="size-3.5" />
              Повторная аутентификация
            </Button>
          ) : (
            <Switch
              checked={enabled}
              disabled={busy || !configured}
              onCheckedChange={(checked) => onToggle?.(connector.id, checked)}
              aria-label={`${enabled ? "Выключить" : "Включить"} ${connector.name}`}
            />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Параметры ${connector.name}`}
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              {connector.id === "telegram" ? (
                <DropdownMenuItem
                  disabled={busy}
                  onClick={() => onEditTelegram?.(connector.id)}
                >
                  Изменить ID
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                disabled={busy}
                onClick={() => onRemove?.(connector.id)}
              >
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : canConnect ? (
        <Button
          type="button"
          size="xs"
          className="shrink-0 rounded-full"
          disabled={busy}
          onClick={() => onConnect?.(connector.id)}
        >
          Подключить
        </Button>
      ) : inactive ? (
        <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          Скоро
        </span>
      ) : needsServerSetup ? (
        <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          Недоступен
        </span>
      ) : null}
    </div>
  );
});