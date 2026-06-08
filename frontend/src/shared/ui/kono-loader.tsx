import { cn } from "@/shared/lib/utils";
import { Spinner } from "@/shared/ui/spinner";

type KonoLoaderProps = {
  className?: string;
  hint?: string;
  size?: "sm" | "md";
};

export function KonoLoader({
  className,
  hint,
  size = "md",
}: KonoLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 text-center",
        className,
      )}
      role="status"
      aria-busy="true"
      aria-label="Загрузка"
    >
      <Spinner className={size === "sm" ? "size-5" : "size-6"} />
      {hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

type KonoLoadingPanelProps = {
  className?: string;
  hint?: string;
  fill?: boolean;
};

export function KonoLoadingPanel({
  className,
  hint,
  fill = true,
}: KonoLoadingPanelProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center px-4 py-10",
        fill && "min-h-[min(420px,52dvh)] flex-1",
        className,
      )}
    >
      <KonoLoader hint={hint} />
    </div>
  );
}
