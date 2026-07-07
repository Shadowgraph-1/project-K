import { memo, useCallback, useMemo, useState } from "react";
import { ChevronDown, Plus, Search } from "lucide-react";

import {
  MORE_RECOMMENDED_CONNECTORS,
  RECOMMENDED_CONNECTORS,
  type ConnectorDefinition,
} from "@/shared/config/connectors";
import { usesDefaultTelegramChatId } from "@/shared/config/telegram-connector";
import {
  useConnectorsQuery,
  useDeleteConnectorMutation,
  usePatchConnectorMutation,
} from "@/hooks/use-connectors-query";
import { useLegacyDocsViewRedirect } from "@/pages/session/lib/use-legacy-docs-view-redirect";
import { DOCS_PATHS } from "@/shared/config/docs-paths";
import { SectionDocsLink } from "@/pages/session/ui/layout/SectionDocsLink";
import { sessionField, sessionPillOutline } from "@/pages/session/lib/session-styles";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { ConnectorCard } from "./ConnectorCard";
import { ConnectedConnectorsEmptyState } from "./ConnectedConnectorsEmptyState";
import { TelegramConnectDialog } from "./TelegramConnectDialog";

type ConnectorWithState = ConnectorDefinition & {
  installed: boolean;
  enabled: boolean;
  configured: boolean;
  telegramChatId: string | null;
};

const ALL_CATALOG = [...RECOMMENDED_CONNECTORS, ...MORE_RECOMMENDED_CONNECTORS];

function filterConnectors(
  items: ConnectorWithState[],
  query: string,
): ConnectorWithState[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return items.filter((item) => {
    const haystack = `${item.name} ${item.description ?? ""}`.toLowerCase();
    return haystack.includes(q);
  });
}

function mergeConnectorState(
  catalog: ConnectorDefinition[],
  apiState: Map<
    string,
    {
      installed: boolean;
      enabled: boolean;
      configured: boolean;
      telegramChatId: string | null;
    }
  >,
): ConnectorWithState[] {
  return catalog.map((item) => {
    const state = apiState.get(item.id);
    return {
      ...item,
      installed: state?.installed ?? false,
      enabled: state?.enabled ?? false,
      configured: state?.configured ?? false,
      telegramChatId: state?.telegramChatId ?? null,
    };
  });
}

type ConnectorsCatalogProps = {
  catalog: ConnectorWithState[];
  stateById: Map<
    string,
    {
      installed: boolean;
      enabled: boolean;
      configured: boolean;
      telegramChatId: string | null;
    }
  >;
  isLoading: boolean;
  usesDefaultChatId: boolean;
};

