import { useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/shared/lib/utils";

type InstallTab = {
  id: string;
  label: string;
  code: string;
};

type McpInstallBlockProps = {
  tabs: InstallTab[];
  className?: string;
  hint?: string;
};

export function McpInstallBlock({ tabs, className, hint }: McpInstallBlockProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");

  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  async function copy() {
    if (!activeTab) return;
    try {
      await navigator.clipboard.writeText(activeTab.code);
      toast.success("Скопировано");
    } catch {
      toast.error("Не удалось скопировать");
    }
  }

  if (!activeTab) return null;

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-hidden rounded-xl border border-border/60 text-left transition-colors hover:border-border">
        <div className="flex items-center gap-2 border-b border-primary/10 px-4 py-2.5">
          <div
            className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1"
            role="tablist"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={tab.id === activeId}
                onClick={() => setActiveId(tab.id)}
                className={cn(
                  "cursor-pointer text-xs transition-colors duration-200",
                  tab.id === activeId
                    ? "text-primary"
                    : "text-primary/40 hover:text-primary/70",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void copy()}
            aria-label="Копировать"
            title="Копировать"
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-primary/40 transition-colors hover:bg-primary/5 hover:text-primary"
          >
            <Copy className="size-3.5" aria-hidden />
          </button>
        </div>

        <div className="overflow-x-auto">
          <pre className="m-0 min-w-0 p-4 text-left font-mono text-[13px] leading-relaxed text-foreground/80">
            <code className="block whitespace-pre">{activeTab.code}</code>
          </pre>
        </div>
      </div>
      {hint ? (
        <p className="mt-3 text-center text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
