import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { HomeFeatureLinkCard } from "@/pages/home/ui/components/HomeFeatureLinkCard";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { HOME_FEATURE_LINKS } from "@/shared/config/home-feature-links";
import { SECTION_ID } from "@/shared/config/sectionIds";
import { Button } from "@/shared/ui/button";

const sectionScroll = (id: string) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

function MainSection() {
  return (
    <section className="relative flex min-h-dvh flex-col justify-start overflow-hidden bg-black px-4 pb-16 pt-24 sm:pb-20 sm:pt-28 md:pt-32">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-neutral-600/15 blur-[120px]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-10 sm:gap-12 lg:max-w-7xl">
        <div className="w-full max-w-3xl text-center">
          <h1
            className="text-balance text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
            data-aos="fade-up"
            data-aos-duration="900"
          >
            Проекты и задачи
            <br />
            для всей команды
          </h1>

          <p
            className="mx-auto mt-5 max-w-lg text-pretty text-lg leading-relaxed text-white/40"
            data-aos="fade-up"
            data-aos-delay="80"
            data-aos-duration="800"
          >
            А также чат с персональным компаньоном.
          </p>

          <div
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
            data-aos="fade-up"
            data-aos-delay="140"
            data-aos-duration="800"
          >
            <Button
              asChild
              size="lg"
              className="h-11 rounded-full bg-white px-6 text-neutral-950 hover:bg-neutral-200"
            >
              <Link to={SESSION_PATHS.sessionRoot}>
                Открыть проекты
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => sectionScroll(SECTION_ID.ABOUT)}
              className="h-11 rounded-full border-white/15 bg-transparent px-6 text-white shadow-none hover:bg-white/[0.05] hover:text-white"
            >
              Возможности
            </Button>
          </div>
        </div>

        <div
          className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {HOME_FEATURE_LINKS.map((item) => (
            <HomeFeatureLinkCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default MainSection;
