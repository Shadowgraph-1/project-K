import { useState } from "react";
import { ChevronRight, Plus, Trash2 } from "lucide-react";

import type { Subtask } from "@/api/subtasks";
import type { SubtaskStatus } from "@/api/subtasks";
import { Button } from "@/shared/ui/button";
import { KonoLoader } from "@/shared/ui/kono-loader";
import { cn } from "@/shared/lib/utils";
import DialogUpdateTask from "../DialogUpdateTask";
import { SubtaskStatusDropdown } from "../SubtaskStatusDropdown";
import {
  taskDetailIconBtn,
  taskDetailSectionHeader,
  taskDetailSectionLabel,
  taskDetailSubtaskRow,
} from "./task-details-ui";

type TaskSubtaskSectionProps = {
  subtasks: Subtask[];
  loading: boolean;
  onCreate: (title: string) => void | Promise<void>;
  onStatusChange: (id: string, status: SubtaskStatus) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
};

function countDone(subtasks: Subtask[]) {
  return subtasks.filter((s) => s.status === "DONE").length;
}

export function TaskSubtaskSection({
  subtasks,
  loading,
  onCreate,
  onStatusChange,
  onDelete,
}: TaskSubtaskSectionProps) {
  const [expanded, setExpanded] = useState(true);
  const doneCount = countDone(subtasks);

  const addTrigger = (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={taskDetailIconBtn}
      aria-label="Добавить подзадачу"
    >
      <Plus className="size-3.5" />
    </Button>
  );

  return (
    <section>
      <div className={taskDetailSectionHeader}>
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md py-0.5 pr-1 text-left transition-colors hover:text-foreground"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            <ChevronRight
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-transform",
                expanded && "rotate-90",
              )}
              aria-hidden
            />
            <span className={taskDetailSectionLabel}>Подзадачи</span>
          </button>
          {subtasks.length > 0 ? (
            <span className="text-[13px] tabular-nums text-muted-foreground">
              {doneCount}/{subtasks.length}
            </span>
          ) : null}
        </div>
        <DialogUpdateTask trigger={addTrigger} onSubmit={onCreate} />
      </div>

      {expanded ? (
        loading ? (
          <div className="py-4 pl-5">
            <KonoLoader size="sm" hint="подзадачи" />
          </div>
        ) : subtasks.length === 0 ? (
          <p className="py-2 pl-5 text-[13px] text-muted-foreground/50">
            Нет подзадач
          </p>
        ) : (
          <ul className="flex flex-col pl-5">
            {subtasks.map((subtask) => (
              <li key={subtask.id}>
                <div className={taskDetailSubtaskRow}>
                  <SubtaskStatusDropdown
                    status={subtask.status}
                    iconOnly
                    onChange={(next) => void onStatusChange(subtask.id, next)}
                  />
                  <span className="min-w-0 flex-1 truncate text-[13px] leading-5 text-foreground">
                    {subtask.title}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className={cn(
                      taskDetailIconBtn,
                      "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
                    )}
                    aria-label="Удалить подзадачу"
                    onClick={() => void onDelete(subtask.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </section>
  );
}
