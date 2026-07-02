import { HOME_DEMO_VIDEOS } from "@/shared/config/demo-videos";

import { DemoScrollShowcase } from "@/pages/home/ui/components/DemoScrollShowcase";
import { HomeGlowCard } from "@/pages/home/ui/components/HomeGlowCard";
import { FEATURE_CARDS } from "@/shared/config/featureCards";
import { SECTION_ID } from "@/shared/config/sectionIds";

export default function AboutKonoSection() {
  return (
    <section
      id={SECTION_ID.ABOUT}
      className="scroll-mt-20 border-t border-white/8 bg-black py-20 sm:py-28"
    >
      <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl">
        <div className="max-w-3xl" data-aos="fade-up">
          <p className="text-sm font-medium text-white/40">Что такое Kono</p>
          <h2 className="mt-4 text-pretty text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            Менеджер задач, который не мешает думать
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/45 sm:text-lg">
            Kono собирает проекты, задачи и AI в одном месте. Создайте
            пространство, добавьте задачи и работайте в ритме, который подходит
            вам.
          </p>
        </div>

        <div
          className="home-about-highlights mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          {FEATURE_CARDS.map((item, index) => (
            <HomeGlowCard
              key={item.title}
              title={item.title}
              subtitle={item.description}
              featured
              slotIndex={index}
            />
          ))}
        </div>

        <div className="mt-16 border-t border-white/8 pt-16 sm:mt-20 sm:pt-24">
          <DemoScrollShowcase items={HOME_DEMO_VIDEOS} />
        </div>
      </div>
    </section>
  );
}
