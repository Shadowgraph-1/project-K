import { useMemo, useState, useEffect, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import {
  useCreateLlmKeyMutation,
  useActivateLlmKeyMutation,
  useDeleteAllLlmKeysMutation,
  useDeleteLlmKeyMutation,
  useLlmKeysQuery,
} from "@/hooks/use-llm-key-query";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { useLegacyDocsViewRedirect } from "@/pages/session/lib/use-legacy-docs-view-redirect";
import { DOCS_PATHS } from "@/shared/config/docs-paths";
import { SessionPageHeader } from "@/pages/session/ui/layout/SessionPageHeader";
import { SectionDocsLink } from "@/pages/session/ui/layout/SectionDocsLink";
import { sessionPillOutline } from "@/pages/session/lib/session-styles";
import { LlmKeysTableSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { LlmCreateKeyDialog } from "./LlmCreateKeyDialog";
import { LlmKeysTable } from "./LlmKeysTable";
import { keyTitle } from "./llm-keys-utils";

export function LlmKeysPage() {
  useLegacyDocsViewRedirect(DOCS_PATHS.apiKeys);

  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [createDialogKey, setCreateDialogKey] = useState(0);
  const [createPresetLabel, setCreatePresetLabel] = useState("");

  const sorting =
    searchParams.get("sorting") === "created" ? "created" : "name";
  const ordering =
    searchParams.get("ordering") === "desc" ? "desc" : "asc";

  const userName = useAuthStore((s) => s.user?.name ?? "—");
  const { data, isLoading } = useLlmKeysQuery({ sorting, ordering });
  const createMutation = useCreateLlmKeyMutation();
  const activateMutation = useActivateLlmKeyMutation();
  const deleteMutation = useDeleteLlmKeyMutation();
  const deleteAllMutation = useDeleteAllLlmKeysMutation();

  const keys = useMemo(() => data?.keys ?? [], [data?.keys]);

  const toolbarBusy =
    createMutation.isPending || deleteAllMutation.isPending;

  const busyKeyId = activateMutation.isPending
    ? (activateMutation.variables ?? null)
    : deleteMutation.isPending
      ? (deleteMutation.variables ?? null)
      : null;

  const handleActivate = useCallback(
    (keyId: string) => {
      activateMutation.mutate(keyId);
    },
    [activateMutation],
  );

  const handleDeleteKey = useCallback(
    async (key: (typeof keys)[number]) => {
      const title = keyTitle(key);
      const confirmed = await notifyConfirm({
        title: "Удалить API ключ?",
        description: `«${title}» будет удалён без возможности восстановления.`,
        confirmLabel: "Удалить",
        cancelLabel: "Отмена",
      });
      if (!confirmed) return;
      deleteMutation.mutate(key.id);
    },
    [deleteMutation],
  );

  function openCreateDialog(presetLabel = "") {
    setCreatePresetLabel(presetLabel);
    setCreateDialogKey((k) => k + 1);
    setCreateOpen(true);
  }

  function toggleSort(field: "name" | "created") {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const current = prev.get("sorting") ?? "name";

        if (current === field) {
          next.set("ordering", ordering === "asc" ? "desc" : "asc");
        } else {
          next.set("sorting", field);
          next.set("ordering", "asc");
        }

        return next;
      },
      { replace: true },
    );
  }

  useEffect(() => {
    if (searchParams.get("create") !== "1") return;

    const id = window.setTimeout(() => {
      openCreateDialog();
    }, 0);

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("create");
        return next;
      },
      { replace: true },
    );

    return () => window.clearTimeout(id);
  }, [searchParams, setSearchParams]);

  async function handleDeleteAll() {
    if (keys.length === 0) return;

    const confirmed = await notifyConfirm({
      title: "Удалить все ключи?",
      description: `Будет удалено ключей: ${keys.length}`,
    });

    if (!confirmed) return;
    deleteAllMutation.mutate();
  }

  const toolbarActions = !isLoading ? (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
      <SectionDocsLink to={DOCS_PATHS.apiKeys} />
      {keys.length > 0 ? (
        <Button
          type="button"
          variant="outline"
          className={cn(sessionPillOutline, "h-9 gap-1 px-4")}
          onClick={handleDeleteAll}
          disabled={toolbarBusy}
        >
          <Trash2 className="size-4" />
          Удалить все
        </Button>
      ) : null}
      <Button
        type="button"
        className="h-9 gap-1 rounded-full px-4 shadow-sm"
        onClick={() => openCreateDialog()}
        disabled={toolbarBusy}
      >
        <Plus className="size-4" />
        Создать ключ
      </Button>
    </div>
  ) : null;

  return (
    <div className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col gap-3 px-1 pb-2">
      {!isLoading ? (
        <SessionPageHeader title="API ключи" actions={toolbarActions} />
      ) : null}

      {isLoading ? (
        <LlmKeysTableSkeleton />
      ) : (
        <LlmKeysTable
          userName={userName}
          keys={keys}
          sorting={sorting}
          ordering={ordering}
          busyKeyId={busyKeyId}
          onToggleSort={toggleSort}
          onActivate={handleActivate}
          onDelete={handleDeleteKey}
        />
      )}

      <LlmCreateKeyDialog
        key={createDialogKey}
        open={createOpen}
        busy={toolbarBusy}
        isCreating={createMutation.isPending}
        initialLabel={createPresetLabel}
        onOpenChange={setCreateOpen}
        onCreate={({ label, apiKey }) => {
          createMutation.mutate(
            {
              apiKey,
              ...(label ? { label } : {}),
            },
            {
              onSuccess: () => setCreateOpen(false),
            },
          );
        }}
      />
    </div>
  );
}