const ConnectorsCatalog = memo(function ConnectorsCatalog({
  catalog,
  stateById,
  isLoading,
  usesDefaultChatId,
}: ConnectorsCatalogProps) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [telegramDialogOpen, setTelegramDialogOpen] = useState(false);
  const [telegramChatIdDraft, setTelegramChatIdDraft] = useState<string | null>(
    null,
  );
  const patchConnector = usePatchConnectorMutation();
  const deleteConnector = useDeleteConnectorMutation();

  const busyConnectorId = patchConnector.isPending
    ? (patchConnector.variables?.connectorId ?? null)
    : deleteConnector.isPending
      ? (deleteConnector.variables ?? null)
      : null;

  const handleToggle = useCallback(
    (connectorId: string, enabled: boolean) => {
      patchConnector.mutate({ connectorId, enabled });
    },
    [patchConnector],
  );

  const handleConnect = useCallback(
    (connectorId: string) => {
      if (connectorId === "telegram" && !usesDefaultChatId) {
        setTelegramChatIdDraft(null);
        setTelegramDialogOpen(true);
        return;
      }

      patchConnector.mutate({ connectorId, enabled: true });
    },
    [patchConnector, usesDefaultChatId],
  );

  const handleEditTelegram = useCallback(
    (connectorId: string) => {
      const current = stateById.get(connectorId)?.telegramChatId ?? null;
      setTelegramChatIdDraft(current);
      setTelegramDialogOpen(true);
    },
    [stateById],
  );

  const handleTelegramSubmit = useCallback(
    (chatId: string) => {
      const installed = stateById.get("telegram")?.installed ?? false;

      patchConnector.mutate(
        {
          connectorId: "telegram",
          enabled: true,
          telegramChatId: chatId,
        },
        {
          onSuccess: () => {
            setTelegramDialogOpen(false);
            if (!installed) {
              setTelegramChatIdDraft(null);
            }
          },
        },
      );
    },
    [patchConnector, stateById],
  );

  const handleRemove = useCallback(
    (connectorId: string) => {
      deleteConnector.mutate(connectorId);
    },
    [deleteConnector],
  );

  const connected = useMemo(
    () => filterConnectors(catalog.filter((item) => item.installed), search),
    [catalog, search],
  );

  const available = useMemo(() => {
    const base = expanded
      ? catalog.filter((item) => !item.installed)
      : catalog.filter(
          (item) =>
            !item.installed &&
            RECOMMENDED_CONNECTORS.some((c) => c.id === item.id),
        );
    return filterConnectors(base, search);
  }, [catalog, expanded, search]);

  const showExpand =
    !search.trim() &&
    !expanded &&
    MORE_RECOMMENDED_CONNECTORS.some(
      (item) => !stateById.get(item.id)?.installed,
    );

  return (
    <>
      <div className="mb-4 flex justify-end">
        <div className="relative w-full sm:w-48">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск..."
            autoComplete="off"
            className={cn(sessionField, "h-8 ps-9")}
          />
        </div>
      </div>

      <section className="mb-4">
        <h2 className="mb-2 text-base font-semibold text-foreground">
          Подключённые
        </h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Загрузка...</p>
        ) : connected.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {connected.map((connector) => (
              <ConnectorCard
                key={connector.id}
                connector={connector}
                connected
                enabled={connector.enabled}
                configured={connector.configured}
                busy={busyConnectorId === connector.id}
                onToggle={handleToggle}
                onEditTelegram={handleEditTelegram}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : !search.trim() ? (
          <ConnectedConnectorsEmptyState />
        ) : (
          <p className="text-sm text-muted-foreground">Ничего не найдено.</p>
        )}
      </section>

      <section className="mb-3">
        <h2 className="mb-2 text-base font-semibold text-foreground">
          {connected.length > 0 ? "Доступные" : "Рекомендуемые"}
        </h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Загрузка...</p>
        ) : available.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {available.map((connector) => (
              <ConnectorCard
                key={connector.id}
                connector={connector}
                enabled={connector.enabled}
                configured={connector.configured}
                busy={busyConnectorId === connector.id}
                onConnect={handleConnect}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Ничего не найдено.</p>
        )}
      </section>

      {showExpand ? (
        <div className="-mt-1 mb-2 flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(sessionPillOutline, "rounded-full")}
            onClick={() => setExpanded(true)}
          >
            Развернуть
            <ChevronDown className="size-4" />
          </Button>
        </div>
      ) : null}

      <TelegramConnectDialog
        open={telegramDialogOpen}
        onOpenChange={setTelegramDialogOpen}
        initialChatId={telegramChatIdDraft}
        busy={patchConnector.isPending}
        onSubmit={handleTelegramSubmit}
      />
    </>
  );
});

export function ConnectorsPage() {
  useLegacyDocsViewRedirect(DOCS_PATHS.connectors);

  const userEmail = useAuthStore((s) => s.user?.email);
  const usesDefaultChatId = usesDefaultTelegramChatId(userEmail);

  const { data, isLoading } = useConnectorsQuery();

  const stateById = useMemo(() => {
    const map = new Map<
      string,
      {
        installed: boolean;
        enabled: boolean;
        configured: boolean;
        telegramChatId: string | null;
      }
    >();
    for (const item of data?.connectors ?? []) {
      map.set(item.id, {
        installed: item.installed,
        enabled: item.enabled,
        configured: item.configured,
        telegramChatId: item.telegramChatId,
      });
    }
    return map;
  }, [data?.connectors]);

  const catalog = useMemo(
    () => mergeConnectorState(ALL_CATALOG, stateById),
    [stateById],
  );

  return (
    <div className="mx-auto w-full max-w-3xl pb-4">
      <div className="mb-3 flex min-h-0 w-full items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Коннекторы
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          <SectionDocsLink to={DOCS_PATHS.connectors} />
          <Button type="button" size="sm" className="rounded-full" disabled>
            <Plus />
            Новый коннектор
          </Button>
        </div>
      </div>

      <ConnectorsCatalog
        catalog={catalog}
        stateById={stateById}
        isLoading={isLoading}
        usesDefaultChatId={usesDefaultChatId}
      />
    </div>
  );
}