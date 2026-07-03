import { cn } from "@/shared/lib/utils";
import type { McpLlmSource } from "@/shared/config/mcp-llm-sources";

type LlmProviderIconProps = {
  source: Pick<McpLlmSource, "logo" | "brandColor" | "logoOnBrand" | "title">;
  className?: string;
};

export function LlmProviderIcon({ source, className }: LlmProviderIconProps) {
  const onBrand = source.logoOnBrand !== false;

  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg p-1.5",
        !onBrand && "ring-1 ring-border/40",
        className,
      )}
      style={{ backgroundColor: source.brandColor }}
      aria-hidden
    >
      <img
        src={source.logo}
        alt=""
        width={32}
        height={32}
        className={cn(
          "size-full object-contain",
          onBrand && "brightness-0 invert",
        )}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
