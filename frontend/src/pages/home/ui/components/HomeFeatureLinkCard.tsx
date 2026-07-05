import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import type { HomeFeatureLink } from "@/shared/config/home-feature-links";
import { McpLogo } from "@/shared/ui/icons/McpLogo";

type HomeFeatureLinkCardProps = {
  item: HomeFeatureLink;
};

function FeatureLinkIcon({ item }: HomeFeatureLinkCardProps) {
  const { icon } = item;

  if (icon.type === "mcp") {
    return <McpLogo className="size-10 text-white drop-shadow-[0_2px_12px_rgb(0_0_0/0.45)]" />;
  }

  if (icon.type === "lucide") {
    return (
      <icon.icon
        className="size-10 text-white drop-shadow-[0_2px_12px_rgb(0_0_0/0.45)]"
        strokeWidth={1.5}
      />
    );
  }

  return (
    <img
      src={icon.src}
      alt={icon.alt}
      width={40}
      height={40}
      className="size-10 object-contain drop-shadow-[0_2px_12px_rgb(0_0_0/0.45)]"
      loading="lazy"
      decoding="async"
    />
  );
}

export function HomeFeatureLinkCard({ item }: HomeFeatureLinkCardProps) {
  return (
    <Link to={item.href} className="home-features-home__card group">
      <div className="home-features-home__visual">
        <img
          src={item.image}
          alt=""
          width={400}
          height={300}
          className="home-features-home__photo"
          loading="lazy"
          decoding="async"
        />
        <div className="home-features-home__scrim" aria-hidden />
        <div className="home-features-home__overlay">
          <FeatureLinkIcon item={item} />
          <span className="home-features-home__path">{item.path}</span>
          <h3 className="home-features-home__title">{item.title}</h3>
        </div>
      </div>
      <div className="home-features-home__body">
        <p className="home-features-home__description">{item.description}</p>
        <ChevronRight
          className="home-features-home__arrow"
          aria-hidden
        />
      </div>
    </Link>
  );
}