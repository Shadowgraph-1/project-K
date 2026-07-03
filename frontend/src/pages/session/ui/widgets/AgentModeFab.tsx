import { SquareMousePointer } from "lucide-react";

import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { useAgentMode } from "@/pages/session/model/AgentModeContext";
import { cn } from "@/shared/lib/utils";

export function AgentModeFab() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { open: active, toggle } = useAgentMode();

  if (!isAuthenticated) return null;

  return (
    <div className="pointer-events-none absolute bottom-6 right-6 z-50">
      <button
        type="button"
        title={active ? "Закрыть агента" : "Агент"}
        aria-label={active ? "Закрыть агента" : "Открыть агента"}
        aria-pressed={active}
        onClick={toggle}
        className={cn(
          "pointer-events-auto group relative flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full px-3 py-1.5 text-sm font-normal whitespace-nowrap outline-none transition-all duration-200",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "bg-muted/50 text-foreground ring-1 ring-border/50 shadow-sm backdrop-blur-sm",
          "hover:bg-muted/80 hover:ring-border/80",
          active && "bg-muted/80 ring-border/80",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full bg-linear-to-r from-violet-500/10 via-sky-500/10 to-emerald-500/10 transition-opacity duration-300",
            active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        />
        <span className="relative flex items-center gap-1.5">
          <SquareMousePointer className="size-3.5 shrink-0" aria-hidden />
          Агент
        </span>
      </button>
    </div>
  );
}