import * as React from "react";
import { Link } from "react-router-dom";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  ArrowRight,
} from "lucide-react";

import companionImg from "@/assets/features/companion.jpg";
import tasksImg from "@/assets/features/tasks.jpg";
import teamImg from "@/assets/features/team.jpg";
import timelineImg from "@/assets/features/time_line.jpg";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { cn } from "@/shared/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shared/ui/carousel";

const cardClass =
  "group/card relative flex h-[220px] overflow-hidden rounded-2xl border border-white/[0.06] bg-neutral-900/80 transition-all duration-500 hover:border-white/15 hover:shadow-lg hover:shadow-black/30 sm:h-[260px]";

function CardFooter({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent px-4 pb-4 pt-12">
      <span className="text-sm font-medium text-white/70 transition-colors duration-300 group-hover/card:text-white">
        {label}
      </span>
      <span className="flex items-center gap-1 text-sm font-medium text-white/45 transition-all duration-300 group-hover/card:text-white/75">
        Открыть
        <ArrowRight className="size-3.5" />
      </span>
    </div>
  );
}


function SlideBackground({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <img
        src={src}
        alt={alt}
        className="size-full object-cover object-center"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/10 via-neutral-950/20 to-neutral-950/85" />
    </>
  );
}

const PREVIEW_SLIDES = [
  {
    key: "tasks",
    label: "Задачи",
    href: SESSION_PATHS.sessionRoot,
    image: tasksImg,
    alt: "Управление задачами в проекте",
  },
  {
    key: "companion",
    label: "Компаньон",
    href: SESSION_PATHS.sessionRoot,
    image: companionImg,
    alt: "AI-компаньон в проекте",
  },
  {
    key: "team",
    label: "Команда",
    href: SESSION_PATHS.sessionRoot,
    image: teamImg,
    alt: "Совместная работа команды",
  },
  {
    key: "timeline",
    label: "Лента дат",
    href: SESSION_PATHS.sessionRoot,
    image: timelineImg,
    alt: "Лента дат и календарь задач",
  },
] as const;

export function HomePreviewCards({ className }: { className?: string }) {
  const autoScroll = React.useRef(
    AutoScroll({
      playOnInit: true,
      speed: 0.9,
      direction: "forward",
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: false,
    }),
  );

  return (
    <div
      className={cn("relative", className)}
      data-aos="fade-up"
      data-aos-delay="200"
      data-aos-duration="900"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-black to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-black to-transparent sm:w-16" />

      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
        }}
        plugins={[autoScroll.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {PREVIEW_SLIDES.map((slide) => {

            return (
              <CarouselItem
                key={slide.key}
                className="basis-[84%] pl-3 sm:basis-[52%] lg:basis-[40%]"
              >
                <Link to={slide.href} className={cardClass}>
                  <div className="pointer-events-none absolute inset-0 transition-transform duration-500 ease-out group-hover/card:scale-[1.02]">
                    <SlideBackground src={slide.image} alt={slide.alt} />
                  </div>
                  <CardFooter label={slide.label} />
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
