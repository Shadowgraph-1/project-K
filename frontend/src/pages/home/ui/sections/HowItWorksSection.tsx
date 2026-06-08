import { SECTION_ID } from "@/shared/config/sectionIds";

const STEPS = [
  {
    step: "01",
    title: "Создай проект",
    description:
      "Зарегистрируйся, создай проект и пригласи команду. Участники получают роль и доступ к общим задачам.",
  },
  {
    step: "02",
    title: "Добавь задачи",
    description:
      "Создавай задачи с приоритетами, дедлайнами и подзадачами. Меняй статус — каждое изменение попадает в историю.",
  },
  {
    step: "03",
    title: "Выбери вид",
    description:
      "Работай списком по статусам или смотри задачи на ленте дат. Открывай карточку задачи, когда нужны детали.",
  },
  {
    step: "04",
    title: "Спроси компаньона",
    description:
      "AI-чат в боковой панели рядом с задачами — задавай вопросы по проекту, не переключаясь на другой экран.",
  },
] as const;

const STEP_ANIMATIONS = [
  { aos: "flip-left", delay: 0 },
  { aos: "flip-up", delay: 100 },
  { aos: "flip-up", delay: 200 },
  { aos: "flip-right", delay: 300 },
] as const;

function HowItWorksSection() {
  return (
    <section
      id={SECTION_ID.LINES}
      className="scroll-mt-20 border-t border-neutral-100 bg-neutral-50 px-4 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div
          className="mb-14 flex max-w-xl flex-col gap-3"
          data-aos="fade-left"
          data-aos-duration="800"
        >
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400">
            Kono · Как это работает
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            От идеи до результата
          </h2>
          <p className="max-w-lg text-pretty text-neutral-500 sm:text-lg">
            Четыре шага — от создания проекта до работы с AI-компаньоном
            прямо внутри проекта.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-none border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ step, title, description }, index) => {
            const animation = STEP_ANIMATIONS[index] ?? STEP_ANIMATIONS[0];

            return (
              <div
                key={step}
                className="flex flex-col gap-4 bg-white p-6 transition hover:bg-neutral-50"
                data-aos={animation.aos}
                data-aos-delay={animation.delay}
                data-aos-duration="700"
              >
                <span className="font-mono text-[11px] font-semibold tabular-nums text-neutral-400">
                  {step}
                </span>
                <h3 className="text-sm font-semibold leading-snug text-neutral-950">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-500">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
