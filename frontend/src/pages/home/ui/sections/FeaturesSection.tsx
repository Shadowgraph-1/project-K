import { FEATURE_CARDS } from "@/shared/config/featureCards";
import { SECTION_ID } from "@/shared/config/sectionIds";

function FeaturesSection() {
  return (
    <section
      id={SECTION_ID.FEATURES}
      className="scroll-mt-20 border-t border-neutral-100 bg-neutral-50 px-4 py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex max-w-xl flex-col gap-3">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400">
            Возможности
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.025em] text-neutral-950 sm:text-4xl">
            Всё что нужно команде
          </h2>
          <p className="text-pretty text-neutral-500 sm:text-lg">
            Задачи с историей статусов, AI-компаньон с контекстом проекта,
            совместная работа и прозрачная аналитика.
          </p>
        </div>

        <ol className="mt-14 grid list-none gap-4 p-0 sm:grid-cols-2 lg:gap-5">
          {FEATURE_CARDS.map((info, index) => (
            <li key={info.title}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-neutral-300 hover:shadow-md">
                <span className="mb-5 inline-flex w-fit rounded-md bg-neutral-950 px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums tracking-wide text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold tracking-tight text-neutral-950">
                  {info.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">
                  {info.description}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default FeaturesSection;