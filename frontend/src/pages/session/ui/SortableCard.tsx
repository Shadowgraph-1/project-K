import { useState } from "react";

import { Grip, MoreVertical, PencilLine, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useWorkspaceStore } from "@/entities/workspace/model/useWorkspaceStore";
import { SortableItem} from "@/shared/sortable";
import { useSessionTasks } from "@/entities/task/model/useSessionTasks";

import { STATUS_CONFIG } from "../model/sessionConstants";


type Workspace = {
  id: string;
  title: string;
  hint: string;
};

type SortableCardProps = {
  item: Workspace;
  index: number;
};

function getWorkspaceStatus(lastSessionDate: Date | null) {
  if (!lastSessionDate) return "new";
  const diffDays =
    (Date.now() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < 2) return "active";
  if (diffDays < 7) return "pause";
  return "abandoned";
}


function SortableCard({ item, index }: SortableCardProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const removeWorkspace = useWorkspaceStore((state) => state.removeWorkspace);
    const renameWorkspaces = useWorkspaceStore((state) => state.renameWorkspaces);
  
    const allTasks = useSessionTasks((state) => state.tasks);
    const tasks = allTasks.filter((t) => t.workspaceId === item.id);
    const completed = tasks.filter((t) => t.done).length;
    const total = tasks.length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(item.title);
  
    const status = getWorkspaceStatus(null);
    const statusCfg = STATUS_CONFIG[status];
  
    function handleRename() {
      if (value.trim()) renameWorkspaces(item.id, value.trim());
      setEditing(false);
    }
  
    function handleDelete() {
      removeWorkspace(item.id);
      if (location.pathname === `/session/workspace/${item.id}`) {
        navigate("/session");
      }
    }
  
  
  
    return (
      <SortableItem id={item.id} index={index}>
        {({ ref, handleRef }) => (
          <li
            ref={ref}
            className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {editing ? (
                  <input
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleRename}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename();
                      if (e.key === "Escape") {
                        setValue(item.title);
                        setEditing(false);
                      }
                    }}
                    className="w-full bg-transparent text-sm font-medium text-foreground outline-none border-b border-border"
                  />
                ) : (
                  <p
                    onDoubleClick={() => {
                      setValue(item.title);
                      setEditing(true);
                    }}
                    className="cursor-text truncate text-sm font-medium text-foreground"
                    title="Двойной клик для переименования"
                  >
                    {item.title}
                  </p>
                )}
                <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground/60">
                  {item.id}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className={`size-1.5 rounded-full ${statusCfg.dot}`} />
                  <span className={`text-[11px] font-medium ${statusCfg.text}`}>
                    {statusCfg.label}
                  </span>
                </div>
              </div>
  
              <div className="flex shrink-0 items-center gap-0.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums ${
                    pct > 0
                      ? "bg-green-50 text-green-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {pct}%
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0 text-muted-foreground"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Действия с рабочей областью"
                    >
                      <MoreVertical className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onSelect={() => {
                        setValue(item.title);
                        setEditing(true);
                      }}
                    >
                      <PencilLine />
                      Переименовать
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={handleDelete}
                    >
                      <Trash2 />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  ref={handleRef}
                  type="button"
                  aria-label="Перетащить карточку"
                  className="inline-flex size-7 items-center justify-center rounded text-muted-foreground cursor-grab hover:bg-muted active:cursor-grabbing"
                >
                  <Grip size={14} />
                </button>
              </div>
            </div>
  
            {item.hint?.trim() ? (
              <p className="text-xs leading-snug text-muted-foreground">
                {item.hint.trim()}
              </p>
            ) : null}
  
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { label: "Готово", value: completed },
                  {
                    label: "Осталось",
                    value: total - completed,
                  },
                  { label: "Время", value: 123 },
                ] as const
              ).map(({ label, value }) => (
                <div key={label} className="rounded-lg bg-muted/50 px-2.5 py-2">
                  <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                    {value}
                  </p>
                </div>
              ))}
            </div>
  
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Прогресс задач</span>
                <span className="tabular-nums">
                  {completed} / {total}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground/60">
                {123}
              </p>
            </div>
  
            <Button
              variant="outline"
              size="sm"
              className="mt-1 w-full"
              onClick={() => navigate(`/session/workspace/${item.id}`)}
            >
              Открыть
            </Button>
          </li>
        )}
      </SortableItem>
    );
  }


export default SortableCard;