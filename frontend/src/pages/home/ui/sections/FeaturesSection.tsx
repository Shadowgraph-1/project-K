import leftKaguya from "../../../../assets/left_kaguya.jpg";
import rightLilly from "../../../../assets/right_lilly.jpg";
import { FEATURE_CARDS } from "@/shared/config/featureCards";
import { SECTION_ID } from "@/shared/config/sectionIds";

const CARD_ANIMATIONS = [
  { aos: "fade-right", delay: 0 },
  { aos: "fade-left", delay: 80 },
  { aos: "fade-left", delay: 160 },
  { aos: "fade-right", delay: 240 },
] as const;

const sideImageWrap =
  "pointer-events-none absolute -top-px -bottom-px z-0 hidden lg:block";

function FeaturesSection() {
  return (
    <section
      id={SECTION_ID.FEATURES}
      className="relative scroll-mt-20 overflow-hidden border-t border-neutral-800 bg-neutral-950 py-20 md:py-28"
    >
      <div
        className={`${sideImageWrap} left-0`}
        data-aos="fade-right"
        data-aos-duration="850"
      >
        <div className="h-full w-52 xl:w-64 2xl:w-80">
          <div className="h-full overflow-hidden border-y-0 border-r border-neutral-800 bg-neutral-900">
            <img
              src={leftKaguya}
              alt="Kaguya"
              width={1328}
              height={1488}
              className="h-full w-full object-cover object-bottom"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <div
        className={`${sideImageWrap} right-0`}
        data-aos="fade-left"
        data-aos-duration="850"
      >
        <div className="h-full w-52 xl:w-64 2xl:w-80">
          <div className="h-full overflow-hidden border-y-0 border-l border-neutral-800 bg-neutral-900">
            <img
              src={rightLilly}
              alt="Lilly"
              width={1328}
              height={1488}
              className="h-full w-full object-cover object-bottom"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4">
        <div
          className="flex max-w-xl flex-col gap-3"
          data-aos="fade-down"
          data-aos-duration="750"
        >
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-500">
            Возможности
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Что уже есть в Kono
          </h2>
          <p className="text-pretty text-neutral-400 sm:text-lg">
            Задачи с историей изменений, совместные проекты и AI-чат прямо
            в проекте.
          </p>
        </div>

        <ol className="mt-14 grid list-none gap-4 p-0 sm:grid-cols-2 lg:gap-px lg:overflow-hidden lg:border lg:border-neutral-800 lg:bg-neutral-800">
          {FEATURE_CARDS.map((info, index) => {
            const animation = CARD_ANIMATIONS[index] ?? CARD_ANIMATIONS[0];

            return (
              <li
                key={info.title}
                data-aos={animation.aos}
                data-aos-delay={animation.delay}
                data-aos-duration="750"
              >
                <article className="group relative flex h-full flex-col overflow-hidden rounded-none border border-neutral-800 bg-neutral-900 p-6 transition hover:border-neutral-700 hover:bg-neutral-900/80 lg:border-0">
                  <span className="mb-5 inline-flex w-fit rounded-none bg-white px-2.5 py-1 font-mono text-[10px] font-semibold tabular-nums tracking-wide text-neutral-950">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-semibold tracking-tight text-white">
                    {info.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-400">
                    {info.description}
                  </p>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default FeaturesSection;
