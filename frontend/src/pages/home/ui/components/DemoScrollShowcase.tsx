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

function syncStickyVideos(
  videos: Array<HTMLVideoElement | null>,
  activeIndex: number,
  restartOnActivate: boolean,
) {
  videos.forEach((video, index) => {
    if (!video) return;

    if (index === activeIndex) {
      if (restartOnActivate) video.currentTime = 0;
      void video.play().catch(() => undefined);
      return;
    }

    video.pause();
  });
}

export function DemoScrollShowcase({ items }: DemoScrollShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stickyVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const setStickyVideoRef = useCallback(
    (index: number) => (node: HTMLVideoElement | null) => {
      stickyVideoRefs.current[index] = node;
      if (node && index === activeIndex) {
        syncStickyVideos(stickyVideoRefs.current, activeIndex, true);
      }
    },
    [activeIndex],
  );

  useEffect(() => {
    syncStickyVideos(stickyVideoRefs.current, activeIndex, false);
  }, [activeIndex]);

  useEffect(() => {
    const elements = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (Number.isNaN(index)) continue;
          setActiveIndex(index);
          syncStickyVideos(stickyVideoRefs.current, index, true);
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
    <div className="lg:grid lg:grid-cols-[1fr_1.3fr] lg:gap-16">
      <div>
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const Icon = STEP_ICONS[item.id];

          return (
            <div
              key={item.id}
              ref={setStepRef(index)}
              data-index={index}
              className="lg:flex lg:min-h-[50vh] lg:flex-col lg:justify-center"
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
        <div className="sticky top-[calc(50vh-14rem)]">
          <div className="relative w-full">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "w-full transition-opacity duration-500",
                  index === activeIndex
                    ? "relative z-10 opacity-100"
                    : "pointer-events-none absolute inset-x-0 top-0 opacity-0",
                )}
                aria-hidden={index !== activeIndex}
              >
                <DemoVideoPlayer
                  src={item.src}
                  title={item.title}
                  onVideoRef={setStickyVideoRef(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
