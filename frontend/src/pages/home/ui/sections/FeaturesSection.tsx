import leftKaguya from "../../../../assets/left_kaguya.jpg";
import rightLilly from "../../../../assets/right_lilly.jpg";
import { FeatureCard } from "@/pages/home/ui/components/FeatureCard";
import { FeaturesCompanionFigure } from "@/pages/home/ui/components/FeaturesCompanionFigure";
import { FEATURE_CARDS } from "@/shared/config/featureCards";
import { SECTION_ID } from "@/shared/config/sectionIds";

const CARD_ANIMATIONS = [
  { aos: "fade-up", delay: 0 },
  { aos: "fade-up", delay: 80 },
  { aos: "fade-up", delay: 160 },
  { aos: "fade-up", delay: 240 },
] as const;

function FeaturesSection() {
  return (
    <section
      id={SECTION_ID.FEATURES}
      className="relative scroll-mt-20 overflow-hidden bg-black py-20 md:py-28"
    >
      <FeaturesCompanionFigure
        side="left"
        image={leftKaguya}
        alt="Кагуя — AI-компаньон Kono"
        aos="fade-right"
      />

      <FeaturesCompanionFigure
        side="right"
        image={rightLilly}
        alt="Лилли — AI-компаньон Kono"
        aos="fade-left"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div
          className="mx-auto flex max-w-2xl flex-col gap-3 text-center"
          data-aos="fade-up"
          data-aos-duration="750"
        >
          <p className="text-sm font-medium text-white/40">Возможности</p>
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Что уже есть в Kono
          </h2>
          <p className="text-pretty text-white/45 sm:text-lg">
            Задачи с историей изменений, совместные проекты и AI-чат прямо в
            проекте — Кагуя и Лилли всегда рядом с вашими задачами.
          </p>
        </div>

        <ol className="home-features-grid mt-14 list-none p-0">
          {FEATURE_CARDS.map((info, index) => {
            const animation = CARD_ANIMATIONS[index] ?? CARD_ANIMATIONS[0];

            return (
              <li
                key={info.title}
                className="h-full"
                data-aos={animation.aos}
                data-aos-delay={animation.delay}
                data-aos-duration="750"
              >
                <FeatureCard
                  title={info.title}
                  description={info.description}
                />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default FeaturesSection;