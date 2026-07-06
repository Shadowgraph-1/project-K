export function RouteFallback() {
  return (
    <div
      className="flex min-h-svh items-center justify-center bg-background"
      aria-hidden
    >
      <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground/70" />
    </div>
  );
}