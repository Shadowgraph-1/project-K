import { cn } from "@/shared/lib/utils";
import type { ConnectorDefinition } from "@/shared/config/connectors";

type ConnectorIconProps = {
  connector: Pick<ConnectorDefinition, "name" | "logo" | "brandColor" | "logoOnBrand">;
  inactive?: boolean;
  className?: string;
};

export function ConnectorIcon({
  connector,
  inactive = false,
  className,
}: ConnectorIconProps) {
  const onBrand = connector.logoOnBrand !== false;

  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg p-1.5 transition-[filter,opacity]",
        inactive && "bg-muted ring-1 ring-border/50 grayscale",
        className,
      )}
      style={inactive ? undefined : { backgroundColor: connector.brandColor }}
      aria-hidden
    >
      <img
        src={connector.logo}
        alt=""
        width={32}
        height={32}
        className={cn(
          "size-full object-contain",
          onBrand && !inactive && "brightness-0 invert",
          inactive && "opacity-70 dark:invert",
        )}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
