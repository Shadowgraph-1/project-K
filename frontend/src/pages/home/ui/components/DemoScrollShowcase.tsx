import {
  Bot,
  CircleDot,
  Columns3,
  FolderPlus,
  ListPlus,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { DemoVideo } from "@/shared/config/demo-videos";
import { cn } from "@/shared/lib/utils";

import { DemoVideoPlayer } from "./DemoVideoPlayer";

type DemoScrollShowcaseProps = {
  items: readonly DemoVideo[];
};

const STEP_ICONS: Record<DemoVideo["id"], LucideIcon> = {
  projects: FolderPlus,
  tasks: ListPlus,
  kanban: Columns3,
  statuses: CircleDot,
  ai: Bot,
};

export function DemoScrollShowcase({ items }: DemoScrollShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const elements = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setActiveIndex(index);
        }
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: 0,
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items.length]);

  const setStepRef = useCallback(
    (index: number) => (element: HTMLDivElement | null) => {
      stepRefs.current[index] = element;
    },
    [],
  );

  return (
    <div className="demo-scroll-showcase lg:grid lg:grid-cols-[1fr_1.3fr] lg:gap-16">
      <div className="demo-scroll-showcase__steps">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const Icon = STEP_ICONS[item.id];

          return (
            <div
              key={item.id}
              ref={setStepRef(index)}
              data-index={index}
              className="demo-scroll-showcase__step lg:flex lg:min-h-[50vh] lg:flex-col lg:justify-center"
            >
              <div
                className={cn(
                  "py-10 transition-opacity duration-500 lg:py-0",
                  isActive ? "opacity-100" : "lg:opacity-20",
                )}
              >
                <p className="text-sm font-medium text-white/40">{item.eyebrow}</p>
                <h3 className="mt-3 flex max-w-md items-center gap-2.5 text-pretty text-2xl font-medium tracking-tight text-white sm:gap-3 sm:text-3xl">
                  <Icon
                    className="size-6 shrink-0 text-white/30 sm:size-7"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span>{item.title}</span>
                </h3>
                <p className="mt-4 max-w-md text-pretty leading-relaxed text-white/45">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 lg:hidden">
                <DemoVideoPlayer src={item.src} title={item.title} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative hidden lg:block">
        <div className="demo-scroll-showcase__sticky">
          <div className="demo-scroll-showcase__stack">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "demo-scroll-showcase__layer",
                  index === activeIndex && "demo-scroll-showcase__layer--active",
                )}
                aria-hidden={index !== activeIndex}
              >
                <DemoVideoPlayer
                  src={item.src}
                  title={item.title}
                  playback="controlled"
                  isActive={index === activeIndex}
                  restartOnActivate
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
