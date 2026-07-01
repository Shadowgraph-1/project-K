import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";

import {
  searchUsersForInviteOnApi,
  sendWorkspaceInviteOnApi,
  type UserSearchDto,
} from "@/api/workspaces/members";
import { notify } from "@/shared/lib/notify";
import { Button } from "@/shared/ui/button";
import { KonoLoader } from "@/shared/ui/kono-loader";
import { Spinner } from "@/shared/ui/spinner";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

const PAGE_SIZE = 30;
const SEARCH_DEBOUNCE_MS = 300;

function apiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error) && typeof error.response?.data?.error === "string") {
    return error.response.data.error;
  }
  return fallback;
}

type InviteMemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  workspaceTitle?: string;
  onInvited?: () => void;
};

export function InviteMemberDialog({
  open,
  onOpenChange,
  workspaceId,
  workspaceTitle,
  onInvited,
}: InviteMemberDialogProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sendingUserId, setSendingUserId] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<UserSearchDto[]>([]);
  const [nextOffset, setNextOffset] = useState<number | null>(null);

  const listRef = useRef<HTMLUListElement>(null);
  const fetchGenerationRef = useRef(0);

  const resetList = useCallback(() => {
    setCandidates([]);
    setNextOffset(null);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      resetList();
      setSendingUserId(null);
      setLoading(false);
      setLoadingMore(false);
    }
  }, [open, resetList]);

  useEffect(() => {
    if (!open || !workspaceId) return;

    const generation = ++fetchGenerationRef.current;
    const trimmed = query.trim();
    const debounceMs = trimmed.length > 0 ? SEARCH_DEBOUNCE_MS : 0;

    const timer = setTimeout(() => {
      setLoading(true);
      resetList();

      void searchUsersForInviteOnApi(workspaceId, {
        q: trimmed,
        limit: PAGE_SIZE,
        offset: 0,
      })
        .then((page) => {
          if (fetchGenerationRef.current !== generation) return;
          setCandidates(page.items);
          setNextOffset(page.nextOffset);
        })
        .catch(() => {
          if (fetchGenerationRef.current !== generation) return;
          setCandidates([]);
          setNextOffset(null);
        })
        .finally(() => {
          if (fetchGenerationRef.current === generation) {
            setLoading(false);
          }
        });
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [open, workspaceId, query, resetList]);

  const loadMore = useCallback(async () => {
    if (nextOffset == null || loadingMore || loading) return;

    setLoadingMore(true);
    const generation = fetchGenerationRef.current;

    try {
      const page = await searchUsersForInviteOnApi(workspaceId, {
        q: query.trim(),
        limit: PAGE_SIZE,
        offset: nextOffset,
      });
      if (fetchGenerationRef.current !== generation) return;

      setCandidates((prev) => {
        const seen = new Set(prev.map((u) => u.id));
        const merged = [...prev];
        for (const user of page.items) {
          if (!seen.has(user.id)) merged.push(user);
        }
        return merged;
      });
      setNextOffset(page.nextOffset);
    } catch {
      // keep current list
    } finally {
      if (fetchGenerationRef.current === generation) {
        setLoadingMore(false);
      }
    }
  }, [workspaceId, query, nextOffset, loadingMore, loading]);

  function handleListScroll() {
    const el = listRef.current;
    if (!el || nextOffset == null) return;

    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 48;
    if (nearBottom) void loadMore();
  }

  async function handleSendInvite(user: UserSearchDto) {
    setSendingUserId(user.id);
    try {
      await sendWorkspaceInviteOnApi(workspaceId, user.id);
      notify({
        title: "Приглашение отправлено",
        description: `${user.name} получит уведомление`,
        variant: "success",
      });
      setCandidates((prev) => prev.filter((item) => item.id !== user.id));
      onInvited?.();
    } catch (error) {
      notify({
        title: apiErrorMessage(error, "Не удалось отправить приглашение"),
        variant: "error",
      });
    } finally {
      setSendingUserId(null);
    }
  }

  const showEmpty =
    !loading && candidates.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить участника</DialogTitle>
          <DialogDescription>
            {workspaceTitle
              ? `Найдите по нику или пролистайте список для проекта «${workspaceTitle}».`
              : "Найдите по нику или пролистайте список."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по нику"
            autoComplete="off"
            autoFocus
          />

          {loading ? (
            <div className="py-8">
              <KonoLoader size="sm" hint="ищем людей" />
            </div>
          ) : showEmpty ? (
            <p className="text-xs text-muted-foreground">
              {query.trim() ? "Никого не найдено" : "Некого пригласить"}
            </p>
          ) : (
            <ul
              ref={listRef}
              className="flex max-h-64 flex-col gap-1 overflow-y-auto"
              onScroll={handleListScroll}
            >
              {candidates.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-muted/30 px-2.5 py-2 ring-1 ring-border/20"
                >
                  <span className="truncate text-sm font-medium">{user.name}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 shrink-0 gap-1 rounded-full text-xs"
                    disabled={sendingUserId === user.id}
                    onClick={() => void handleSendInvite(user)}
                  >
                    {sendingUserId === user.id ? (
                      <Spinner className="size-3" />
                    ) : (
                      <UserPlus className="size-3" />
                    )}
                    Пригласить
                  </Button>
                </li>
              ))}
              {loadingMore ? (
                <li className="flex justify-center py-3">
                  <KonoLoader size="sm" hint="ещё" />
                </li>
              ) : null}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
