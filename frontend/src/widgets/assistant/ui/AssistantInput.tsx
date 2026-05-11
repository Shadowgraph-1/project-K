import { ArrowUp, History, Paperclip, Plus, X } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui/tooltip";

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
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  withTasks?: boolean;
  onToggleTasks?: () => void;
  onToggleHistory?: () => void;
};

function AssistantInput({
  className,
  name,
  placeholder = `Спросите у ${name}`,
  value,
  onChange,
  onSend,
  withTasks = false,
  onToggleTasks,
  onToggleHistory,

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
                <div className="flex h-[42px] shrink-0 items-center gap-3 border-border/70 px-3">
                  <div className="flex items-center gap-0.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground rounded-full"
                          aria-label="Добавить файлы"
                        >
                          <Paperclip />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={6}>
                        Добавить файлы
                      </TooltipContent>
                    </Tooltip>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground rounded-full"
                                aria-label="Контекст"
                              >
                                <Plus />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40">
                              <DropdownMenuGroup>
                                <DropdownMenuLabel>Контекст</DropdownMenuLabel>
                                <DropdownMenuCheckboxItem
                                  checked={withTasks}
                                  onCheckedChange={() => {
                                    onToggleTasks?.();
                                  }}
                                >
                                  Задачи
                                </DropdownMenuCheckboxItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={6}>
                          Контекст
                        </TooltipContent>
                      </Tooltip>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground rounded-full"
                          aria-label="История"
                          onClick={() => onToggleHistory?.()}
                        >
                          <History />
                        </Button>
                      </div>
                      {withTasks && onToggleTasks ? (
                        <div className="inline-flex h-7 items-center gap-1 rounded-full border border-border bg-muted px-2 text-xs font-medium text-foreground">
                          Задачи
                          <button
                            type="button"
                            onClick={onToggleTasks}
                            className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                            aria-label="Убрать задачи из контекста"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        size="icon-sm"
                        variant="default"
                        className="shrink-0 rounded-full"
                        aria-label="Отправить"
                      >
                        <ArrowUp />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={6}>
                      Отправить
                    </TooltipContent>
                  </Tooltip>
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
