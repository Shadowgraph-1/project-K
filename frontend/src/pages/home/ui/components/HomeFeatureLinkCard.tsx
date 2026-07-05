import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import type { HomeFeatureLink } from "@/shared/config/home-feature-links";
import { cn } from "@/shared/lib/utils";
import { McpLogo } from "@/shared/ui/icons/McpLogo";

type HomeFeatureLinkCardProps = {
  item: HomeFeatureLink;
};

function FeatureLinkVisual({ item }: HomeFeatureLinkCardProps) {
  const { icon, path, accent } = item;

  return (
    <div
      className={cn(
        "home-features-home__visual relative flex aspect-[5/3] items-center justify-center overflow-hidden",
        "bg-linear-to-b",
        accent,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 120%, rgb(255 255 255 / 0.08), transparent 58%)",
        }}
        aria-hidden
      />
      <div className="relative flex flex-col items-center gap-2.5">
        {icon.type === "mcp" ? (
          <McpLogo className="size-9 text-white/88" />
        ) : icon.type === "lucide" ? (
          <icon.icon className="size-9 text-white/88" strokeWidth={1.5} />
        ) : (
          <img
            src={icon.src}
            alt={icon.alt}
            width={36}
            height={36}
            className="size-9 object-contain"
            loading="lazy"
            decoding="async"
          />
        )}
        <span className="font-mono text-sm tracking-tight text-white/55">
          {path}
        </span>
      </div>
    </div>
  );
}

export function HomeFeatureLinkCard({ item }: HomeFeatureLinkCardProps) {
  return (
    <Link to={item.href} className="home-features-home__card group">
      <FeatureLinkVisual item={item} />
      <div className="home-features-home__body">
        <div className="flex items-start justify-between gap-2">
          <h3 className="home-features-home__title">{item.title}</h3>
          <ChevronRight
            className="mt-0.5 size-4 shrink-0 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-white/45"
            aria-hidden
          />
        </div>
        <p className="home-features-home__description">{item.description}</p>
      </div>
    </Link>
  );
}