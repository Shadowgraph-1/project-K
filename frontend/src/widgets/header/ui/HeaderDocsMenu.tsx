import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

import { HOME_DOCS_LINKS } from "@/shared/config/docs-links";
import { cn } from "@/shared/lib/utils";

function DocsMenuItem({
  item,
  onNavigate,
}: {
  item: (typeof HOME_DOCS_LINKS)[number];
  onNavigate: () => void;
}) {
  const className = cn(
    "group flex items-start gap-1.5 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
    "text-white hover:bg-white/8",
  );

  const content = (
    <>
      <div className="min-w-0 flex-1">
        <span className="block">{item.label}</span>
        <span className="block text-[11px] font-normal leading-snug text-white/40">
          {item.description}
        </span>
      </div>
      {item.external ? (
        <ArrowUpRight
          className="ml-auto mt-0.5 size-2.5 shrink-0 text-white/40 opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      ) : null}
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onNavigate}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={item.href} className={className} onClick={onNavigate}>
      {content}
    </Link>
  );
}

export function HeaderDocsMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium outline-none transition-colors",
          "text-white/50 hover:text-white focus-visible:ring-2 focus-visible:ring-white/30",
          open && "text-white",
        )}
      >
        Документация
        <ChevronDown
          className={cn(
            "size-3 shrink-0 opacity-70 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          className="absolute left-0 top-full z-50 pt-2"
          style={{ pointerEvents: "auto" }}
        >
          <div className="origin-top-left animate-in fade-in-0 zoom-in-95 duration-150">
            <div
              role="menu"
              aria-label="Документация"
              className="relative w-[220px] overflow-hidden rounded-xl border border-white/10 bg-neutral-950/95 text-white shadow-xl shadow-black/40 backdrop-blur-xl"
            >
              <div className="relative px-2 py-2">
                {HOME_DOCS_LINKS.map((item) => (
                  <DocsMenuItem
                    key={item.id}
                    item={item}
                    onNavigate={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}