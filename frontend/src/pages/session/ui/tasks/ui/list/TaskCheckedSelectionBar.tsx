import { createPortal } from "react-dom";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "motion/react";
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  ListChecks,
  PauseCircle,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { sessionToolbarIconButton } from "@/pages/session/lib/session-styles";
import { SessionTooltip } from "@/pages/session/ui/layout/SessionTooltip";
import { Button, buttonVariants } from "@/shared/ui/button";
import { TASK_STATUSES, type TaskStatus } from "@/shared/constants/task-statuses";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { TASK_STATUS_LABELS } from "@/shared/constants/task-statuses";

type TaskCheckedSelectionBarProps = {
  count: number;
  onClear: () => void;
  onDeletedSelected?: () => void | Promise<void>;
  onStatusSelected?: (status: TaskStatus) => void | Promise<void>;
  className?: string;
};

function selectedLabel(n: number) {
  if (n === 1) return "выбран";
  return "выбрано";
}

const hiddenVariant = { opacity: 0, y: 16, scale: 0.95 };
const visibleVariant = { opacity: 1, y: 0, scale: 1 };

function TaskStatusIcon({ status }: { status: TaskStatus }) {
  switch (status) {
    case "DONE":
      return <CheckCircle2 className="size-4 text-emerald-500" />;
    case "DEFERRED":
      return <PauseCircle className="size-4 text-amber-500" />;
    case "ISSUES":
      return <CircleAlert className="size-4 text-red-500" />;
    case "TODO":
    default:
      return <Circle className="size-4 text-muted-foreground" />;
  }
}

export function TaskCheckedSelectionBar({
  count,
  onClear,
  onDeletedSelected,
  onStatusSelected,
  className,
}: TaskCheckedSelectionBarProps) {
  const prefersReducedMotion = useReducedMotion();
  if (typeof document === "undefined") return null;

  const initialVariant = prefersReducedMotion ? visibleVariant : hiddenVariant;
  const exitVariant = prefersReducedMotion ? visibleVariant : hiddenVariant;

  return createPortal(
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {count > 0 ? (
          <m.div
          key="task-selection-bar"
          role="toolbar"
          aria-label="Выбранные задачи"
          initial={initialVariant}
          animate={visibleVariant}
          exit={exitVariant}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "pointer-events-auto fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
            "flex h-9 items-center gap-1 rounded-xl bg-background/95 px-1.5 shadow-md ring-1 ring-border/35",
            className,
          )}
        >
          <div className="flex items-center gap-1.5 px-2">
            <span className="text-[13px] font-medium text-foreground">
              <span className="tabular-nums">{count}</span>{" "}
              {selectedLabel(count)}
            </span>
          </div>

          {onDeletedSelected ? (
            <>
              <div className="h-4 w-px shrink-0 bg-border/70" aria-hidden />
              <DropdownMenu>
                <SessionTooltip label="Действия с выбранными" side="top">
                  <DropdownMenuTrigger
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon-sm" }),
                      "size-7 rounded-md",
                      sessionToolbarIconButton,
                    )}
                    aria-label="Действия с выбранными"
                  >
                    <Settings2 className="size-3.5" />
                  </DropdownMenuTrigger>
                </SessionTooltip>
                <DropdownMenuContent
                  side="top"
                  align="center"
                  sideOffset={8}
                  className="w-48"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      Выбранные задачи
                    </DropdownMenuLabel>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-xs">
                        <ListChecks className="size-4" />
                        Статус
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="min-w-36">
                          {TASK_STATUSES.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              className="text-xs"
                              onSelect={() => void onStatusSelected?.(status)}
                            >
                              <TaskStatusIcon status={status} />
                              {TASK_STATUS_LABELS[status]}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="text-xs" onSelect={onClear}>
                      <X className="size-4" />
                      Снять выделение
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      className="text-xs"
                      onSelect={() => void onDeletedSelected?.()}
                    >
                      <Trash2 className="size-4" />
                      Удалить выбранные
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}

          <div className="h-4 w-px shrink-0 bg-border/70" aria-hidden />

          <SessionTooltip label="Снять выделение" side="top">
            <Button
              type="button"
              aria-label="Снять выделение"
              onClick={onClear}
              variant="ghost"
              size="icon-sm"
              className={cn(
                "size-7 rounded-md",
                sessionToolbarIconButton,
              )}
            >
              <X className="size-3.5" />
            </Button>
          </SessionTooltip>
        </m.div>
      ) : null}
    </AnimatePresence>
    </LazyMotion>,
    document.body,
  );
}
