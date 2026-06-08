import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
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
import { Button, buttonVariants } from "@/shared/ui/button";
import {
  TASK_STATUSES,
  type TaskStatus,
} from "@/entities/task/model/useSessionTasks";

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

function TaskStatusIcon({ status }: { status: TaskStatus }) {
  switch (status) {
    case "Выполнено":
      return <CheckCircle2 className="size-4 text-emerald-500" />;
    case "Отложено":
      return <PauseCircle className="size-4 text-amber-500" />;
    case "Issues":
      return <CircleAlert className="size-4 text-red-500" />;
    case "В очереди":
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
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {count > 0 ? (
        <motion.div
          key="task-selection-bar"
          role="toolbar"
          aria-label="Выбранные задачи"
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "pointer-events-auto fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
            "flex h-9 items-center gap-1 rounded-lg border border-border/70 bg-background px-1.5 shadow-md ring-1 ring-black/5 dark:ring-white/10",
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
                <DropdownMenuTrigger
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon-sm" }),
                    "size-7 rounded-md text-muted-foreground",
                  )}
                  aria-label="Действия с выбранными"
                  title="Действия с выбранными"
                >
                  <Settings2 className="size-3.5" />
                </DropdownMenuTrigger>
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
                              {status}
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

          <Button
            type="button"
            aria-label="Снять выделение"
            onClick={onClear}
            variant="ghost"
            size="icon-sm"
            className="size-7 rounded-md text-muted-foreground"
          >
            <X className="size-3.5" />
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
