import { SECTION_ID } from "@/const/sectionIds"

export const FEATURE_CARDS = [
  {
    title: "Персонализированные компаньоны",
    description:
      "Выбирай строгую дисциплину или мягкую поддержку под свой рабочий ритм.",
    buttonText: "Подробнее",
    buttonLink: SECTION_ID.HOW_IT_WORKS,
  },
  {
    title: "Награды и мотивация",
    description:
      "Зарабатывай XP за завершенные сессии и поддерживай интерес к регулярной работе.",
    buttonText: "Подробнее",
    buttonLink: SECTION_ID.REWARDS,
  },
  {
    title: "Удобный Pomodoro-таймер",
    description:
      "Запускай фокус-сессии, переключайся на перерывы и всегда видь текущий этап.",
    buttonText: "Подробнее",
    buttonLink: SECTION_ID.TIMER,
  },
  {
    title: "Ведение истории и серии",
    description:
      "Отслеживай прошлые сессии, опыт и прогресс, чтобы видеть свой рост со временем.",
    buttonText: "Подробнее",
    buttonLink: SECTION_ID.HISTORY,
  },
] as const
