import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  ListTodo,
  PanelLeft,
  Plus,
  Search,
  SquareMousePointer,
} from "lucide-react";

import { useAgentMode } from "@/pages/session/model/AgentModeContext";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import {
  SESSION_SHORTCUTS,
  dispatchSessionCreateTask,
} from "@/shared/config/session-shortcuts";
import { useSidebar } from "@/shared/ui/sidebar";
import { useSearchQuery } from "@/entities/search/model/use-search-query";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/shared/ui/command";
import { cn } from "@/shared/lib/utils";
import { Kbd, KbdGroup } from "@/shared/ui/kbd";
import { Spinner } from "@/shared/ui/spinner";


type Props = {
  className?: string;
  focused: boolean;
  onFocusChange: (open: boolean) => void;
};

const COMMAND_ICONS = {
  search: Search,
  sidebar: PanelLeft,
  "new-task": Plus,
  agent: SquareMousePointer,
} as const;

export function SearchBar({ className, focused, onFocusChange }: Props) {
  const navigate = useNavigate();
  const { toggle: toggleAgentMode } = useAgentMode();
  const { toggleSidebar } = useSidebar();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setQuery("");
        setDebouncedQuery("");
      }
      onFocusChange(open);
    },
    [onFocusChange],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  const { data, isFetching, isFetched } = useSearchQuery(debouncedQuery, focused);

  const goWorkspace = (publicKey: string) => {
    handleOpenChange(false);
    navigate(SESSION_PATHS.workspace(publicKey));
  };

  const goTask = (publicKey: string, taskId: string) => {
    handleOpenChange(false);
    navigate(SESSION_PATHS.workspaceTask(publicKey, taskId));
  };

  const showShortcuts = query.trim().length < 2;
  const canSearch = debouncedQuery.length >= 2;
  const hasResults =
    (data?.workspaces.length ?? 0) > 0 || (data?.tasks.length ?? 0) > 0;

  const runCommand = (id: string) => {
    switch (id) {
      case "agent":
        toggleAgentMode();
        handleOpenChange(false);
        break;
      case "sidebar":
        toggleSidebar();
        handleOpenChange(false);
        break;
      case "new-task":
        dispatchSessionCreateTask();
        handleOpenChange(false);
        break;
      case "search":
      default:
        break;
    }
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          "flex h-8 w-auto min-w-[13rem] max-w-88 shrink-0 items-center gap-2 rounded-lg bg-muted/50 px-2.5 text-left ring-1 ring-border/35 transition-colors hover:bg-muted/70",
          className,
        )}
        onClick={() => onFocusChange(true)}
        aria-label="Открыть поиск"
      >
        <Search
          className="size-3.5 shrink-0 text-muted-foreground/80"
          aria-hidden
        />
        <span className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground/75">
          Поиск...
        </span>
        <KbdGroup className="hidden shrink-0 sm:inline-flex">
          <Kbd>Ctrl + K</Kbd>
        </KbdGroup>
      </button>

      <CommandDialog
        open={focused}
        onOpenChange={handleOpenChange}
        title="Поиск"
        description="Поиск проектов и задач"
        className="max-w-lg"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Поиск проектов и задач..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {showShortcuts ? (
              <CommandGroup heading="Команды">
                {SESSION_SHORTCUTS.map((shortcut) => {
                  const Icon =
                    COMMAND_ICONS[
                      shortcut.id as keyof typeof COMMAND_ICONS
                    ] ?? Search;

                  return (
                    <CommandItem
                      key={shortcut.id}
                      value={`${shortcut.label} ${shortcut.keys.join(" ")}`}
                      onSelect={() => runCommand(shortcut.id)}
                    >
                      <Icon className="opacity-60" />
                      <span>{shortcut.label}</span>
                      <CommandShortcut>{shortcut.keys[0]}</CommandShortcut>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}

            {canSearch && isFetching ? (
              <CommandEmpty className="flex items-center justify-center">
                <Spinner className="size-4 text-muted-foreground" />
              </CommandEmpty>
            ) : null}

            {canSearch && !isFetching && isFetched && !hasResults ? (
              <CommandEmpty>Ничего не найдено</CommandEmpty>
            ) : null}

            {canSearch && data?.workspaces.length ? (
              <CommandGroup heading="Проекты">
                {data.workspaces.map((workspace) => (
                  <CommandItem
                    key={workspace.id}
                    value={`workspace-${workspace.id}-${workspace.name}`}
                    onSelect={() => goWorkspace(workspace.publicKey)}
                  >
                    <FolderKanban className="opacity-60" />
                    <span className="min-w-0 flex-1 truncate">
                      {workspace.name}
                    </span>
                    <CommandShortcut>{workspace.publicKey}</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}

            {canSearch && data?.workspaces.length && data?.tasks.length ? (
              <CommandSeparator />
            ) : null}

            {canSearch && data?.tasks.length ? (
              <CommandGroup heading="Задачи">
                {data.tasks.map((task) => (
                  <CommandItem
                    key={task.id}
                    value={`task-${task.id}-${task.title}`}
                    onSelect={() => goTask(task.workspacePublicKey, task.id)}
                  >
                    <ListTodo className="opacity-60" />
                    <span className="min-w-0 flex-1 truncate">{task.title}</span>
                    <CommandShortcut>{task.workspaceName}</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
