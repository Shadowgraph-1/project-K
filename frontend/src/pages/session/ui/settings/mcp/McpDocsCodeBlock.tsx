import { Copy } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/shared/lib/utils";

type McpDocsCodeBlockProps = {
  label: string;
  code: string;
  className?: string;
};

export function McpDocsCodeBlock({ label, code, className }: McpDocsCodeBlockProps) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Скопировано");
    } catch {
      toast.error("Не удалось скопировать");
    }
  }

  return (
    <div
      className={cn(
        "not-prose relative mb-5 flex flex-col overflow-hidden rounded-xl border border-border/60 text-left text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-primary/10 px-4 py-2.5">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1">
          <p className="m-0 cursor-default text-xs text-primary">{label}</p>
        </div>
        <button
          type="button"
          onClick={() => void copy()}
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-primary/40 transition-colors hover:bg-primary/5 hover:text-primary"
          aria-label="Копировать"
          title="Копировать"
        >
          <Copy className="size-3.5" aria-hidden />
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="m-0 p-4 font-mono text-[13px] leading-relaxed text-foreground/80">
          <code className="block whitespace-pre">{code}</code>
        </pre>
      </div>
    </div>
  );
}
