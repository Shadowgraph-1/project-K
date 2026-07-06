import { useCallback, useEffect, useReducer, useRef } from "react";
import { UserPlus } from "lucide-react";

import {
  searchUsersForInviteOnApi,
  sendWorkspaceInviteOnApi,
  type UserSearchDto,
} from "@/api/workspaces/members";
import { getApiErrorMessage } from "@/shared/lib/api-error-message";
import { notify } from "@/shared/lib/notify";
import { InviteUserListSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";
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
  return getApiErrorMessage(error, fallback);
}

type InviteDialogState = {
  query: string;
  loading: boolean;
  loadingMore: boolean;
  sendingUserId: number | null;
  candidates: UserSearchDto[];
};

const initialInviteDialogState: InviteDialogState = {
  query: "",
  loading: false,
  loadingMore: false,
  sendingUserId: null,
  candidates: [],
};

type InviteDialogAction =
  | { type: "reset" }
  | { type: "setQuery"; query: string }
  | { type: "searchStart" }
  | { type: "searchSuccess"; candidates: UserSearchDto[] }
  | { type: "searchFailure" }
  | { type: "searchFinish" }
  | { type: "loadMoreStart" }
  | { type: "loadMoreSuccess"; candidates: UserSearchDto[]; nextOffset: number | null }
  | { type: "loadMoreFinish" }
  | { type: "sendStart"; userId: number }
  | { type: "sendFinish" }
  | { type: "removeCandidate"; userId: number };

function inviteDialogReducer(
  state: InviteDialogState,
  action: InviteDialogAction,
): InviteDialogState {
  switch (action.type) {
    case "reset":
      return initialInviteDialogState;
    case "setQuery":
      return { ...state, query: action.query };
    case "searchStart":
      return {
        ...state,
        loading: true,
        candidates: [],
      };
    case "searchSuccess":
      return { ...state, candidates: action.candidates };
    case "searchFailure":
      return { ...state, candidates: [] };
    case "searchFinish":
      return { ...state, loading: false };
    case "loadMoreStart":
      return { ...state, loadingMore: true };
    case "loadMoreSuccess":
      return {
        ...state,
        candidates: action.candidates,
        loadingMore: false,
      };
    case "loadMoreFinish":
      return { ...state, loadingMore: false };
    case "sendStart":
      return { ...state, sendingUserId: action.userId };
    case "sendFinish":
      return { ...state, sendingUserId: null };
    case "removeCandidate":
      return {
        ...state,
        candidates: state.candidates.filter((item) => item.id !== action.userId),
      };
    default:
      return state;
  }
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
  const [state, dispatch] = useReducer(
    inviteDialogReducer,
    initialInviteDialogState,
  );

  const listRef = useRef<HTMLUListElement>(null);
  const fetchGenerationRef = useRef(0);
  const nextOffsetRef = useRef<number | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      dispatch({ type: "reset" });
      nextOffsetRef.current = null;
    }
    onOpenChange(nextOpen);
  }

  useEffect(() => {
    if (!open || !workspaceId) return;

    const generation = ++fetchGenerationRef.current;
    const trimmed = state.query.trim();
    const debounceMs = trimmed.length > 0 ? SEARCH_DEBOUNCE_MS : 0;

    const timer = setTimeout(() => {
      dispatch({ type: "searchStart" });
      nextOffsetRef.current = null;

      void searchUsersForInviteOnApi(workspaceId, {
        q: trimmed,
        limit: PAGE_SIZE,
        offset: 0,
      })
        .then((page) => {
          if (fetchGenerationRef.current !== generation) return;
          dispatch({ type: "searchSuccess", candidates: page.items });
          nextOffsetRef.current = page.nextOffset;
        })
        .catch(() => {
          if (fetchGenerationRef.current !== generation) return;
          dispatch({ type: "searchFailure" });
          nextOffsetRef.current = null;
        })
        .finally(() => {
          if (fetchGenerationRef.current === generation) {
            dispatch({ type: "searchFinish" });
          }
        });
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [open, workspaceId, state.query]);

  const loadMore = useCallback(async () => {
    const nextOffset = nextOffsetRef.current;
    if (nextOffset == null || state.loadingMore || state.loading) return;

    dispatch({ type: "loadMoreStart" });
    const generation = fetchGenerationRef.current;

    try {
      const page = await searchUsersForInviteOnApi(workspaceId, {
        q: state.query.trim(),
        limit: PAGE_SIZE,
        offset: nextOffset,
      });
      if (fetchGenerationRef.current !== generation) return;

      dispatch({
        type: "loadMoreSuccess",
        candidates: (() => {
          const seen = new Set(state.candidates.map((user) => user.id));
          const merged = [...state.candidates];
          for (const user of page.items) {
            if (!seen.has(user.id)) merged.push(user);
          }
          return merged;
        })(),
        nextOffset: page.nextOffset,
      });
      nextOffsetRef.current = page.nextOffset;
    } catch {
      dispatch({ type: "loadMoreFinish" });
    }
  }, [workspaceId, state.query, state.loadingMore, state.loading, state.candidates]);

  function handleListScroll() {
    const el = listRef.current;
    if (!el || nextOffsetRef.current == null) return;

    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 48;
    if (nearBottom) void loadMore();
  }

  async function handleSendInvite(user: UserSearchDto) {
    dispatch({ type: "sendStart", userId: user.id });
    try {
      await sendWorkspaceInviteOnApi(workspaceId, user.id);
      notify({
        title: "Приглашение отправлено",
        description: `${user.name} получит уведомление`,
        variant: "success",
      });
      dispatch({ type: "removeCandidate", userId: user.id });
      onInvited?.();
    } catch (error) {
      notify({
        title: apiErrorMessage(error, "Не удалось отправить приглашение"),
        variant: "error",
      });
    } finally {
      dispatch({ type: "sendFinish" });
    }
  }

  const showEmpty = !state.loading && state.candidates.length === 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            value={state.query}
            onChange={(e) =>
              dispatch({ type: "setQuery", query: e.target.value })
            }
            placeholder="Поиск по нику"
            autoComplete="off"
            autoFocus
          />

          {state.loading ? (
            <InviteUserListSkeleton />
          ) : showEmpty ? (
            <p className="text-xs text-muted-foreground">
              {state.query.trim() ? "Никого не найдено" : "Некого пригласить"}
            </p>
          ) : (
            <ul
              ref={listRef}
              className="flex max-h-64 flex-col gap-1 overflow-y-auto"
              onScroll={handleListScroll}
            >
              {state.candidates.map((user) => (
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
                    disabled={state.sendingUserId === user.id}
                    onClick={() => void handleSendInvite(user)}
                  >
                    {state.sendingUserId === user.id ? (
                      <Spinner className="size-3" />
                    ) : (
                      <UserPlus className="size-3" />
                    )}
                    Пригласить
                  </Button>
                </li>
              ))}
              {state.loadingMore ? (
                <li className="px-2.5 py-2">
                  <Skeleton className="h-10 w-full rounded-xl" />
                </li>
              ) : null}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
