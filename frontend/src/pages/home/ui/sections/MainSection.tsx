import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import avatar from "../../../../assets/hero-duo.jpg";
import { SECTION_ID } from "@/shared/config/sectionIds";

function MainSection() {
  const sectionScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-4 pb-24 pt-8 md:pb-28 md:pt-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
      />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-neutral-300/30 blur-[140px]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="max-w-xl lg:max-w-136">

          <h1 className="text-balance text-4xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-[3.25rem] sm:leading-[1.07]">
            Управляй проектами.{" "}
            <span className="text-neutral-400">Работай с командой.</span>{" "}
            Спрашивай компаньона.
          </h1>

          <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-neutral-500 sm:text-lg">
            Kono — таск-трекер  с AI-компаньоном который знает
            контекст твоих задач. Канбан, подзадачи, спринты и чат прямо внутри
            проекта.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/session"
              className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Открыть рабочее пространство
            </Link>
            <button
              type="button"
              onClick={() => sectionScroll(SECTION_ID.FEATURES)}
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50"
            >
              Возможности
            </button>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-neutral-100 pt-8">
            <div>
              <dt className="font-mono text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                Задачи
              </dt>
              <dd className="mt-1.5 text-sm font-medium text-neutral-950">
                Статусы, приоритеты, подзадачи
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                Интерфейс
              </dt>
              <dd className="mt-1.5 text-sm font-medium text-neutral-950">
                Канбан, список, карточка
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                ИИ
              </dt>
              <dd className="mt-1.5 text-sm font-medium text-neutral-950">
                План дня, разбивка, чат
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative w-full max-w-md shrink-0 lg:max-w-lg">
          <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-neutral-100 to-white blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_32px_80px_-24px_rgba(0,0,0,0.15)] ring-1 ring-black/[0.04]">
            <img src={avatar} alt="Kono компаньоны" className="w-full object-cover" />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => sectionScroll(SECTION_ID.FEATURES)}
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 rounded-full px-4 py-2 text-neutral-400 transition hover:text-neutral-800 md:bottom-14"
        aria-label="К возможностям"
      >
        <span className="font-mono text-[9px] font-medium uppercase tracking-[0.25em]">
          Ниже
        </span>
        <ArrowDown className="size-4 animate-bounce opacity-60" aria-hidden />
      </button>
    </section>
  );
}

export default MainSection;