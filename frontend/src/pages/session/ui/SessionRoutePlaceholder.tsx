import { Layers } from "lucide-react";

type SessionRoutePlaceholderProps = {
  title: string;
  description: string;
};

export function SessionRoutePlaceholder({
  title,
  description,
}: SessionRoutePlaceholderProps) {
  return (
    <div className="flex min-h-[min(420px,60vh)] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/80 bg-muted/10 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Layers className="size-6 text-muted-foreground" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
