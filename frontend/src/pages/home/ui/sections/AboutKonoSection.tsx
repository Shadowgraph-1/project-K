import chibi from "../../../../assets/chibi.jpg";
import { SECTION_ID } from "@/shared/config/sectionIds";

function AboutKonoSection() {
  return (
    <section
      id={SECTION_ID.ABOUT}
      className="scroll-mt-20 border-t border-neutral-100 bg-neutral-50 px-4 py-16 md:py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:items-center md:justify-between md:gap-12 lg:gap-16">
        <div className="min-w-0 flex-1">
          <p
            className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400"
            data-aos="fade-right"
            data-aos-duration="650"
          >
            Что такое Kono
          </p>
          <h2
            className="mt-5 max-w-3xl text-pretty text-xl font-medium leading-snug tracking-tight text-neutral-950 sm:text-2xl sm:leading-tight md:text-[1.75rem]"
            data-aos="zoom-in-up"
            data-aos-delay="120"
            data-aos-duration="850"
          >
            Kono — таск-трекер с AI-компаньоном для небольших команд. Задачи,
            подзадачи, список и лента дат — плюс чат прямо в проекте.
          </h2>
        </div>

        <div
          className="relative w-full max-w-sm shrink-0 md:max-w-md lg:max-w-88"
          data-aos="fade-left"
          data-aos-delay="180"
          data-aos-duration="850"
        >
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.12)]">
            <img
              src={chibi}
              alt="Kono AI-компаньоны"
              width={1328}
              height={1488}
              className="block h-auto w-full"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutKonoSection;
