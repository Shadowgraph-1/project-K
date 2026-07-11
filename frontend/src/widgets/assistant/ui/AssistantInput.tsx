import { ArrowUp, Paperclip } from "lucide-react";

import { McpLogo } from "@/shared/ui/icons/McpLogo";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Spinner } from "@/shared/ui/spinner";
import { cn } from "@/shared/lib/utils";
import { FIELD_LIMITS } from "@/shared/constants/field-limits";

import { AssistantMcpMenu } from "./AssistantMcpMenu";

type AssistantInputProps = {
  className?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  withMcp?: boolean;
  onToggleMcp?: () => void;
  onSetAllTools?: (enabled: boolean) => void;
  enabledCount?: number;
  totalCount?: number;
  isToolEnabled?: (toolName: string) => boolean;
  onToggleTool?: (toolName: string) => void;
  loading?: boolean;
};

function AssistantInput({
  className,
  placeholder = "Спросите ассистента",
  value,
  onChange,
  onSend,
  withMcp = true,
  onToggleMcp,
  onSetAllTools,
  enabledCount = 0,
  totalCount = 0,
  isToolEnabled,
  onToggleTool,
  loading = false,
}: AssistantInputProps) {
  const trySend = () => {
    if (!value.trim() || loading) return;
    onSend();
  };

  const mcpActive = withMcp && enabledCount > 0;

  return (
    <div className={cn("relative w-full", className)}>
      <div className="chat-composer-card relative overflow-visible rounded-xl border border-border bg-transparent">
        <form
          className="relative flex flex-col overflow-hidden rounded-xl"
          onSubmit={(e) => {
            e.preventDefault();
            trySend();
          }}
        >
          {mcpActive ? (
            <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
              <McpLogo className="size-3.5 text-foreground" />
              <span className="min-w-0 flex-1 text-xs text-muted-foreground">
                {enabledCount < totalCount
                  ? `MCP: ${enabledCount} из ${totalCount} инструментов`
                  : "Проекты, задачи, подзадачи, комментарии"}
              </span>
              {onToggleMcp ? (
                <button
                  type="button"
                  onClick={onToggleMcp}
                  className="shrink-0 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Отключить
                </button>
              ) : null}
            </div>
          ) : null}
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
            maxLength={FIELD_LIMITS.assistantMessage}
            showCharCount={false}
            placeholder={placeholder}
            disabled={loading}
            className={cn(
              "min-h-10 w-full resize-none rounded-none border-0 bg-transparent px-3 pb-1 pt-3 text-sm shadow-none dark:bg-transparent",
              !mcpActive && "rounded-t-xl",
              "placeholder:text-muted-foreground",
              "focus-visible:ring-0",
              loading && "opacity-60",
            )}
          />
          <div className="flex h-[42px] shrink-0 items-center gap-2 border-border/70 px-3">
            <div className="flex items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full text-muted-foreground"
                aria-label="Добавить файлы"
                title="Добавить файлы"
                disabled
              >
                <Paperclip />
              </Button>
              <div className="flex shrink-0 items-center gap-0.5">
                {onToggleMcp &&
                onSetAllTools &&
                isToolEnabled &&
                onToggleTool ? (
                  <AssistantMcpMenu
                    withMcp={withMcp}
                    onToggleMcp={onToggleMcp}
                    onSetAllTools={onSetAllTools}
                    enabledCount={enabledCount}
                    totalCount={totalCount}
                    isToolEnabled={isToolEnabled}
                    onToggleTool={onToggleTool}
                    loading={loading}
                  />
                ) : null}
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
              disabled={loading || !value.trim()}
            >
              {loading ? <Spinner className="size-4" /> : <ArrowUp />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssistantInput;