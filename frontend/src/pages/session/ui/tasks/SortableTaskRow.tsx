import {
  Grip,
  Square,
  SquareCheck,
  MoreHorizontal,
  Trash2,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { SortableItem } from "@/shared/sortable";
import type { Tasks } from "@/entities/task/model/useSessionTasks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import type { TasksView } from "./sessionWorkspaceTypes";

function TaskCreatorAvatar({ name }: { name: string }) {
  return (
    <Avatar className="size-7 shrink-0 border border-border/40">
      <AvatarImage
        src="https://github.com/shadcn.png"
        alt={name}
        className="grayscale"
      />
      <AvatarFallback className="text-[10px] font-medium">
        {name}
      </AvatarFallback>
    </Avatar>
  );
}

export type SortableTaskRowProps = {
  task: Tasks;
  index: number;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  layout?: TasksView;
};

/** Список: макет из Figma DemoToDo (node 20:154) — карточка 62px, p-[21px], тень, чек справа */
const LINE_CARD_SHADOW =
  "shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]";

export function SortableTaskRow({
  task,
  index,
  onRemove,
  onToggle,
  layout = "line",
}: SortableTaskRowProps) {
  const isSquare = layout === "square";

  return (
    <SortableItem id={task.id} index={index}>
      {({ ref, handleRef }) => (
        <li
          ref={ref}
          className={cn(
            "border transition-colors duration-200",
            isSquare
              ? cn(
                  "group flex h-full min-h-0 flex-col gap-2 rounded-xl p-4 shadow-sm",
                  task.done
                    ? "border-border/40 bg-muted/25"
                    : "border-border/80 bg-background",
                )
              : cn(
                  "flex flex-col gap-2 rounded-2xl border-zinc-200 bg-card p-[21px] dark:border-border",
                  LINE_CARD_SHADOW,
                  "dark:shadow-sm",
                  task.done
                    ? "border-border/35 bg-muted/25"
                    : "border-zinc-200 hover:border-zinc-300 hover:bg-muted/10 dark:hover:border-border",
                ),
          )}
        >
          {isSquare ? (
            <>
              <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
                <div className="flex min-w-0 items-start gap-2">
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 transition-opacity hover:opacity-70"
                    onClick={() => onToggle(task.id)}
                  >
                    {task.done ? (
                      <SquareCheck size={18} className="text-foreground/60" />
                    ) : (
                      <Square size={18} className="text-foreground/40" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1 space-y-0.5 pr-0.5">
                    <span
                      className={cn(
                        "block text-sm font-medium leading-snug line-clamp-2",
                        task.done
                          ? "text-muted-foreground/60 line-through decoration-muted-foreground/30"
                          : "text-foreground",
                      )}
                    >
                      {task.title}
                    </span>
                    {task.description ? (
                      <span
                        className={cn(
                          "block line-clamp-2 text-[11px] leading-snug",
                          task.done
                            ? "text-muted-foreground/45"
                            : "text-muted-foreground/75",
                        )}
                      >
                        {task.description}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-1.5 pt-0.5">
                {task.tags ? (
                  <span className="rounded-full border border-border/60 bg-muted/20 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/80">
                    {task.tags}
                  </span>
                ) : null}
                {task.startDate || task.dueDate ? (
                  <span className="flex items-center gap-1 rounded-md border border-border/50 bg-muted/15 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    <CalendarDays size={10} />
                    {task.startDate && task.dueDate
                      ? `${task.startDate} → ${task.dueDate}`
                      : (task.dueDate ?? task.startDate)}
                  </span>
                ) : null}
              </div>

              <div className="mt-auto flex w-full min-w-0 shrink-0 items-center justify-between gap-2 border-t border-border/40 pt-2">
                <div className="min-w-0 flex-1">
                  {task.creator ? (
                    <TaskCreatorAvatar name={task.creator} />
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:bg-transparent hover:text-foreground"
                      >
                        <MoreHorizontal className="size-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-32">
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer text-xs"
                        onSelect={() => onRemove(task.id)}
                      >
                        <Trash2 className="size-3.5" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    ref={handleRef}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 cursor-grab text-muted-foreground hover:bg-transparent hover:text-foreground active:cursor-grabbing"
                  >
                    <Grip className="size-3.5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex min-w-0 flex-col gap-2">
                <div className="flex min-w-0 items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span
                      className={cn(
                        "block text-sm font-medium leading-5 tracking-tight",
                        task.done
                          ? "text-muted-foreground/60 line-through decoration-muted-foreground/30"
                          : "text-foreground",
                      )}
                    >
                      {task.title}
                    </span>
                    {task.description ? (
                      <span
                        className={cn(
                          "block text-[13px] leading-snug text-muted-foreground/75",
                          task.done && "text-muted-foreground/45",
                        )}
                      >
                        {task.description}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      type="button"
                      className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                      onClick={() => onToggle(task.id)}
                    >
                      {task.done ? (
                        <SquareCheck
                          size={20}
                          className="text-foreground/70"
                          aria-hidden
                        />
                      ) : (
                        <Square
                          size={20}
                          strokeWidth={1.75}
                          className="text-muted-foreground/70"
                          aria-hidden
                        />
                      )}
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:bg-muted/90 hover:text-foreground"
                        >
                          <MoreHorizontal className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-32">
                        <DropdownMenuItem
                          variant="destructive"
                          className="cursor-pointer text-xs"
                          onSelect={() => onRemove(task.id)}
                        >
                          <Trash2 className="size-3.5" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      ref={handleRef}
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 cursor-grab text-muted-foreground hover:bg-muted/90 hover:text-foreground active:cursor-grabbing"
                    >
                      <Grip className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {task.tags ? (
                    <span className="rounded-md bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {task.tags}
                    </span>
                  ) : null}
                  {task.creator ? (
                    <span className="inline-flex max-w-[min(100%,280px)] items-center gap-2">
                      <TaskCreatorAvatar name={task.creator} />
                      <span className="truncate text-[10px] font-medium text-muted-foreground">
                        {task.creator}
                      </span>
                    </span>
                  ) : null}
                  {task.startDate || task.dueDate ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted/40 px-2 py-0.5 text-[10px] tabular-nums text-muted-foreground">
                      <CalendarDays className="size-2.5 shrink-0 opacity-70" />
                      {task.startDate && task.dueDate
                        ? `${task.startDate} → ${task.dueDate}`
                        : (task.dueDate ?? task.startDate)}
                    </span>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </li>
      )}
    </SortableItem>
  );
}
