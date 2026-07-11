import { Link } from "react-router-dom";

import type { HomeFeatureLink } from "@/shared/config/home-feature-links";
import { cn } from "@/shared/lib/utils";
import { McpLogo } from "@/shared/ui/icons/McpLogo";

type HomeFeatureLinkCardProps = {
  item: HomeFeatureLink;
};

function FeatureLinkIcon({ item }: HomeFeatureLinkCardProps) {
  const { icon } = item;

  if (icon.type === "mcp") {
    return (
      <McpLogo className="size-5 shrink-0 text-white drop-shadow-[0_2px_12px_rgb(0_0_0/0.45)]" />
    );
  }

  if (icon.type === "kono") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={20}
        height={20}
        aria-hidden
        className="size-5 shrink-0 text-white drop-shadow-[0_2px_12px_rgb(0_0_0/0.45)]"
      >
        <path
          fill="currentColor"
          d="M18 15h9v13.6L40.5 15H50L35.8 31.4 50.5 49H40.8L27 35.4V49h-9V15z"
        />
      </svg>
    );
  }

  if (icon.type === "lucide") {
    return (
      <icon.icon
        className="size-5 shrink-0 text-white drop-shadow-[0_2px_12px_rgb(0_0_0/0.45)]"
        strokeWidth={1.75}
      />
    );
  }

  return null;
}

export function HomeFeatureLinkCard({ item }: HomeFeatureLinkCardProps) {
  return (
    <Link to={item.href} className="group/card block min-w-0">
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-white/[0.06] bg-[rgb(10,10,10)]",
          "transition-all duration-500",
          "group-hover/card:border-white/15 group-hover/card:shadow-md group-hover/card:shadow-black/20",
        )}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "1200 / 630" }}
        >
          <img
            src={item.image}
            alt=""
            width={1200}
            height={630}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.02]"
            loading="lazy"
            decoding="async"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/15 via-black/5 to-black/35"
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="flex items-center gap-2">
              <FeatureLinkIcon item={item} />
              <span className="font-mono text-sm font-medium tracking-tight text-white/90 [text-shadow:0_2px_16px_rgb(0_0_0/0.55)]">
                {item.path}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <h3
          className={cn(
            "text-sm font-medium leading-snug tracking-tight text-white/80",
            "transition-colors duration-300 group-hover/card:text-white",
          )}
        >
          {item.title}
        </h3>
      </div>
    </Link>
  );
}