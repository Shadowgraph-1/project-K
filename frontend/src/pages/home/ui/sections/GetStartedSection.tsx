import { Link } from "react-router-dom";
import { Check } from "lucide-react";

import { AUTH_PATHS } from "@/pages/auth/auth-paths";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { SECTION_ID } from "@/shared/config/sectionIds";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

type StartOption = {
  title: string;
  lead: string;
  items: readonly string[];
  cta: { label: string; href: string };
  variant: "primary" | "outline";
};

const START_OPTIONS: StartOption[] = [
  {
    title: "Свой проект",
    lead: "Запустите рабочее пространство с нуля:",
    items: [
      "Регистрация за пару минут",
      "Создание проекта и первых задач",
      "AI-компаньон рядом с задачами",
      "Список, даты и подзадачи в одном месте",
    ],
    cta: { label: "Создать аккаунт", href: AUTH_PATHS.register },
    variant: "primary",
  },
  {
    title: "С командой",
    lead: "Подключитесь к уже существующему проекту:",
    items: [
      "Приглашение по ссылке от владельца",
      "Роли владельца, админа и участника",
      "Общий прогресс и статусы задач",
      "Комментарии и история изменений",
    ],
    cta: { label: "Войти", href: AUTH_PATHS.login },
    variant: "outline",
  },
];

function GetStartedSection() {
  return (
    <section
      id={SECTION_ID.START}
      className="scroll-mt-20 border-t border-white/8 bg-black px-4 py-16 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl lg:px-6 xl:max-w-7xl">
        <h2
          className="mb-10 text-center text-2xl font-medium tracking-tight text-white sm:text-3xl"
          data-aos="fade-up"
          data-aos-duration="750"
        >
          Как начать
        </h2>

        <div
          className="home-start-grid"
          data-aos="fade-up"
          data-aos-duration="750"
          data-aos-delay="80"
        >
          {START_OPTIONS.map((option) => (
            <article key={option.title} className="home-start-card">
              <h3 className="home-start-card__title">{option.title}</h3>
              <p className="home-start-card__lead">{option.lead}</p>

              <hr className="home-start-card__divider" />

              <ul className="home-start-card__list">
                {option.items.map((item) => (
                  <li key={item} className="home-start-card__item">
                    <Check className="home-start-card__check" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <Button
                  asChild
                  size="lg"
                  className={cn(
                    "h-11 w-full rounded-full text-sm font-medium",
                    option.variant === "primary"
                      ? "bg-white text-neutral-950 hover:bg-neutral-200"
                      : "border-white/15 bg-transparent text-white shadow-none hover:bg-white/[0.05] hover:text-white",
                  )}
                  variant={option.variant === "primary" ? "default" : "outline"}
                >
                  <Link to={option.cta.href}>{option.cta.label}</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <p
          className="mt-8 text-center text-sm text-white/35"
          data-aos="fade-up"
          data-aos-duration="750"
          data-aos-delay="140"
        >
          Уже работаете в Kono?{" "}
          <Link
            to={SESSION_PATHS.sessionRoot}
            className="text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Открыть проекты
          </Link>
        </p>
      </div>
    </section>
  );
}

export default GetStartedSection;
