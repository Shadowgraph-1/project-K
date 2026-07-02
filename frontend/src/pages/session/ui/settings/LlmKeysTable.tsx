import { MoreHorizontal, Plug2, Search, Trash2 } from "lucide-react";

import type { LlmKeyItem } from "@/api/llm-settings";
import { SessionTooltip } from "@/pages/session/ui/layout/SessionTooltip";
import {
  sessionField,
  sessionMenuTrigger,
  sessionSurface,
} from "@/pages/session/lib/session-styles";
import { Input } from "@/shared/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

import {
  formatFullDate,
  formatLastUpdated,
  keyTitle,
  SortHeader,
  tdClass,
  thClass,
} from "./llm-keys-utils";

type LlmKeysTableProps = {
  userName: string;
  keys: LlmKeyItem[];
  filteredKeys: LlmKeyItem[];
  search: string;
  sorting: "name" | "created";
  ordering: "asc" | "desc";
  busy: boolean;
  onSearchChange: (value: string) => void;
  onToggleSort: (field: "name" | "created") => void;
  onActivate: (keyId: string) => void;
  onDelete: (key: LlmKeyItem) => void;
};

export function LlmKeysTable({
  userName,
  keys,
  filteredKeys,
  search,
  sorting,
  ordering,
  busy,
  onSearchChange,
  onToggleSort,
  onActivate,
  onDelete,
}: LlmKeysTableProps) {
  return (
    <>
      <div className="relative w-full max-w-64 px-1">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Поиск"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
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
                  onClick={() => onToggleSort("name")}
                  label="Название"
                />
              </th>
              <th className={cn(thClass, "w-full")}>Ключ</th>
              <th className={thClass}>Кто создал</th>
              <th className={thClass}>
                <SortHeader
                  active={sorting === "created"}
                  order={ordering}
                  onClick={() => onToggleSort("created")}
                  label="Создан"
                />
              </th>
              <th className={cn(thClass, "w-12 font-light")} aria-label="Действия" />
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
                              onSelect={() => onActivate(key.id)}
                            >
                              <Plug2 className="size-4" />
                              Использовать ключ
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={() => void onDelete(key)}
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
  );
}
