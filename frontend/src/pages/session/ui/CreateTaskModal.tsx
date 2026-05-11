import { useState } from "react";
import { CalendarDays, ClipboardList, User } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import type { Tasks } from "@/entities/task/model/useSessionTasks";
import { cn } from "@/shared/lib/utils";

const TAG_OPTIONS = ["Срочно", "Работа", "Фокус", "Личное", "Быстрый"] as const;

export type CreateTaskPayload = {
  title: string;
  description: string;
  tags?: Tasks["tags"];
  startDate?: string;
  dueDate?: string;
  creator?: string;
};

type CreateTaskModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCreator?: string;
  onSubmit: (payload: CreateTaskPayload) => void;
};

export function CreateTaskModal({
  open,
  onOpenChange,
  defaultCreator = "",
  onSubmit,
}: CreateTaskModalProps) {
  const [tag, setTag] = useState<Tasks["tags"] | undefined>();
  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [creator, setCreator] = useState(() => defaultCreator.trim());

  function resetFields() {
    setTag(undefined);
    setInput("");
    setDescription("");
    setStartDate("");
    setDueDate("");
    setCreator("");
  }

  function handleDialogOpenChange(next: boolean) {
    if (!next) resetFields();
    onOpenChange(next);
  }

  function handleAdd() {
    if (!input.trim()) return;
    onSubmit({
      title: input.trim(),
      description: description.trim(),
      tags: tag,
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
      creator: creator || undefined,
    });
    resetFields();
    onOpenChange(false);
  }

  function toggleTag(t: (typeof TAG_OPTIONS)[number]) {
    setTag((prev) => (prev === t ? undefined : t));
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        className="gap-0 overflow-hidden border-0 p-0 shadow-2xl ring-1 ring-border/60 sm:max-w-[440px]"
        showCloseButton
      >

        <div className="relative space-y-4 px-5 pb-1 pt-4 pr-12">
          <DialogHeader className="space-y-1 text-left">
            <div className="flex gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner ring-1 ring-primary/15">
                <ClipboardList className="size-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 space-y-1 pt-0.5">
                <DialogTitle className="text-lg tracking-tight">
                  Новая задача
                </DialogTitle>
                <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
                  Название обязательно — остальное по желанию.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Название
              </span>
              <Input
                autoFocus
                placeholder="Что нужно сделать?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
                className="h-10 rounded-xl border-border/80 bg-muted/30 px-3 text-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:bg-background focus-visible:ring-2"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Описание
              </span>
              <Textarea
                placeholder="Детали, контекст, ссылки…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="field-sizing-fixed min-h-[52px] resize-none rounded-xl border-border/80 bg-muted/30 px-3 py-2.5 text-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:bg-background focus-visible:ring-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Начало
                </span>
                <span className="flex h-10 items-center gap-2 rounded-xl border border-border/80 bg-muted/30 px-3 transition-colors focus-within:border-ring focus-within:bg-background focus-within:ring-2 focus-within:ring-ring/40">
                  <CalendarDays
                    className="size-4 shrink-0 text-muted-foreground/70"
                    aria-hidden
                  />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="min-w-0 flex-1 cursor-pointer bg-transparent text-xs text-foreground outline-none scheme-light dark:scheme-dark"
                  />
                </span>
              </label>
              <label className="space-y-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Конец
                </span>
                <span className="flex h-10 items-center gap-2 rounded-xl border border-border/80 bg-muted/30 px-3 transition-colors focus-within:border-ring focus-within:bg-background focus-within:ring-2 focus-within:ring-ring/40">
                  <CalendarDays
                    className="size-4 shrink-0 text-muted-foreground/70"
                    aria-hidden
                  />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="min-w-0 flex-1 cursor-pointer bg-transparent text-xs text-foreground outline-none scheme-light dark:scheme-dark"
                  />
                </span>
              </label>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Создатель
              </span>
              <span className="flex h-10 items-center gap-2 rounded-xl border border-border/80 bg-muted/30 px-3 transition-colors focus-within:border-ring focus-within:bg-background focus-within:ring-2 focus-within:ring-ring/40">
                <User
                  className="size-4 shrink-0 text-muted-foreground/70"
                  aria-hidden
                />
                <input
                  type="text"
                  placeholder="Имя или ник"
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                />
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Тег
              </span>
              <div className="flex flex-wrap gap-1.5">
                {TAG_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[11px] font-medium transition-all active:scale-[0.98]",
                      tag === t
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border/70 bg-background/80 text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border/50 bg-muted/25 px-5 py-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 rounded-lg text-muted-foreground"
            onClick={() => handleDialogOpenChange(false)}
          >
            Отмена
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-9 rounded-lg px-5 shadow-sm"
            disabled={!input.trim()}
            onClick={handleAdd}
          >
            Добавить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
