import { SECTION_ID } from "@/shared/config/sectionIds";

const STEPS = [
  {
    step: "01",
    title: "Создай рабочее пространство",
    description:
      "Зарегистрируйся, создай воркспейс и пригласи команду по ссылке. Каждый участник получает свою роль и доступ к проектам.",
  },
  {
    step: "02",
    title: "Разбей проект на задачи",
    description:
      "Добавляй задачи, назначай исполнителей, приоритеты и дедлайны. Создавай подзадачи и группируй работу по спринтам.",
  },
  {
    step: "03",
    title: "Работай в удобном виде",
    description:
      "Переключайся между канбан-доской и списком. Перетаскивай карточки между статусами — история каждого изменения сохраняется.",
  },
  {
    step: "04",
    title: "Спроси компаньона",
    description:
      "AI-компаньон видит твои задачи и контекст проекта. Спроси что делать сегодня, попроси разбить сложную задачу на шаги — он ответит конкретно.",
  },
] as const;

function HowItWorksSection() {
  return (
    <section
      id={SECTION_ID.LINES}
      className="scroll-mt-20 border-t border-neutral-800 bg-neutral-950 px-4 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col gap-3">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-500">
            Kono · Как это работает
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.025em] text-white sm:text-4xl">
            От идеи до результата
          </h2>
          <p className="max-w-lg text-pretty text-neutral-400 sm:text-lg">
            Четыре шага — от создания пространства до работы с AI-компаньоном
            прямо внутри проекта.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl bg-neutral-800 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ step, title, description }) => (
            <div
              key={step}
              className="flex flex-col gap-4 bg-neutral-950 p-6 transition hover:bg-neutral-900"
            >
              <span className="font-mono text-[11px] font-semibold tabular-nums text-neutral-600">
                {step}
              </span>
              <h3 className="text-sm font-semibold leading-snug text-white">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;