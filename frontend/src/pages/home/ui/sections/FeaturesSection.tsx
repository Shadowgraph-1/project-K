import AutoScroll from "embla-carousel-auto-scroll";

import { HomeBentoCard } from "@/pages/home/ui/components/HomeBentoCard";
import { FEATURE_CAROUSEL_CARDS } from "@/shared/config/featureCards";
import { SECTION_ID } from "@/shared/config/sectionIds";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shared/ui/carousel";

const FEATURES_CAROUSEL_PLUGINS = [
  AutoScroll({
    speed: 0.75,
    startDelay: 0,
    stopOnMouseEnter: true,
    stopOnInteraction: true,
  }),
];

function FeaturesSection() {
  return (
    <section
      id={SECTION_ID.FEATURES}
      className="scroll-mt-20 border-t border-white/8 bg-black px-4 py-16 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl lg:px-6">
        <div
          className="mx-auto max-w-2xl text-center"
          data-aos="fade-up"
          data-aos-duration="750"
        >
          <p className="text-sm font-medium text-white/40">Собрано</p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight text-white sm:text-3xl">
            Всё на одном экране
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-white/45 sm:text-lg">
            Проект, задачи, календарь и компаньон — не разъезжаются по вкладкам.
            Вот как это складывается в одной сессии.
          </p>
        </div>

        <Carousel
          className="home-features-carousel mt-12 w-full min-w-0"
          opts={{ align: "start", loop: true, dragFree: true }}
          plugins={FEATURES_CAROUSEL_PLUGINS}
          data-aos="fade-up"
          data-aos-duration="750"
          data-aos-delay="80"
        >
          <CarouselContent className="-ml-4">
            {FEATURE_CAROUSEL_CARDS.map((card) => (
              <CarouselItem
                key={card.title}
                className="basis-[min(82vw,17.5rem)] pl-4"
              >
                <HomeBentoCard
                  title={card.title}
                  description={card.description}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

export default FeaturesSection;
