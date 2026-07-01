import { useMemo, useState, useEffect } from "react";
import { ChevronDown, Cpu, MoreHorizontal, Plug2, Plus, Search, Trash2, Waypoints } from "lucide-react";

import type { LlmKeyItem } from "@/api/llm-settings";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import {
  useCreateLlmKeyMutation,
  useActivateLlmKeyMutation,
  useDeleteAllLlmKeysMutation,
  useDeleteLlmKeyMutation,
  useLlmKeysQuery,
} from "@/hooks/use-llm-key-query";
import { SessionTooltip } from "@/pages/session/ui/layout/SessionTooltip";
import { SessionPageHeader } from "@/pages/session/ui/layout/SessionPageHeader";
import {
  sessionField,
  sessionMenuTrigger,
  sessionPillOutline,
  sessionSurface,
} from "@/pages/session/lib/session-styles";
import EmptySession from "@/pages/session/ui/placeholders/EmptySession";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";
import { FIELD_LIMITS } from "@/shared/constants/field-limits";
import { useSearchParams } from "react-router-dom";

function keyTitle(key: LlmKeyItem) {
  return key.label?.trim() || key.hint?.trim() || "API ключ";
}

function formatLastUpdated(iso: string): string {
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return "—";

  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "только что";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} мин назад`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} дн назад`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} мес назад`;
  return `${Math.floor(months / 12)} г назад`;
}

function formatFullDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SortHeader({
  label,
  active = false,
  order = "asc",
  onClick,
}: {
  label: string;
  active?: boolean;
  order?: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 font-medium transition-colors",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <span>{label}</span>
      <ChevronDown
        className={cn(
          "size-3 shrink-0 transition-transform",
          !active && "opacity-50",
          active && order === "desc" && "rotate-180",
        )}
        aria-hidden
      />
    </button>
  );
}

const thClass =
  "whitespace-nowrap px-3 pb-3 pt-2 text-left text-sm font-medium text-muted-foreground";
const tdClass = "whitespace-nowrap px-3 py-2.5 text-sm align-middle";

function LlmKeysTableSkeleton() {
  return (
    <div className={cn(sessionSurface, "overflow-hidden p-1")}>
      <div className="divide-border divide-y">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex h-12 animate-pulse items-center gap-6 px-3"
          >
            <div className="h-3 w-28 rounded-full bg-muted" />
            <div className="h-3 w-24 rounded-full bg-muted" />
            <div className="h-3 w-32 rounded-full bg-muted" />
            <div className="ml-auto h-3 w-20 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LlmKeysPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [apiKey, setApiKey] = useState("");

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

  const keys = data?.keys ?? [];

  const filteredKeys = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return keys;
    return keys.filter((key) => {
      const title = keyTitle(key).toLowerCase();
      const hint = key.hint?.toLowerCase() ?? "";
      const author = key.createdByName.toLowerCase();
      return title.includes(q) || hint.includes(q) || author.includes(q);
    });
  }, [keys, search]);

  const busy =
    createMutation.isPending ||
    activateMutation.isPending ||
    deleteMutation.isPending ||
    deleteAllMutation.isPending;

  function resetCreateForm() {
    setLabel("");
    setApiKey("");
  }

  function handleCreateOpenChange(next: boolean) {
    if (!next) resetCreateForm();
    setCreateOpen(next);
  }

  function handleCreate() {
    const trimmedKey = apiKey.trim();
    if (trimmedKey.length < 8) return;

    createMutation.mutate(
      {
        apiKey: trimmedKey,
        ...(label.trim() ? { label: label.trim() } : {}),
      },
      {
        onSuccess: () => {
          resetCreateForm();
          setCreateOpen(false);
        },
      },
    );
  }
  
  function toggleSort(field: "name" | "created") {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const current = prev.get("sorting") ?? "name";

      if (current === field) {
        next.set("ordering", ordering === "asc" ? "desc" : "asc");
      } else {
        next.set("sorting", field);
        next.set("ordering", "asc");
      }

      return next;
    }, { replace: true });
  }

  function openCreateDialog(presetLabel = "") {
    setLabel(presetLabel);
    setApiKey("");
    setCreateOpen(true);
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

  async function handleDeleteKey(key: LlmKeyItem) {
    const title = keyTitle(key);
    const confirmed = await notifyConfirm({
      title: "Удалить API ключ?",
      description: `«${title}» будет удалён без возможности восстановления.`,
      confirmLabel: "Удалить",
      cancelLabel: "Отмена",
    });
    if (!confirmed) return;
    deleteMutation.mutate(key.id);
  }

  function handleActivateKey(keyId: string) {
    activateMutation.mutate(keyId);
  }

  const showKeysEmpty = !isLoading && keys.length === 0 && !search.trim();
  const showPageHeader = keys.length > 0 || search.trim().length > 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl min-h-0 flex-1 flex-col gap-3 px-1 pb-2">
      {showPageHeader ? (
        <SessionPageHeader
          title="API ключи"
          actions={
            !isLoading ? (
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(sessionPillOutline, "h-9 gap-1 px-4")}
                  onClick={handleDeleteAll}
                  disabled={busy || keys.length === 0}
                >
                  <Trash2 className="size-4" />
                  Удалить все
                </Button>
                <Button
                  type="button"
                  className="h-9 gap-1 rounded-full px-4 shadow-sm"
                  onClick={() => openCreateDialog()}
                  disabled={busy}
                >
                  <Plus className="size-4" />
                  Создать ключ
                </Button>
              </div>
            ) : null
          }
        />
      ) : null}

      {isLoading ? (
        <LlmKeysTableSkeleton />
      ) : showKeysEmpty ? (
        <EmptySession
          titleName="Подключите API-ключ"
          descriptionName="Выберите провайдера или добавьте свой ключ"
          suggestions={[
            {
              title: "OpenRouter",
              description: "Один ключ для разных моделей",
              icon: <Waypoints />,
              iconClassName:
                "bg-[#E6F0FC] text-[#296BD6] dark:bg-blue-500/15 dark:text-blue-400",
              onClick: () => openCreateDialog("OpenRouter"),
            },
            {
              title: "OpenAI",
              description: "GPT и совместимые модели",
              icon: <Cpu />,
              iconClassName:
                "bg-[#E3F5E8] text-[#1A854D] dark:bg-emerald-500/15 dark:text-emerald-400",
              onClick: () => openCreateDialog("OpenAI"),
            },
            {
              title: "Свой провайдер",
              description: "Любой совместимый OpenAI API ключ",
              icon: <Plug2 />,
              iconClassName:
                "bg-[#EBEDFC] text-[#525CD1] dark:bg-indigo-500/15 dark:text-indigo-400",
              onClick: () => openCreateDialog(),
            },
          ]}
          footerAction={{
            label: "Создать с нуля",
            onClick: () => openCreateDialog(),
            icon: <Plus className="size-4" />,
          }}
        />
      ) : (
        <>
          <div className="relative w-full max-w-64 px-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(sessionField, "pl-10")}
            />
          </div>

          <div className={cn(sessionSurface, "overflow-x-auto p-1")}>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className={cn(thClass, "!pl-0")}>
                  <SortHeader 
                  active={sorting === "name"}
                  order={ordering}
                  onClick={() => toggleSort("name")}
                  label="Название"/>
                </th>
                <th className={cn(thClass, "w-full")}>Ключ</th>
                <th className={thClass}>Кто создал</th>
                <th className={thClass}>
                  <SortHeader
                  active={sorting === "created"}
                  order={ordering}
                  onClick={() => toggleSort('created')} 
                  label="Создан" />
                </th>
                <th className={cn(thClass, "w-12 font-light")} />
              </tr>
            </thead>
            <tbody className="divide-border divide-y [&_td]:py-2.5">
              <tr style={{ height: "3rem" }}>
                <td className={cn(tdClass, "!pl-0")}>
                  <div
                    className="flex items-center gap-3"
                    style={{ ["--max-name-length" as string]: "500px" }}
                  >
                    <p className="max-w-[var(--max-name-length)] truncate text-sm text-foreground">
                      Kono AI
                    </p>
                  </div>
                </td>
                <td className={cn(tdClass, "w-full")}>
                  <p className="text-sm text-muted-foreground">по умолчанию</p>
                </td>
                <td className={tdClass}>
                  <p className="text-sm text-foreground">{userName}</p>
                </td>
                <td className={cn(tdClass, "min-w-36")}>
                  <p className="text-sm text-muted-foreground">—</p>
                </td>
                <td className={cn(tdClass, "w-15 !pr-0")}>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      aria-label="Действия для Kono AI"
                      disabled
                      className="flex size-7 items-center justify-center rounded-full text-muted-foreground/40"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>

              {filteredKeys.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-12 text-center text-sm text-muted-foreground"
                  >
                    {keys.length === 0
                      ? "Ключей пока нет — создайте первый"
                      : "Ничего не найдено"}
                  </td>
                </tr>
              ) : (
                filteredKeys.map((key) => {
                  const title = keyTitle(key);
                  const relative = formatLastUpdated(key.createdAt);
                  const fullDate = formatFullDate(key.createdAt);

                  return (
                    <tr key={key.id} style={{ height: "3rem" }}>
                      <td className={cn(tdClass, "!pl-0")}>
                        <div
                          className="flex items-center gap-3"
                          style={{ ["--max-name-length" as string]: "500px" }}
                        >
                          <button type="button" className="min-w-0 text-left">
                            <p className="max-w-[var(--max-name-length)] cursor-pointer truncate text-sm text-foreground hover:underline">
                              {title}
                            </p>
                          </button>
                        </div>
                      </td>
                      <td className={cn(tdClass, "w-full")}>
                        <p className="text-sm text-muted-foreground">
                          {key.hint ?? "—"}
                        </p>
                      </td>
                      <td className={tdClass}>
                        <p className="text-sm text-foreground">
                          {key.createdByName}
                        </p>
                      </td>
                      <td className={cn(tdClass, "min-w-36")}>
                        {fullDate ? (
                          <SessionTooltip label={fullDate}>
                            <button type="button" className="text-left">
                              <p className="inline-block text-sm text-muted-foreground">
                                Создан {relative}
                              </p>
                            </button>
                          </SessionTooltip>
                        ) : (
                          <p className="text-sm text-muted-foreground">—</p>
                        )}
                      </td>
                      <td className={cn(tdClass, "w-15 !pr-0")}>
                        <div className="flex items-center justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              className={sessionMenuTrigger}
                              aria-label={`Действия для ${title}`}
                              disabled={busy}
                            >
                              <MoreHorizontal className="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-44 rounded-xl"
                            >
                              <DropdownMenuItem
                                onSelect={() => handleActivateKey(key.id)}
                              >
                                <Plug2 className="size-4" />
                                Использовать ключ
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => void handleDeleteKey(key)}
                              >
                                <Trash2 className="size-4" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          </div>
        </>
      )}

      <Dialog open={createOpen} onOpenChange={handleCreateOpenChange}>
        <DialogContent className="gap-5 rounded-2xl border-0 bg-background p-6 shadow-xl ring-1 ring-border/40 sm:max-w-md">
          <DialogHeader className="gap-1.5 text-left">
            <DialogTitle className="text-xl font-medium">
              Создать API ключ
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              Ключ сохранится в аккаунте. После создания виден только маской.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="llm-create-label"
                className="text-xs text-muted-foreground"
              >
                Название
              </Label>
              <Input
                id="llm-create-label"
                placeholder="OpenRouter, OpenAI…"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                disabled={busy}
                maxLength={FIELD_LIMITS.llmKeyLabel}
                className={sessionField}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="llm-create-key"
                className="text-xs text-muted-foreground"
              >
                API ключ
              </Label>
              <Input
                id="llm-create-key"
                type="password"
                autoComplete="off"
                placeholder="apiKey-…"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={busy}
                showCharCount={false}
                className={sessionField}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className={sessionPillOutline}
              onClick={() => handleCreateOpenChange(false)}
              disabled={busy}
            >
              Отмена
            </Button>
            <Button
              type="button"
              className="rounded-full px-5"
              onClick={handleCreate}
              disabled={busy || apiKey.trim().length < 8}
            >
              {createMutation.isPending ? "Создание…" : "Создать"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LlmKeysPage;
