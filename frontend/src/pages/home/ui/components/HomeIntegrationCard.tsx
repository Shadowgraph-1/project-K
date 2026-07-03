import type { ReactNode } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

type HomeIntegrationCardProps = {
  title: string;
  description: string;
  href: string;
  external?: boolean;
  icon: ReactNode;
};

const CARD_CLASS =
  "group flex h-full items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/12 hover:bg-white/[0.04]";

export function HomeIntegrationCard({
  title,
  description,
  href,
  external = false,
  icon,
}: HomeIntegrationCardProps) {
  const body = (
    <>
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-white/88">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-white/38">
          {description}
        </span>
      </span>
      {external ? (
        <ExternalLink
          className="size-3.5 shrink-0 text-white/30 transition-opacity group-hover:text-white/50"
          aria-hidden
        />
      ) : (
        <ChevronRight
          className="size-3.5 shrink-0 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-white/50"
          aria-hidden
        />
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={CARD_CLASS}>
        {body}
      </a>
    );
  }

  return (
    <Link to={href} className={CARD_CLASS}>
      {body}
    </Link>
  );
}
