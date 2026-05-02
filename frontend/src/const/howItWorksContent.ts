import kaguya from "@/assets/character/Kaguya.png"
import lilly from "@/assets/character/Lilly.png"

export const COMPANIONS = [
  {
    name: "Kaguya",
    label: "Кагуя",
    image: kaguya,
    description:
      "Строгий компаньон для тех, кому нужен четкий ритм, дисциплина и меньше поводов отвлекаться.",
  },
  {
    name: "Lilly",
    label: "Лилли",
    image: lilly,
    description:
      "Мягкая поддержка для спокойной работы: помогает войти в фокус без давления и лишнего шума.",
  },
] as const

export const HOW_IT_WORKS_STEPS = [
  {
    title: "Выбери компаньона",
    description: "Кагуя держит дисциплину, Лилли помогает сохранять спокойный темп.",
  },
  {
    title: "Запусти Pomodoro",
    description: "Работай короткими фокус-сессиями и делай перерывы, когда таймер закончится.",
  },
  {
    title: "Следи за прогрессом",
    description: "Получай XP, сохраняй серии и смотри историю сессий, чтобы видеть рост концентрации.",
  },
] as const
