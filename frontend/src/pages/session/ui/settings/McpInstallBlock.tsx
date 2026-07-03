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
      <div className="overflow-hidden rounded-xl border border-border/60 transition-colors hover:border-border">
        <div className="flex items-center border-b border-border/50 px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1" role="tablist">
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
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/70",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => void copy()}
          className="group relative flex w-full min-w-0 items-center px-4 py-3 text-left font-mono text-xs sm:text-sm"
        >
          <code
            className="no-scrollbar w-full min-w-0 overflow-x-auto whitespace-pre text-foreground/70"
            style={{
              maskImage:
                "linear-gradient(to right, black calc(100% - 56px), transparent calc(100% - 40px))",
            }}
          >
            {activeTab.code}
          </code>
          <span className="pointer-events-none absolute right-4 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground">
            <Copy className="size-4" aria-hidden />
          </span>
        </button>
      </div>
      {hint ? (
        <p className="mt-3 text-center text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
