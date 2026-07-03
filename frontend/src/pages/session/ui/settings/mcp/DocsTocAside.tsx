import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";

import { useTocHashActiveId } from "./useTocHashActiveId";

export type DocsTocItem = {
  id: string;
  label: string;
  depth: 0 | 1;
};

type DocsTocAsideProps = {
  items: readonly DocsTocItem[];
};

export function DocsTocAside({ items }: DocsTocAsideProps) {
  const sectionIds = useMemo(() => items.map((item) => item.id), [items]);
  const activeId = useTocHashActiveId(sectionIds);

  return (
    <aside className="hidden w-56 shrink-0 xl:block">
      <div className="sticky top-16 max-h-[calc(100dvh-6rem)] overflow-y-auto pl-2">
        <header className="mb-2 mt-6 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            На этой странице
          </span>
        </header>
        <ul className="space-y-0.5 border-l border-border/50">
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "-ml-px block border-l-2 py-0.5 text-xs leading-normal transition-colors",
                    item.depth === 1 ? "pl-4" : "pl-3",
                    isActive
                      ? "border-foreground font-medium text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
