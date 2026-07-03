import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  MCP_TOOL_CATEGORIES,
  MCP_TOOLS,
  type McpToolCategory,
} from "@/shared/config/mcp-tools";
import { McpLogo } from "@/shared/ui/icons/McpLogo";
import { buttonVariants } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

const TOOL_CATEGORY_ORDER: McpToolCategory[] = [
  "projects",
  "tasks",
  "subtasks",
  "activity",
  "search",
];

type AssistantMcpMenuProps = {
  withMcp: boolean;
  onToggleMcp: () => void;
  onSetAllTools: (enabled: boolean) => void;
  enabledCount: number;
  totalCount: number;
  isToolEnabled: (toolName: string) => boolean;
  onToggleTool: (toolName: string) => void;
  loading?: boolean;
};

function ToolToggleRow({
  name,
  description,
  destructive,
  checked,
  disabled,
  onCheckedChange,
}: {
  name: string;
  description: string;
  destructive?: boolean;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md px-2 py-1.5",
        disabled && "opacity-50",
      )}
      onPointerDown={(event) => event.preventDefault()}
    >
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-mono text-[11px] leading-tight text-foreground",
            destructive && "text-rose-600 dark:text-rose-400",
          )}
        >
          {name}
        </p>
        <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-label={name}
        className="mt-0.5"
      />
    </div>
  );
}

export function AssistantMcpMenu({
  withMcp,
  onToggleMcp,
  onSetAllTools,
  enabledCount,
  totalCount,
  isToolEnabled,
  onToggleTool,
  loading = false,
}: AssistantMcpMenuProps) {
  const [toolsSubOpen, setToolsSubOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openToolsSub = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setToolsSubOpen(true);
  };

  const scheduleCloseToolsSub = () => {
    closeTimerRef.current = setTimeout(() => {
      setToolsSubOpen(false);
      closeTimerRef.current = null;
    }, 120);
  };

  const toolsByCategory = TOOL_CATEGORY_ORDER.map((category) => ({
    category,
    label: MCP_TOOL_CATEGORIES[category],
    tools: MCP_TOOLS.filter((tool) => tool.category === category),
  }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-7 gap-1.5 rounded-md px-2 text-xs font-medium",
          withMcp && enabledCount > 0
            ? "bg-muted text-foreground"
            : "text-muted-foreground",
        )}
        aria-label="MCP"
        title="Model Context Protocol"
        disabled={loading}
      >
        <McpLogo className="size-3.5" />
        <span>MCP</span>
        {withMcp && enabledCount > 0 && enabledCount < totalCount ? (
          <span className="text-[10px] text-muted-foreground">
            {enabledCount}/{totalCount}
          </span>
        ) : null}
        <ChevronDown className="size-3 shrink-0 opacity-70" aria-hidden />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56"
        side="top"
        align="start"
        sideOffset={8}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            <McpLogo className="size-3.5" />
            MCP
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSub open={toolsSubOpen} onOpenChange={setToolsSubOpen}>
            <DropdownMenuSubTrigger
              className="gap-2 py-2 [&_svg:last-child]:rotate-180"
              onPointerEnter={openToolsSub}
              onPointerLeave={scheduleCloseToolsSub}
            >
              <McpLogo className="size-4" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                <span>Инструменты Kono</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  {withMcp && enabledCount > 0
                    ? `${enabledCount} из ${totalCount} включено`
                    : "Наведите для настройки"}
                </span>
              </div>
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent
              className="w-72 max-h-[min(24rem,var(--radix-dropdown-menu-content-available-height))] overflow-y-auto p-1"
              onPointerEnter={openToolsSub}
              onPointerLeave={scheduleCloseToolsSub}
            >
              <div
                className="flex items-center justify-between gap-3 rounded-md px-2 py-2"
                onPointerDown={(event) => event.preventDefault()}
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    Все инструменты
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Главный переключатель MCP
                  </p>
                </div>
                <Switch
                  checked={withMcp && enabledCount > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onSetAllTools(true);
                      if (!withMcp) onToggleMcp();
                    } else {
                      onSetAllTools(false);
                      if (withMcp) onToggleMcp();
                    }
                  }}
                  aria-label="Все инструменты MCP"
                />
              </div>

              <DropdownMenuSeparator className="my-1" />

              {toolsByCategory.map(({ category, label, tools }) => (
                <div key={category} className="py-0.5">
                  <p className="px-2 pb-1 pt-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                  </p>
                  {tools.map((tool) => (
                    <ToolToggleRow
                      key={tool.name}
                      name={tool.name}
                      description={tool.description}
                      destructive={tool.destructive}
                      checked={isToolEnabled(tool.name)}
                      disabled={!withMcp}
                      onCheckedChange={(checked) => {
                        const currentlyEnabled = isToolEnabled(tool.name);
                        if (checked !== currentlyEnabled) {
                          onToggleTool(tool.name);
                        }
                        if (checked && !withMcp) {
                          onToggleMcp();
                        }
                      }}
                    />
                  ))}
                </div>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}