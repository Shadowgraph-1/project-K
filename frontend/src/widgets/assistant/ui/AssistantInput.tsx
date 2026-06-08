import { ArrowUp, Boxes, ChevronDown, ListChecks, Paperclip } from "lucide-react";

import { Button, buttonVariants } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { cn } from "@/shared/lib/utils";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type AssistantInputProps = {
  className?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  withTasks?: boolean;
  onToggleTasks?: () => void;
};

function AssistantInput({
  className,
  placeholder = "Спросите ассистента",
  value,
  onChange,
  onSend,
  withTasks = false,
  onToggleTasks,
}: AssistantInputProps) {
  const trySend = () => {
    if (!value.trim()) return;
    onSend();
  };

  return (
    <div className={cn("relative mx-auto w-full max-w-[700px]", className)}>
      <div className="flex flex-col gap-1.5">
        <div className="relative ">
          <div className="relative pb-1 pt-0">
            <div className="chat-composer-card overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <form
                className="relative flex flex-col"
                onSubmit={(e) => {
                  e.preventDefault();
                  trySend();
                }}
              >
                {withTasks ? (
                  <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-3 py-2">
                    <ListChecks
                      className="size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 text-xs text-muted-foreground">
                      Учитываются задачи проекта
                    </span>
                    {onToggleTasks ? (
                      <button
                        type="button"
                        onClick={onToggleTasks}
                        className="shrink-0 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                      >
                        Отключить
                      </button>
                    ) : null}
                  </div>
                ) : null}
                <div className="px-3 pt-2.5 pb-1">
                  <Textarea
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      if (e.shiftKey) return;
                      e.preventDefault();
                      trySend();
                    }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={3}
                    placeholder={placeholder}
                    className={cn(
                      "min-h-10 w-full resize-none border-0 bg-transparent text-xs shadow-none",
                      "placeholder:text-muted-foreground",
                      "focus-visible:ring-0",
                    )}
                  />
                </div>
                <div className="flex h-[42px] shrink-0 items-center gap-2 border-border/70 px-3">
                  <div className="flex items-center gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-full text-muted-foreground"
                      aria-label="Добавить файлы"
                      title="Добавить файлы"
                    >
                      <Paperclip />
                    </Button>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "sm" }),
                            "h-7 gap-1 rounded-md px-2 text-xs font-medium",
                            withTasks
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground",
                          )}
                          aria-label="Возможности"
                          title="Что учитывать в ответе"
                        >
                          <Boxes className="size-3.5 shrink-0" aria-hidden />
                          <span>Возможности</span>
                          <ChevronDown
                            className="size-3 shrink-0 opacity-70"
                            aria-hidden
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48" align="start">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Возможности</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem
                              checked={withTasks}
                              onCheckedChange={() => {
                                onToggleTasks?.();
                              }}
                            >
                              <ListChecks
                                className="size-4 text-muted-foreground"
                                aria-hidden
                              />
                              Задачи
                            </DropdownMenuCheckboxItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1" />
                  <Button
                    type="submit"
                    size="icon-sm"
                    variant="default"
                    className="shrink-0 rounded-full"
                    aria-label="Отправить"
                    title="Отправить"
                  >
                    <ArrowUp />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssistantInput;
