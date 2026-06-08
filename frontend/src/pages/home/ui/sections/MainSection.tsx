import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import avatar from "../../../../assets/hero-duo.jpg";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { SECTION_ID } from "@/shared/config/sectionIds";
import { Button } from "@/shared/ui/button";

function MainSection() {
  const sectionScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-neutral-950 px-4 pb-24 pt-8 md:pb-28 md:pt-12">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-neutral-700/20 blur-[140px]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="max-w-xl lg:max-w-136">
          <h1
            className="text-balance text-4xl font-semibold tracking-[-0.03em] text-white sm:text-[3.25rem] sm:leading-[1.07]"
            data-aos="fade-up"
            data-aos-duration="900"
          >
            Управляй проектами.{" "}
            <span className="text-neutral-500">Работай с командой.</span>{" "}
            Спрашивай компаньона.
          </h1>

          <div
            className="mt-8 flex flex-wrap items-center gap-3"
            data-aos="fade-up"
            data-aos-delay="120"
            data-aos-duration="800"
          >
            <Button
              asChild
              size="lg"
              className="h-10 rounded-none bg-white px-6 text-neutral-950 hover:bg-neutral-200"
            >
              <Link to={SESSION_PATHS.sessionRoot}>Открыть проекты</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => sectionScroll(SECTION_ID.FEATURES)}
              className="h-10 rounded-none border-white/20 bg-transparent px-6 text-white shadow-none hover:bg-white/10 hover:text-white"
            >
              Возможности
            </Button>
          </div>
        </div>

        <div
          className="relative w-full max-w-md shrink-0 lg:max-w-lg"
          data-aos="fade-left"
          data-aos-delay="180"
          data-aos-duration="1000"
        >
          <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-neutral-800/60 to-neutral-950 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.06]">
            <img src={avatar} alt="Kono компаньоны" className="w-full object-cover" />
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={() => sectionScroll(SECTION_ID.ABOUT)}
        className="absolute bottom-10 left-1/2 z-10 h-auto -translate-x-1/2 flex-col gap-2 rounded-none px-4 py-2 text-neutral-500 hover:bg-transparent hover:text-neutral-300 md:bottom-14"
        aria-label="К описанию Kono"
        data-aos="fade"
        data-aos-delay="500"
        data-aos-duration="600"
      >
        <span className="font-mono text-[9px] font-medium uppercase tracking-[0.25em]">
          Ниже
        </span>
        <ArrowDown className="size-4 animate-bounce opacity-60" aria-hidden />
      </Button>
    </section>
  );
}

export default MainSection;
