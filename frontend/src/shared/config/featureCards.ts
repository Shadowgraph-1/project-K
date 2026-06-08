import { SECTION_ID } from "@/shared/config/sectionIds";

export const FEATURE_CARDS = [
  {
    title: "Проекты и команда",
    description:
      "Создавай проекты, приглашай участников по ссылке и работай вместе с ролями владельца, админа и участника.",
    buttonLink: SECTION_ID.LINES,
  },
  {
    title: "Задачи",
    description:
      "Статусы, приоритеты, подзадачи, даты начала и дедлайны. Карточка задачи с историей изменений и активностью.",
    buttonLink: SECTION_ID.LINES,
  },
  {
    title: "Список и даты",
    description:
      "Смотри задачи списком по статусам или на ленте дат — переключай вид под свой ритм работы.",
    buttonLink: SECTION_ID.LINES,
  },
  {
    title: "AI-компаньон",
    description:
      "Боковой чат рядом с задачами: задавай вопросы по проекту, не уходя со страницы работы.",
    buttonLink: SECTION_ID.LINES,
  },
] as const;
