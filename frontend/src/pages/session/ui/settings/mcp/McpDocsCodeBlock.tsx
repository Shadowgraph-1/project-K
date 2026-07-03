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
        "not-prose relative mb-5 flex flex-col overflow-hidden rounded-xl border border-border bg-muted/25 text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
        <p className="m-0 text-xs capitalize text-muted-foreground">{label}</p>
        <button
          type="button"
          onClick={() => void copy()}
          className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Копировать"
        >
          <Copy className="size-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="m-0 p-4 font-mono text-[13px] leading-relaxed text-foreground/85">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
